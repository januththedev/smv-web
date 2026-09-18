import { defineEventHandler, readBody } from "h3";
import { createSiteVersion, listSiteVersions, restoreSiteVersion, revisionOf } from "../../../src/lib/site-content.server";
import { isAdminRequest } from "../../utils/admin-auth";

const jsonWithEtag = (content: unknown) => Response.json(content, { headers: { etag: `"${revisionOf(content as Parameters<typeof revisionOf>[0])}"`, "cache-control": "no-store" } });

export default defineEventHandler(async (event) => {
  const request = event.req as Request;
  if (!(await isAdminRequest(request))) return new Response("Unauthorized", { status: 401 });
  if (request.method === "GET") return listSiteVersions();
  if (request.method === "POST") {
    const body = await readBody<{ label?: string }>(event);
    return createSiteVersion(body?.label ?? "Content update");
  }
  if (request.method === "PUT") {
    const body = await readBody<{ id?: string }>(event);
    if (!body?.id) return new Response("Version id is required", { status: 400 });
    const content = await restoreSiteVersion(body.id, request.headers.get("if-match")?.replace(/^"|"$/g, ""));
    return jsonWithEtag(content);
  }
  return new Response("Method Not Allowed", { status: 405 });
});
