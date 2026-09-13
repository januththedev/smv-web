import { r as defineEventHandler } from "../../../_libs/h3+rou3+srvx.mjs";
import { i as isAdminRequest } from "../../../_chunks/admin-auth.mjs";
//#region server/api/admin/session.get.ts
var session_get_default = defineEventHandler(async (event) => ({ authenticated: await isAdminRequest(event.req) }));
//#endregion
export { session_get_default as default };
