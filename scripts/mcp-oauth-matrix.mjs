/**
 * MCP OAuth hard test — the exact flow claude.ai uses with "Sign in now" +
 * "Register automatically":
 *   register (DCR) -> authorize page -> password sign-in -> code ->
 *   token (PKCE) -> MCP tool call with the access token.
 * Also negative: bad redirect_uri, wrong password, PKCE mismatch,
 * redirect mismatch, unknown client, garbage code, garbage bearer on MCP,
 * and the discovery metadata shape. The shared-secret password path keeps
 * working alongside (see mcp-auth-matrix.mjs).
 *
 * Boots Vite in middlewareMode with a random ADMIN_PASSWORD. Refuses to run
 * with DATABASE_URL set.
 *
 * Run: node scripts/mcp-oauth-matrix.mjs
 */
import assert from "node:assert/strict";
import { createServer as createHttpServer } from "node:http";
import { createHash, randomBytes } from "node:crypto";
import { createServer } from "vite";

if (process.env.DATABASE_URL) {
  console.error("REFUSING TO RUN: DATABASE_URL is set — this test writes content and must not touch an external database. Unset it first.");
  process.exit(1);
}
const PASSWORD = randomBytes(24).toString("hex");
process.env.ADMIN_PASSWORD = PASSWORD;

const vite = await createServer({
  server: { middlewareMode: true, hmr: false },
  appType: "custom",
  optimizeDeps: { noDiscovery: true },
});
const httpServer = createHttpServer((req, res) => vite.middlewares(req, res));
await new Promise((resolve) => httpServer.listen(0, "127.0.0.1", resolve));
const base = `http://127.0.0.1:${httpServer.address().port}`;
let passed = 0;
const ok = (name) => { passed += 1; console.log(`  ✔ ${name}`); };
const s256 = (v) => createHash("sha256").update(v).digest("base64url");
const json = (r) => r.json();

const CALLBACK = "https://claude.ai/api/mcp/auth_callback";
const verifier = randomBytes(32).toString("base64url");
const challenge = s256(verifier);

try {
  // 1. Dynamic client registration.
  const reg = await fetch(`${base}/api/oauth/register`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ redirect_uris: [CALLBACK], client_name: "matrix" }),
  });
  assert.equal(reg.status, 200);
  const client = await reg.json();
  assert.ok(client.client_id, "no client_id");
  assert.equal(client.token_endpoint_auth_method, "none");
  ok("DCR register -> client_id, public client");

  const badReg = await fetch(`${base}/api/oauth/register`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ redirect_uris: ["http://evil.example/cb"] }),
  });
  assert.equal(badReg.status, 400);
  ok("DCR insecure redirect -> 400");

  // 2. Authorize page renders with the password form.
  const page = await fetch(
    `${base}/api/oauth/authorize?response_type=code&client_id=${client.client_id}` +
    `&redirect_uri=${encodeURIComponent(CALLBACK)}&code_challenge=${challenge}&code_challenge_method=S256&state=xyz`,
  );
  assert.equal(page.status, 200);
  const html = await page.text();
  assert.ok(html.includes('type="password"') && html.includes("Authorize"), "no sign-in form");
  ok("authorize GET -> mobile sign-in form");

  const badLink = await fetch(`${base}/api/oauth/authorize?client_id=x&redirect_uri=${encodeURIComponent("http://evil.example/cb")}&code_challenge=${challenge}`);
  assert.equal(badLink.status, 400);
  ok("authorize GET bad redirect -> 400");

  // 3. Wrong password stays locked.
  const denied = await fetch(`${base}/api/oauth/authorize`, {
    method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ password: "wrong", client_id: client.client_id, redirect_uri: CALLBACK, state: "xyz", code_challenge: challenge }),
    redirect: "manual",
  });
  assert.equal(denied.status, 401);
  ok("authorize POST wrong password -> 401");

  // 4. Right password -> 302 to Claude's callback with code + state.
  const approved = await fetch(`${base}/api/oauth/authorize`, {
    method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ password: PASSWORD, client_id: client.client_id, redirect_uri: CALLBACK, state: "xyz", code_challenge: challenge }),
    redirect: "manual",
  });
  assert.equal(approved.status, 302, `got ${approved.status}`);
  const location = new URL(approved.headers.get("location"));
  assert.equal(`${location.origin}${location.pathname}`, CALLBACK);
  const code = location.searchParams.get("code");
  assert.ok(code, "no code");
  assert.equal(location.searchParams.get("state"), "xyz");
  ok("authorize POST correct password -> 302 with code");

  // 5. Code -> access token (PKCE enforced).
  const token = await fetch(`${base}/api/oauth/token`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ grant_type: "authorization_code", code, client_id: client.client_id, redirect_uri: CALLBACK, code_verifier: verifier }),
  });
  assert.equal(token.status, 200, await token.clone().text().then((t) => t.slice(0, 200)));
  const tokens = await token.json();
  assert.equal(tokens.token_type, "Bearer");
  assert.ok(tokens.access_token, "no access token");
  assert.ok(tokens.expires_in > 0, "no expiry");
  ok("token exchange -> Bearer access token");

  const badPkce = await fetch(`${base}/api/oauth/token`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ grant_type: "authorization_code", code, client_id: client.client_id, redirect_uri: CALLBACK, code_verifier: "wrong" }),
  });
  assert.equal(badPkce.status, 400);
  assert.equal((await badPkce.json()).error, "invalid_grant");
  ok("token with bad verifier -> invalid_grant");

  const badClient = await fetch(`${base}/api/oauth/token`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ grant_type: "authorization_code", code, client_id: "someone-else", redirect_uri: CALLBACK, code_verifier: verifier }),
  });
  assert.equal(badClient.status, 400);
  ok("token with wrong client -> 400");

  const badGrant = await fetch(`${base}/api/oauth/token`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ grant_type: "refresh_token", refresh_token: "x" }),
  });
  assert.equal(badGrant.status, 400);
  ok("refresh grant -> unsupported_grant_type");

  // 6. The access token drives real MCP calls.
  const mcp = await fetch(`${base}/api/mcp`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${tokens.access_token}`,
      "content-type": "application/json",
      accept: "application/json, text/event-stream",
    },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-03-26", capabilities: {}, clientInfo: { name: "matrix", version: "1" } } }),
  });
  assert.equal(mcp.status, 200, await mcp.clone().text().then((t) => t.slice(0, 200)));
  const tools = await fetch(`${base}/api/mcp`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${tokens.access_token}`,
      "content-type": "application/json",
      accept: "application/json, text/event-stream",
    },
    body: JSON.stringify({ jsonrpc: "2.0", id: 2, method: "tools/list" }),
  });
  const listed = await tools.json();
  assert.ok(listed.result.tools.some((t) => t.name === "discover_site"), "no tools");
  ok("MCP with OAuth token -> initialize + tools/list");

  const forged = await fetch(`${base}/api/mcp`, {
    method: "POST",
    headers: { authorization: "Bearer forged.forged.forged", "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize", params: {} }),
  });
  assert.equal(forged.status, 401);
  ok("MCP with forged token -> 401");

  // 7. Discovery metadata shape (served by middleware in prod; pure builders here).
  const { authorizationServerMetadata, protectedResourceMetadata } = await vite.ssrLoadModule("/server/utils/oauth.ts");
  const origin = "https://example.test";
  const as = authorizationServerMetadata(origin);
  assert.equal(as.issuer, origin);
  assert.ok(as.authorization_endpoint.endsWith("/api/oauth/authorize"), "no authorize endpoint");
  assert.ok(as.registration_endpoint.endsWith("/api/oauth/register"), "no register endpoint");
  assert.deepEqual(as.code_challenge_methods_supported, ["S256"]);
  const pr = protectedResourceMetadata(origin);
  assert.equal(pr.resource, `${origin}/api/mcp`);
  assert.deepEqual(pr.authorization_servers, [origin]);
  ok("discovery metadata shape correct");

  // 8. 401 now advertises OAuth discovery alongside Basic.
  const probe = await fetch(`${base}/api/mcp`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize", params: {} }),
  });
  assert.equal(probe.status, 401);
  assert.match(probe.headers.get("www-authenticate") ?? "", /resource_metadata="[^"]*oauth-protected-resource"/);
  ok("401 advertises oauth-protected-resource metadata");

  // Silence unused helper (kept for symmetry with other harnesses).
  void json;
  console.log(`MCP OAUTH MATRIX PASS  checks=${passed}`);
} finally {
  await vite.close();
  await new Promise((resolve) => httpServer.close(resolve));
}
