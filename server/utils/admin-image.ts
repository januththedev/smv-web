import { randomUUID } from "node:crypto";
import { put } from "@vercel/blob";

export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
export const MAX_BASE64_LENGTH = 4 * Math.ceil(MAX_IMAGE_BYTES / 3);
export const imageMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
export function validateImage(input: Uint8Array, declaredType: string) {
  const data = Buffer.from(input);
  if (!data.length || data.length > MAX_IMAGE_BYTES) throw new Error("Image must be between 1 byte and 4 MiB");
  let type: string | undefined;
  let extension: string | undefined;
  if (data.length >= 3 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) { type = "image/jpeg"; extension = "jpg"; }
  else if (data.length >= 24 && data.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) && data.toString("ascii", 12, 16) === "IHDR") { type = "image/png"; extension = "png"; }
  else if (data.length >= 16 && data.toString("ascii", 0, 4) === "RIFF" && data.toString("ascii", 8, 12) === "WEBP" && ["VP8 ", "VP8L", "VP8X"].includes(data.toString("ascii", 12, 16))) { type = "image/webp"; extension = "webp"; }
  else if (data.length >= 13 && ["GIF87a", "GIF89a"].includes(data.toString("ascii", 0, 6))) { type = "image/gif"; extension = "gif"; }
  if (!type || declaredType !== type) throw new Error("Only matching JPEG, PNG, WebP or GIF image signatures are accepted; SVG is not supported");
  return { data, type, extension: extension! };
}
export function decodeImageBase64(encoded: string): Buffer {
  if (!encoded.length || encoded.length > MAX_BASE64_LENGTH || encoded.length % 4 !== 0 || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(encoded)) throw new Error("Invalid or oversized base64 image; use a reusable URL instead");
  const data = Buffer.from(encoded, "base64");
  if (data.toString("base64") !== encoded || data.length > MAX_IMAGE_BYTES) throw new Error("Invalid or oversized base64 image");
  return data;
}
export async function uploadImage(input: Uint8Array, contentType: string): Promise<{ url: string }> {
  const image = validateImage(input, contentType);
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!token) throw new Error("BLOB_READ_WRITE_TOKEN is not configured");
  const blob = await put(`smv/${randomUUID()}.${image.extension}`, image.data, {
    access: "public", contentType: image.type, token, addRandomSuffix: false,
  });
  return { url: blob.url };
}
/** Enforce streaming size before JSON/multipart decoding, without trusting Content-Length. */
export async function readBoundedBody(request: Request, maxBytes: number): Promise<Uint8Array> {
  const length = request.headers.get("content-length");
  if (length && (!/^\d+$/.test(length) || Number(length) > maxBytes)) throw new Error("Request body too large");
  const reader = request.body?.getReader();
  if (!reader) return new Uint8Array();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > maxBytes) { await reader.cancel(); throw new Error("Request body too large"); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  return Buffer.concat(chunks, size);
}
