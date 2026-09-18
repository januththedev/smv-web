import { randomUUID } from "node:crypto";
import { defineEventHandler } from "h3";
import { generateClientTokenFromReadWriteToken } from "@vercel/blob/client";
import { isAdminRequest } from "../../utils/admin-auth";

/**
 * Client-direct Blob uploads: the browser uploads photo/video straight to
 * Vercel Blob with a short-lived scoped token, so large videos never relay
 * through a serverless function body limit. The pathname is minted here so
 * the client cannot aim the token anywhere else.
 */
const photos = { types: ["image/jpeg", "image/png", "image/webp", "image/gif"], maxBytes: 4 * 1024 * 1024 } as const;
const videos = { types: ["video/mp4", "video/webm", "video/quicktime"], maxBytes: 128 * 1024 * 1024 } as const;
const extensions: Record<string, string> = {
  "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif",
  "video/mp4": "mp4", "video/webm": "webm", "video/quicktime": "mov",
};

export async function handleAdminMediaToken(request: Request): Promise<Response> {
  if (!(await isAdminRequest(request))) return new Response("Unauthorized", { status: 401 });
  if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!token) {
    return Response.json({ error: "Media storage is not configured" }, { status: 503, headers: { "cache-control": "no-store" } });
  }
  let body: { kind?: unknown; contentType?: unknown };
  try {
    body = JSON.parse(new TextDecoder().decode(await request.arrayBuffer())) as typeof body;
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const kind = body.kind === "video" ? videos : body.kind === "photo" ? photos : undefined;
  const contentType = typeof body.contentType === "string" ? body.contentType : "";
  if (!kind) return Response.json({ error: "kind must be photo or video" }, { status: 400 });
  if (!(kind.types as readonly string[]).includes(contentType)) {
    return Response.json({ error: `Unsupported ${body.kind} type` }, { status: 400 });
  }
  try {
    const pathname = `smv/media/${Date.now().toString(36)}-${randomUUID().slice(0, 8)}.${extensions[contentType]}`;
    const clientToken = await generateClientTokenFromReadWriteToken({
      pathname,
      maximumSizeInBytes: kind.maxBytes,
      allowedContentTypes: [...kind.types],
      validUntil: Date.now() + 10 * 60 * 1000,
      token,
    });
    return Response.json(
      { pathname, clientToken, maximumSizeInBytes: kind.maxBytes },
      { headers: { "cache-control": "no-store" } },
    );
  } catch {
    return Response.json({ error: "Could not create an upload token; storage is unavailable" }, { status: 503 });
  }
}
export default defineEventHandler((event) => handleAdminMediaToken(event.req as Request));
