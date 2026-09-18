import { createHash, randomUUID } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";

/**
 * Minimal OAuth 2.0 for a single shared secret (no user accounts).
 *
 * Why this exists: claude.ai custom connectors without the Request-headers
 * beta can only authenticate via OAuth ("Sign in now" / dynamic client
 * registration). Static Bearer/API-key headers are not offered, so a
 * password-only MCP gate can never connect there. This module lets Claude
 * register automatically, sends the admin through a mobile-friendly
 * password screen, and hands Claude short-lived bearer tokens — all
 * stateless (signed JWTs, no database), so it works on serverless functions
 * with zero instance affinity and no migrations.
 *
 * Security boils down to the same ADMIN_PASSWORD: no token is ever issued
 * without it, codes live 10 minutes and are bound to client + redirect +
 * PKCE challenge, access tokens live 7 days like the cookie session.
 */

const encoder = new TextEncoder();
const CODE_USE = "smv-mcp-code";
const ACCESS_USE = "smv-mcp-access";
const CODE_TTL = "10m";
const ACCESS_TTL = "7d";
export const ACCESS_TTL_SECONDS = 7 * 24 * 60 * 60;
export const MCP_SCOPE = "mcp";

function signingKey(): Uint8Array | undefined {
  const value = process.env.ADMIN_SESSION_SECRET?.trim() || process.env.ADMIN_PASSWORD?.trim();
  return value ? encoder.encode(value) : undefined;
}

export function base64UrlSha256(input: string): string {
  return createHash("sha256").update(input).digest("base64url");
}

/** Callbacks must be https, except http loopback/localhost for local dev. */
export function isSafeCallback(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "https:") return true;
    return parsed.protocol === "http:" && (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1");
  } catch {
    return false;
  }
}

export function newClientId(): string {
  return randomUUID();
}

export async function issueAuthCode(params: {
  clientId: string; redirectUri: string; codeChallenge: string; scope?: string;
}): Promise<string> {
  const key = signingKey();
  if (!key) throw new Error("OAuth is not configured");
  return new SignJWT({
    use: CODE_USE,
    client_id: params.clientId,
    redirect_uri: params.redirectUri,
    code_challenge: params.codeChallenge,
    scope: params.scope ?? MCP_SCOPE,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(CODE_TTL)
    .setJti(randomUUID())
    .sign(key);
}

export async function redeemAuthCode(params: {
  code: string; clientId: string; redirectUri: string; codeVerifier: string;
}): Promise<void> {
  const key = signingKey();
  if (!key) throw new Error("OAuth is not configured");
  let payload: Record<string, unknown>;
  try {
    ({ payload } = await jwtVerify(params.code, key));
  } catch {
    throw new Error("Invalid or expired code");
  }
  if (payload.use !== CODE_USE) throw new Error("Not an authorization code");
  if (payload.client_id !== params.clientId) throw new Error("Unknown client");
  if (payload.redirect_uri !== params.redirectUri) throw new Error("Redirect mismatch");
  if (typeof payload.code_challenge !== "string" || !payload.code_challenge) throw new Error("Code has no challenge");
  if (base64UrlSha256(params.codeVerifier) !== payload.code_challenge) throw new Error("PKCE check failed");
}

export async function issueAccessToken(): Promise<{ token: string; expiresIn: number }> {
  const key = signingKey();
  if (!key) throw new Error("OAuth is not configured");
  const token = await new SignJWT({ use: ACCESS_USE, sub: "smv-admin", scope: MCP_SCOPE })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TTL)
    .setJti(randomUUID())
    .sign(key);
  return { token, expiresIn: ACCESS_TTL_SECONDS };
}

export async function verifyAccessToken(token: string): Promise<boolean> {
  const key = signingKey();
  if (!key || !token) return false;
  try {
    const { payload } = await jwtVerify(token, key);
    return payload.use === ACCESS_USE && payload.sub === "smv-admin";
  } catch {
    return false;
  }
}

export function authorizationServerMetadata(origin: string) {
  return {
    issuer: origin,
    authorization_endpoint: `${origin}/api/oauth/authorize`,
    token_endpoint: `${origin}/api/oauth/token`,
    registration_endpoint: `${origin}/api/oauth/register`,
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code"],
    code_challenge_methods_supported: ["S256"],
    token_endpoint_auth_methods_supported: ["none"],
    scopes_supported: [MCP_SCOPE],
  };
}

export function protectedResourceMetadata(origin: string) {
  return {
    resource: `${origin}/api/mcp`,
    authorization_servers: [origin],
    scopes_supported: [MCP_SCOPE],
    bearer_methods_supported: ["header"],
  };
}
