import { n as jwtVerify, t as SignJWT } from "../_libs/jose.mjs";
import { timingSafeEqual } from "node:crypto";
//#region server/utils/admin-auth.ts
var COOKIE_NAME = "smv_admin_session";
var encoder = new TextEncoder();
function adminPassword() {
	return process.env.ADMIN_PASSWORD?.trim() || void 0;
}
function secret() {
	const value = process.env.ADMIN_SESSION_SECRET?.trim() || adminPassword();
	return value ? encoder.encode(value) : void 0;
}
function verifyAdminPassword(candidate) {
	const password = adminPassword();
	if (!password) return false;
	const left = Buffer.from(candidate);
	const right = Buffer.from(password);
	return left.length === right.length && timingSafeEqual(left, right);
}
async function createAdminSession() {
	const key = secret();
	if (!key) throw new Error("ADMIN_PASSWORD is not configured");
	return new SignJWT({ role: "admin" }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(key);
}
async function isAdminRequest(request) {
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
function basicAdminPassword(request) {
	const value = request.headers.get("authorization") ?? "";
	if (!value.startsWith("Basic ")) return void 0;
	try {
		const decoded = Buffer.from(value.slice(6), "base64").toString("utf8");
		const separator = decoded.indexOf(":");
		return separator === -1 ? void 0 : decoded.slice(separator + 1);
	} catch {
		return;
	}
}
var adminCookieName = COOKIE_NAME;
//#endregion
export { verifyAdminPassword as a, isAdminRequest as i, basicAdminPassword as n, createAdminSession as r, adminCookieName as t };
