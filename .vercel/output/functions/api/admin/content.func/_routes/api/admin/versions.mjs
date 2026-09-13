import { a as readBody, r as defineEventHandler } from "../../../_libs/h3+rou3+srvx.mjs";
import { i as restoreSiteVersion, n as listSiteVersions, t as createSiteVersion } from "../../../_chunks/site-content.server.mjs";
import { i as isAdminRequest } from "../../../_chunks/admin-auth.mjs";
//#region server/api/admin/versions.ts
var versions_default = defineEventHandler(async (event) => {
	if (!await isAdminRequest(event.req)) return new Response("Unauthorized", { status: 401 });
	if (event.req.method === "GET") return listSiteVersions();
	if (event.req.method === "POST") {
		const body = await readBody(event);
		return createSiteVersion(body?.label ?? "Content update");
	}
	if (event.req.method === "PUT") {
		const body = await readBody(event);
		if (!body?.id) return new Response("Version id is required", { status: 400 });
		return restoreSiteVersion(body.id);
	}
	return new Response("Method Not Allowed", { status: 405 });
});
//#endregion
export { versions_default as default };
