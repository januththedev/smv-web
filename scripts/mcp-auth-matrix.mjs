/**
 * MCP auth-matrix hard test — exercises /api/mcp the way real AI clients
 * (Claude custom connectors, Claude Code, Cursor) actually connect, not just
 * the happy path:
 *   - no auth / wrong secret (Basic, Bearer, raw) -> 401 + WWW-Authenticate
 *   - Basic user:pass, Basic bare-password, Bearer, raw pasted secret -> full
 *     initialize -> tools/list -> tools/call roundtrip with a real edit each
 *   - GET with auth -> 405, GET without -> 401 (auth gate first)
 *   - OPTIONS preflight without auth -> 204 + CORS headers
 *   - invalid/empty JSON bodies -> 400
 *   - CORS headers present on success responses
 *
 * Boots Vite in middlewareMode (same bridge as `npm run dev`) with a random
 * in-memory ADMIN_PASSWORD. Refuses to run with DATABASE_URL set.
 *
 * Run: node scripts/mcp-auth-matrix.mjs
 */
import assert from "node:assert/strict";
import { createServer as createHttpServer } from "node:http";
import { randomBytes } from "node:crypto";
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

const basicPair = `Basic ${Buffer.from(`admin:${PASSWORD}`).toString("base64")}`;
const basicBare = `Basic ${Buffer.from(PASSWORD).toString("base64")}`;
const bearer = `Bearer ${PASSWORD}`;

async function rawRequest(method, headers = {}, body) {
  const response = await fetch(`${base}/api/mcp`, {
    method,
    headers: { accept: "application/json, text/event-stream", ...headers },
    body,
  });
  const text = await response.text();
  return { response, text };
}

function post(authValue, body, contentType = "application/json") {
  const headers = { "content-type": contentType };
  if (authValue) headers.authorization = authValue;
  return rawRequest("POST", headers, typeof body === "string" ? body : JSON.stringify(body));
}

async function rpc(authValue, payload) {
  const { response, text } = await post(authValue, payload);
  assert.equal(response.status, 200, `HTTP ${response.status}: ${text.slice(0, 200)}`);
  assert.ok(response.headers.get("access-control-allow-origin"), "missing CORS header on success");
  return JSON.parse(text);
}

async function roundtrip(authValue, label, keyIndex) {
  const init = await rpc(authValue, {
    jsonrpc: "2.0", id: 1, method: "initialize",
    params: { protocolVersion: "2025-03-26", capabilities: {}, clientInfo: { name: "matrix", version: "1" } },
  });
  assert.ok(init.result, `${label}: no initialize result`);
  await rpc(authValue, { jsonrpc: "2.0", method: "notifications/initialized" }).catch(() => null);
  const tools = await rpc(authValue, { jsonrpc: "2.0", id: 2, method: "tools/list" });
  const names = tools.result.tools.map((t) => t.name);
  assert.ok(names.includes("discover_site") && names.includes("patch_section"), `${label}: tools missing`);
  const call = async (name, args) => {
    const result = await rpc(authValue, { jsonrpc: "2.0", id: 3, method: "tools/call", params: { name, arguments: args } });
    assert.equal(result.result.isError, undefined, `${label}: ${JSON.stringify(result).slice(0, 200)}`);
    return JSON.parse(result.result.content[0].text);
  };
  const discovery = await call("discover_site", {});
  const key = discovery.sectionKeys[keyIndex % discovery.sectionKeys.length];
  const marker = `Matrix ${label} ${Date.now()}`;
  const changed = await call("patch_section", { key, text: marker, expectedRevision: discovery.revision });
  assert.ok(changed.revision && changed.revision !== discovery.revision, `${label}: revision did not advance`);
  const publicContent = await (await fetch(`${base}/api/content`)).json();
  assert.equal(publicContent.sections[key], marker, `${label}: public readback mismatch`);
  // Restore a clean value so repeated runs stay tidy.
  await call("patch_section", { key, text: "", expectedRevision: changed.revision });
  ok(`full edit roundtrip via ${label}`);
}

try {
  // 1. No auth at all -> 401 with a WWW-Authenticate challenge.
  {
    const { response } = await post(null, { jsonrpc: "2.0", id: 1, method: "initialize", params: {} });
    assert.equal(response.status, 401);
    // Both challenges advertised: OAuth discovery for capable clients, Basic for the rest.
    assert.match(response.headers.get("www-authenticate") ?? "", /resource_metadata="[^"]*oauth-protected-resource"/);
    assert.match(response.headers.get("www-authenticate") ?? "", /Basic/);
    ok("no auth -> 401 + WWW-Authenticate");
  }

  // 2. Wrong secrets in every shape -> 401, never a hint which part was wrong.
  for (const [label, value] of [
    ["Basic pair", `Basic ${Buffer.from("admin:nope").toString("base64")}`],
    ["Bearer", "Bearer nope"],
    ["raw", "nope"],
    ["empty bearer", "Bearer "],
  ]) {
    const { response } = await post(value, { jsonrpc: "2.0", id: 1, method: "initialize", params: {} });
    assert.equal(response.status, 401, `${label}: got ${response.status}`);
  }
  ok("wrong secret (Basic/Bearer/raw) -> 401");

  // 3. Every accepted shape gets a full working session.
  await roundtrip(basicPair, "Basic user:pass", 0);
  await roundtrip(basicBare, "Basic bare-password", 1);
  await roundtrip(bearer, "Bearer", 2);
  await roundtrip(PASSWORD, "raw pasted secret", 3);

  // 4. Methods: auth gate runs before method checks.
  {
    const authed = await rawRequest("GET", { authorization: bearer });
    assert.equal(authed.response.status, 405);
    assert.equal(authed.response.headers.get("allow"), "POST");
    const anon = await rawRequest("GET", {});
    assert.equal(anon.response.status, 401);
    ok("GET authed -> 405, GET anon -> 401");
  }

  // 5. CORS preflight over HTTP. NOTE: vite's own middleware stack answers
  // every OPTIONS in dev (even for unknown paths), so this only proves a
  // 2xx that admits POST. The handler's own OPTIONS branch (with ACAO) is
  // what production serves — covered directly in section 5b below.
  {
    const pre = await rawRequest("OPTIONS", {
      origin: "https://claude.ai",
      "access-control-request-method": "POST",
      "access-control-request-headers": "authorization, content-type",
    });
    assert.ok([200, 204].includes(pre.response.status), `OPTIONS got ${pre.response.status}`);
    assert.match(pre.response.headers.get("access-control-allow-methods") ?? "", /POST/i);
    ok("OPTIONS preflight -> 2xx admitting POST");
  }

  // 5b. Handler branches directly (bypasses vite's dev HTTP stack, exactly
  // what Nitro/Vercel invokes in production).
  {
    const { handleMcpRequest } = await vite.ssrLoadModule("/server/api/mcp.ts");
    const direct = (method, headers = {}, body) => handleMcpRequest(new Request(`${base}/api/mcp`, {
      method, headers: { accept: "application/json, text/event-stream", "content-type": "application/json", ...headers }, body,
    }));
    const origin = "https://claude.ai";

    const pre = await direct("OPTIONS", { origin });
    assert.equal(pre.status, 204);
    assert.equal(pre.headers.get("access-control-allow-origin"), origin);
    assert.match(pre.headers.get("access-control-allow-headers") ?? "", /authorization/i);
    const preStar = await direct("OPTIONS", {});
    assert.equal(preStar.headers.get("access-control-allow-origin"), "*");
    ok("handler OPTIONS -> 204 + reflected ACAO + auth in allow-headers");

    const anon = await direct("POST", {}, JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize", params: {} }));
    assert.equal(anon.status, 401);
    assert.match(anon.headers.get("www-authenticate") ?? "", /Basic/);
    assert.ok((anon.headers.get("access-control-allow-origin") ?? "").length > 0, "no CORS on 401");
    ok("handler POST anon -> 401 + challenge + CORS");

    const authed = await direct("POST", { authorization: bearer, origin }, JSON.stringify({
      jsonrpc: "2.0", id: 1, method: "initialize",
      params: { protocolVersion: "2025-03-26", capabilities: {}, clientInfo: { name: "matrix", version: "1" } },
    }));
    assert.equal(authed.status, 200, await authed.text().then((t) => t.slice(0, 200)));
    assert.equal(authed.headers.get("access-control-allow-origin"), origin);
    ok("handler POST Bearer -> 200 + reflected ACAO");

    const get = await direct("GET", { authorization: bearer });
    assert.equal(get.status, 405);
    assert.equal(get.headers.get("allow"), "POST");
    ok("handler GET authed -> 405 + Allow: POST");
  }

  // 6. Malformed bodies -> 400, never a crash.
  {
    const bad = await post(bearer, "{not json", "application/json");
    assert.equal(bad.response.status, 400);
    const empty = await post(bearer, "", "application/json");
    assert.equal(empty.response.status, 400);
    ok("invalid/empty JSON -> 400");
  }

  console.log(`MCP AUTH MATRIX PASS  checks=${passed}`);
} finally {
  await vite.close();
  await new Promise((resolve) => httpServer.close(resolve));
}
