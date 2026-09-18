import { defineEventHandler, readBody } from "h3";
import { issueAccessToken, redeemAuthCode } from "../../utils/oauth";

function grantError(status: number, error: string, description: string): Response {
  return new Response(JSON.stringify({ error, error_description: description }), {
    status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

/**
 * OAuth token endpoint. Exchanges a PKCE-bound authorization code for a
 * short-lived access token the MCP endpoint accepts as a Bearer credential.
 * Public clients only (no client secret was ever issued); a presented secret
 * is ignored rather than rejected so registration-profile mismatches cannot
 * lock out legitimate clients.
 */
export default defineEventHandler(async (event) => {
  const body = (await readBody(event).catch(() => ({}))) as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v : "");
  if (str(body?.grant_type) !== "authorization_code") {
    return grantError(400, "unsupported_grant_type", "Only the authorization_code grant is supported.");
  }
  const code = str(body?.code);
  const clientId = str(body?.client_id);
  const redirectUri = str(body?.redirect_uri);
  const verifier = str(body?.code_verifier);
  if (!code || !clientId || !redirectUri || !verifier) {
    return grantError(400, "invalid_request", "code, client_id, redirect_uri and code_verifier are required.");
  }
  try {
    await redeemAuthCode({ code, clientId, redirectUri, codeVerifier: verifier });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Code rejected";
    return grantError(400, "invalid_grant", message);
  }
  try {
    const { token, expiresIn } = await issueAccessToken();
    return { access_token: token, token_type: "Bearer", expires_in: expiresIn, scope: "mcp" };
  } catch {
    return grantError(503, "temporarily_unavailable", "Sign-in is not configured on this server.");
  }
});
