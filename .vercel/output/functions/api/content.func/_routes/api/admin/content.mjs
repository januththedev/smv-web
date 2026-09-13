import { a as readBody, r as defineEventHandler } from "../../../_libs/h3+rou3+srvx.mjs";
import { a as updateSiteContent, r as readSiteContent } from "../../../_chunks/site-content.server.mjs";
import { i as isAdminRequest } from "../../../_chunks/admin-auth.mjs";
//#region server/api/admin/content.ts
var content_default = defineEventHandler(async (event) => {
	if (!await isAdminRequest(event.req)) return new Response("Unauthorized", { status: 401 });
	if (event.req.method === "GET") return readSiteContent();
	if (event.req.method === "POST") return updateSiteContent(await readBody(event) ?? {});
	return new Response("Method Not Allowed", { status: 405 });
});
//#endregion
export { content_default as default };
