import { defineEventHandler } from "h3";
import { adminScalarPatchSchema } from "../../../src/lib/site-content-schema";
import { contentService, ContentConflictError, revisionOf, type ContentService } from "../../../src/lib/site-content.server";
import { isAdminRequest } from "../../utils/admin-auth";
import { readBoundedBody } from "../../utils/admin-image";

/** Scalar-only UI edits never round-trip stale collection blobs. Optional If-Match protects scalar edits too. */
export async function handleAdminContent(request: Request, service: ContentService = contentService): Promise<Response> {
  if (!(await isAdminRequest(request))) return new Response("Unauthorized", { status: 401 });
  if (!["GET", "POST"].includes(request.method)) return new Response("Method Not Allowed", { status: 405 });
  try {
    const content = request.method === "GET" ? await service.read() : await service.patch(
      adminScalarPatchSchema.parse(JSON.parse(new TextDecoder().decode(await readBoundedBody(request, 8192)))),
      request.headers.get("if-match")?.replace(/^"|"$/g, ""),
    );
    return Response.json(content, { headers: { etag: `"${revisionOf(content)}"`, "cache-control": "no-store" } });
  } catch (error) {
    if (error instanceof ContentConflictError) return Response.json({ error: error.message, revision: error.currentRevision }, { status: 409 });
    return Response.json({ error: "Invalid content update; only headline, intro, font and accent are accepted within their bounds" }, { status: 400 });
  }
}
export default defineEventHandler((event) => handleAdminContent(event.req as Request));
