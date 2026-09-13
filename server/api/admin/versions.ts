import { defineEventHandler, readBody } from "h3";
import { createSiteVersion, listSiteVersions } from "../../../src/lib/site-content.server";
import { isAdminRequest } from "../../utils/admin-auth";

export default defineEventHandler(async (event) => {
  if (!(await isAdminRequest(event.req as Request))) return new Response("Unauthorized", { status: 401 });
  if (event.req.method === "GET") return listSiteVersions();
  if (event.req.method === "POST") {
    const body = await readBody<{ label?: string }>(event);
    return createSiteVersion(body?.label ?? "Content update");
  }
  return new Response("Method Not Allowed", { status: 405 });
});
