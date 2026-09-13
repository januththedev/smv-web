import { put } from "@vercel/blob";
import { defineEventHandler, readMultipartFormData } from "h3";
import { updateSiteContent } from "../../../src/lib/site-content.server";
import { isAdminRequest } from "../../utils/admin-auth";

export default defineEventHandler(async (event) => {
  if (!(await isAdminRequest(event.req as Request))) return new Response("Unauthorized", { status: 401 });
  const parts = await readMultipartFormData(event);
  const file = parts?.find((part) => part.name === "file" && part.data);
  if (!file?.data) return new Response("Image file is required", { status: 400 });
  if (!file.type?.startsWith("image/")) return new Response("Only image files are supported", { status: 415 });
  if (file.data.byteLength > 8 * 1024 * 1024) return new Response("Image must be smaller than 8 MB", { status: 413 });
  if (!process.env.BLOB_READ_WRITE_TOKEN) return new Response("BLOB_READ_WRITE_TOKEN is not configured", { status: 503 });
  const blob = await put(`smv/${Date.now()}-${file.name || "image"}`, Buffer.from(file.data), { access: "public", contentType: file.type });
  await updateSiteContent({ logoUrl: blob.url });
  return { url: blob.url };
});
