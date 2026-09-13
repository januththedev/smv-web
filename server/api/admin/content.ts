import { defineEventHandler, readBody } from "h3";
import { readSiteContent, updateSiteContent, type SiteContent } from "../../../src/lib/site-content.server";
import { isAdminRequest } from "../../utils/admin-auth";

export default defineEventHandler(async (event) => {
  if (!(await isAdminRequest(event.req as Request))) return new Response("Unauthorized", { status: 401 });
  if (event.req.method === "GET") return readSiteContent();
  if (event.req.method === "POST") return updateSiteContent((await readBody<Partial<SiteContent>>(event)) ?? {});
  return new Response("Method Not Allowed", { status: 405 });
});
