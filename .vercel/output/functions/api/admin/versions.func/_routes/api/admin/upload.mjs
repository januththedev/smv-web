import { o as readMultipartFormData, r as defineEventHandler } from "../../../_libs/h3+rou3+srvx.mjs";
import { t as put } from "../../../_libs/@vercel/blob+[...].mjs";
import { a as updateSiteContent } from "../../../_chunks/site-content.server.mjs";
import { i as isAdminRequest } from "../../../_chunks/admin-auth.mjs";
//#region server/api/admin/upload.post.ts
var upload_post_default = defineEventHandler(async (event) => {
	if (!await isAdminRequest(event.req)) return new Response("Unauthorized", { status: 401 });
	const file = (await readMultipartFormData(event))?.find((part) => part.name === "file" && part.data);
	if (!file?.data) return new Response("Image file is required", { status: 400 });
	if (!file.type?.startsWith("image/")) return new Response("Only image files are supported", { status: 415 });
	if (file.data.byteLength > 8388608) return new Response("Image must be smaller than 8 MB", { status: 413 });
	if (!process.env.BLOB_READ_WRITE_TOKEN) return new Response("BLOB_READ_WRITE_TOKEN is not configured", { status: 503 });
	const blob = await put(`smv/${Date.now()}-${file.name || "image"}`, Buffer.from(file.data), {
		access: "public",
		contentType: file.type
	});
	await updateSiteContent({ logoUrl: blob.url });
	return { url: blob.url };
});
//#endregion
export { upload_post_default as default };
