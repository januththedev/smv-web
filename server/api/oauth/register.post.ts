import { defineEventHandler, readBody } from "h3";
import { isSafeCallback, newClientId, MCP_SCOPE } from "../../utils/oauth";

/**
 * OAuth Dynamic Client Registration (RFC 7591), public-client profile.
 * Claude "Register automatically" posts its callback URLs here; we hand back
 * a client_id with no secret (PKCE protects the code instead). The admin
 * password — not the client identity — is what gates tokens at /authorize.
 */
export default defineEventHandler(async (event) => {
  const body = (await readBody(event).catch(() => ({}))) as { redirect_uris?: unknown; client_name?: unknown };
  const uris = Array.isArray(body?.redirect_uris)
    ? body.redirect_uris.filter((u): u is string => typeof u === "string" && isSafeCallback(u))
    : [];
  if (!uris.length) {
    return new Response(JSON.stringify({ error: "invalid_redirect_uri", error_description: "Register at least one https callback URL." }), {
      status: 400, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
    });
  }
  const name = typeof body?.client_name === "string" && body.client_name ? body.client_name.slice(0, 120) : "MCP client";
  return {
    client_id: newClientId(),
    client_name: name,
    redirect_uris: uris,
    grant_types: ["authorization_code"],
    response_types: ["code"],
    scope: MCP_SCOPE,
    token_endpoint_auth_method: "none",
  };
});
