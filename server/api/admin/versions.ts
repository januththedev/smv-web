import { defineEventHandler, readBody } from "h3";
import { createSiteVersion, listSiteVersions, restoreSiteVersion } from "../../../src/lib/site-content.server";
import { isAdminRequest } from "../../utils/admin-auth";

export default defineEventHandler(async (event) => {
  if (!(await isAdminRequest(event.req as Request))) return new Response("Unauthorized", { status: 401 });
  if (event.req.method === "GET") return listSiteVersions();
  if (event.req.method === "POST") {
    const body = await readBody<{ label?: string }>(event);
    return createSiteVersion(body?.label ?? "Content update");
  }
  if (event.req.method === "PUT") {
    const body = await readBody<{ id?: string }>(event);
    if (!body?.id) return new Response("Version id is required", { status: 400 });
    return restoreSiteVersion(body.id);
  }
  return new Response("Method Not Allowed", { status: 405 });
});
