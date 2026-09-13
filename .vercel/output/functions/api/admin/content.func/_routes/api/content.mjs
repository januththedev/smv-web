import { r as defineEventHandler } from "../../_libs/h3+rou3+srvx.mjs";
import { r as readSiteContent } from "../../_chunks/site-content.server.mjs";
//#region server/api/content.get.ts
var content_get_default = defineEventHandler(() => readSiteContent());
//#endregion
export { content_get_default as default };
