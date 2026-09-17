import { defineEventHandler } from "h3";
import { updateSiteContent, revisionOf, ContentConflictError } from "../../../src/lib/site-content.server";
import { isAdminRequest } from "../../utils/admin-auth";
import { MAX_IMAGE_BYTES, readBoundedBody, uploadImage, validateImage } from "../../utils/admin-image";

/** Existing admin FormData(file) contract; filenames are never used as storage paths. */
export async function handleAdminUpload(request: Request): Promise<Response> {
  if (!(await isAdminRequest(request))) return new Response("Unauthorized", { status: 401 });
  if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
  try {
    const bytes = await readBoundedBody(request, MAX_IMAGE_BYTES + 64 * 1024);
    const form = await new Response(Buffer.from(bytes), { headers: { "content-type": request.headers.get("content-type") ?? "" } }).formData();
    const files = form.getAll("file");
    const file = files[0];
    if (files.length !== 1 || !file || typeof file === "string") throw new Error("Exactly one image file is required");
    const image = validateImage(new Uint8Array(await file.arrayBuffer()), file.type);
    const { url } = await uploadImage(image.data, image.type);
    // Read-current/CAS-retry merges this single field, never stale collections.
    const content = await updateSiteContent({ logoUrl: url });
    return Response.json({ url, revision: revisionOf(content) }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    if (error instanceof ContentConflictError) return Response.json({ error: error.message, revision: error.currentRevision }, { status: 409 });
    const status = error instanceof Error && /BLOB_READ_WRITE_TOKEN/.test(error.message) ? 503 : 400;
    return Response.json({ error: status === 503 ? "Image storage is not configured" : "Invalid image upload. Use JPEG, PNG, WebP or GIF up to 4 MiB; SVG is not supported." }, { status });
  }
}
export default defineEventHandler((event) => handleAdminUpload(event.req as Request));
