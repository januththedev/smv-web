import { timingSafeEqual } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "smv_admin_session";
const encoder = new TextEncoder();

function adminPassword(): string | undefined {
  const password = process.env.ADMIN_PASSWORD?.trim();
  return password || undefined;
}

function secret(): Uint8Array | undefined {
  const value = process.env.ADMIN_SESSION_SECRET?.trim() || adminPassword();
  return value ? encoder.encode(value) : undefined;
}

export function verifyAdminPassword(candidate: string): boolean {
  const password = adminPassword();
  if (!password) return false;
  const left = Buffer.from(candidate);
  const right = Buffer.from(password);
  return left.length === right.length && timingSafeEqual(left, right);
}

export async function createAdminSession(): Promise<string> {
  const key = secret();
  if (!key) throw new Error("ADMIN_PASSWORD is not configured");
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function isAdminRequest(request: Request): Promise<boolean> {
  const key = secret();
  const token = request.headers.get("cookie")?.match(/(?:^|; )smv_admin_session=([^;]+)/)?.[1];
  if (!key || !token) return false;
  try {
    const { payload } = await jwtVerify(decodeURIComponent(token), key);
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export function basicAdminPassword(request: Request): string | undefined {
  const value = request.headers.get("authorization") ?? "";
  if (!value.startsWith("Basic ")) return undefined;
  try {
    const decoded = Buffer.from(value.slice(6), "base64").toString("utf8");
    const separator = decoded.indexOf(":");
    return separator === -1 ? undefined : decoded.slice(separator + 1);
  } catch {
    return undefined;
  }
}

/**
 * Shared-secret extraction for MCP clients. Claude's custom-connector dialog
 * takes a literal header value, so most people paste the raw password or
 * `Bearer <password>` — not a base64 Basic pair. Accept, in order:
 *   1. `Basic base64(user:password)` (classic HTTP Basic)
 *   2. `Basic base64(password)` (no username part — treat all of it as the secret)
 *   3. `Bearer <secret>` (Claude/Claude Code/API-key style)
 *   4. a bare `<secret>` value (exactly what the user pasted, no scheme)
 * The result is only a *candidate* — callers must still pass it through
 * verifyAdminPassword. Same single secret, same strength, whatever the client.
 */
export function extractAdminSecret(request: Request): string | undefined {
  const value = (request.headers.get("authorization") ?? "").trim();
  if (!value) return undefined;
  const basic = /^basic\s+(.+)$/i.exec(value);
  if (basic) {
    try {
      const decoded = Buffer.from(basic[1].trim(), "base64").toString("utf8");
      const separator = decoded.indexOf(":");
      return separator === -1 ? decoded || undefined : decoded.slice(separator + 1) || undefined;
    } catch {
      return undefined;
    }
  }
  const bearer = /^bearer\s+(.+)$/i.exec(value);
  if (bearer) return bearer[1].trim() || undefined;
  return value || undefined;
}

export const adminCookieName = COOKIE_NAME;
