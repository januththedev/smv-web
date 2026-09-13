import { a as readBody, r as defineEventHandler, s as setCookie } from "../../../_libs/h3+rou3+srvx.mjs";
import { a as verifyAdminPassword, r as createAdminSession, t as adminCookieName } from "../../../_chunks/admin-auth.mjs";
//#region server/api/admin/login.post.ts
var login_post_default = defineEventHandler(async (event) => {
	const body = await readBody(event);
	if (!process.env.ADMIN_PASSWORD?.trim()) return new Response("ADMIN_PASSWORD is not configured", { status: 503 });
	if (!verifyAdminPassword(body?.password ?? "")) return new Response("Incorrect password", { status: 401 });
	setCookie(event, adminCookieName, await createAdminSession(), {
		httpOnly: true,
		sameSite: "strict",
		secure: true,
		path: "/",
		maxAge: 604800
	});
	return { ok: true };
});
//#endregion
export { login_post_default as default };
