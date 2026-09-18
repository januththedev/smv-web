import { defineEventHandler } from "h3";
import { sectionsCollectionKeys, type SectionsCollectionKey } from "../../../src/lib/site-content-schema";
import { contentService, ContentConflictError, revisionOf, type ContentService } from "../../../src/lib/site-content.server";
import { isAdminRequest } from "../../utils/admin-auth";
import { readBoundedBody } from "../../utils/admin-image";

type EditAction = "add" | "patch" | "remove";

const isCollection = (value: unknown): value is SectionsCollectionKey =>
  typeof value === "string" && (sectionsCollectionKeys as readonly string[]).includes(value);
const isAction = (value: unknown): value is EditAction =>
  value === "add" || value === "patch" || value === "remove";
const asIndex = (value: unknown): number | undefined =>
  typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 60 ? value : undefined;

/** Collection add/patch/remove for the click-to-edit admin UI. Always CAS-guarded by expectedRevision. */
export async function handleAdminItem(request: Request, service: ContentService = contentService): Promise<Response> {
  if (!(await isAdminRequest(request))) return new Response("Unauthorized", { status: 401 });
  if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
  try {
    const body = JSON.parse(new TextDecoder().decode(await readBoundedBody(request, 64 * 1024))) as Record<string, unknown>;
    const collection = body.collection;
    const action = body.action;
    const index = asIndex(body.index);
    const expectedRevision = typeof body.expectedRevision === "string" ? body.expectedRevision : undefined;
    if (!isCollection(collection)) return Response.json({ error: "Unknown collection" }, { status: 400 });
    if (!isAction(action)) return Response.json({ error: "Action must be add, patch or remove" }, { status: 400 });
    if (index === undefined) return Response.json({ error: "A whole-number index from 0 to 60 is required" }, { status: 400 });
    if (!expectedRevision) return Response.json({ error: "expectedRevision is required for collection edits" }, { status: 400 });
    const input = action === "remove" ? undefined : body.item ?? body.patch;
    if (action !== "remove" && (!input || typeof input !== "object" || Array.isArray(input))) {
      return Response.json({ error: action === "add" ? "A complete item object is required" : "A patch object is required" }, { status: 400 });
    }
    const content = await service.editItem(collection, index, action, input, expectedRevision);
    return Response.json({ content, revision: revisionOf(content) }, { headers: { etag: `"${revisionOf(content)}"`, "cache-control": "no-store" } });
  } catch (error) {
    if (error instanceof ContentConflictError) return Response.json({ error: error.message, revision: error.currentRevision }, { status: 409 });
    return Response.json({ error: error instanceof Error && error.message ? error.message : "Invalid collection edit" }, { status: 400 });
  }
}
export default defineEventHandler((event) => handleAdminItem(event.req as Request));
