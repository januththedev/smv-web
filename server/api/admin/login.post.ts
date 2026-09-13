import { defineEventHandler, readBody, setCookie } from "h3";
import { adminCookieName, createAdminSession, verifyAdminPassword } from "../../utils/admin-auth";

export default defineEventHandler(async (event) => {
  const body = await readBody<{ password?: string }>(event);
  if (!process.env.ADMIN_PASSWORD?.trim()) return new Response("ADMIN_PASSWORD is not configured", { status: 503 });
  if (!verifyAdminPassword(body?.password ?? "")) return new Response("Incorrect password", { status: 401 });
  setCookie(event, adminCookieName, await createAdminSession(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return { ok: true };
});
