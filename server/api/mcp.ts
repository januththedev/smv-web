import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { defineEventHandler } from "h3";
import * as z from "zod";
import {
  allowedFonts, scalarShape, sectionKeySchema, sectionKeys, sectionsCollectionKeys, itemFields, maxItems,
  type SiteContent,
} from "../../src/lib/site-content-schema";
import { copyDefaults, type CopyKey } from "../../src/lib/site-copy";
import { contentService, revisionOf, revisionSchema, type ContentService, type SiteVersion } from "../../src/lib/site-content.server";
import { extractAdminSecret, verifyAdminPassword } from "../utils/admin-auth";
import { decodeImageBase64, uploadImage, imageMimeTypes, MAX_BASE64_LENGTH, readBoundedBody } from "../utils/admin-image";

const result = (value: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(value) }] });
const mutationResult = (content: SiteContent) => ({ revision: revisionOf(content), itemCounts: Object.fromEntries(sectionsCollectionKeys.map((key) => [key, content[key].length])) });
const versionMeta = ({ id, label, createdAt, ...content }: SiteVersion) => ({ id, label, createdAt, revision: revisionOf(content) });
const collectionSchema = z.enum(sectionsCollectionKeys);
const indexSchema = z.number().int().min(0).max(60);
const scalarKeySchema = z.enum(["headline", "intro", "font", "accent", "logoUrl"]);

/** Only called behind the HTTP Basic gate in production. Injected services keep tests isolated. */
export function createMcpServer(service: ContentService = contentService, upload = uploadImage): McpServer {
  const server = new McpServer({ name: "smv-gym-admin", version: "2.0.0" });
  function tool<T extends z.ZodRawShape>(name: string, description: string, shape: T, run: (args: z.infer<z.ZodObject<T>>) => Promise<unknown>) {
    const inputSchema = z.strictObject(shape);
    const sdkSchema: z.ZodType = inputSchema;
    server.registerTool(name, { description, inputSchema: sdkSchema }, async (args: unknown) => {
      try { return result(await run(inputSchema.parse(args))); }
      catch (error) {
        // Validation/errors may contain user data; never echo input values or upload bodies.
        const message = error instanceof z.ZodError
          ? error.issues.map((issue) => `${issue.path.join(".") || "input"}: ${issue.message}`).join("; ")
          : error instanceof Error ? error.message : "Operation failed";
        return { ...result({ error: message }), isError: true };
      }
    });
  }
  tool("discover_site", "List editable scalar names, all rendered section keys, collection counts/fields and revision. No entire-site dump. Start here; then read one target. Reuse URLs before uploading base64.", {}, async () => {
    const content = await service.read();
    return {
      revision: revisionOf(content), scalarFields: Object.keys(scalarShape), sectionKeys: sectionKeys(), fonts: allowedFonts,
      collections: Object.fromEntries(sectionsCollectionKeys.map((key) => [key, { count: content[key].length, max: maxItems[key], fields: itemFields(key) }])),
    };
  });
  tool("get_site_content", "Read exactly one scalar field and its revision, not the whole site.", { field: scalarKeySchema }, async ({ field }) => {
    const content = await service.read();
    return { field, value: content[field], revision: revisionOf(content) };
  });
  tool("get_section", "Read one rendered text key, using its catalog default only when no override exists. Empty overrides are intentional.", { key: sectionKeySchema }, async ({ key }) => {
    const content = await service.read();
    const copyKey = key as CopyKey;
    return { key: copyKey, value: content.sections[copyKey] ?? copyDefaults[copyKey], overridden: Object.hasOwn(content.sections, copyKey), revision: revisionOf(content) };
  });
  tool("patch_section", "Set one rendered text key. Empty text is preserved. Read the target first and pass its expectedRevision.", { key: sectionKeySchema, text: z.string().max(4000), expectedRevision: revisionSchema }, async ({ key, text, expectedRevision }) => mutationResult(await service.patch({ sections: { [key]: text } }, expectedRevision)));
  tool("update_site_content", "Patch scalar text/style/logo fields only; empty text is preserved. For image replacement use a reusable local /images/ or HTTPS URL. Requires current expectedRevision.", { patch: z.strictObject(scalarShape).partial(), expectedRevision: revisionSchema }, async ({ patch, expectedRevision }) => {
    if (!Object.keys(patch).length) throw new Error("Patch must contain at least one field");
    return mutationResult(await service.patch(patch, expectedRevision));
  });
  tool("list_collection", "List compact item labels and indices, fields, total, and revision. Paginated (default 20). For full fields/image URL read one item. Indices may shift after edits.", {
    collection: collectionSchema, offset: z.number().int().min(0).max(60).default(0), limit: z.number().int().min(1).max(20).default(20),
  }, async ({ collection, offset, limit }) => {
    const content = await service.read();
    return { collection, total: content[collection].length, revision: revisionOf(content), fields: itemFields(collection), items: content[collection].slice(offset, offset + limit).map((row, i) => {
      const item = row as Record<string, string>;
      return { index: offset + i, label: (item.title ?? item.alt ?? item.name ?? "").slice(0, 120) };
    }) };
  });
  tool("get_collection_item", "Read one item with its current revision. Includes reusable image URL when present.", { collection: collectionSchema, index: indexSchema }, async ({ collection, index }) => {
    const content = await service.read();
    const item = content[collection][index];
    if (!item) throw new Error("Item index does not exist");
    return { collection, index, item, revision: revisionOf(content) };
  });
  tool("add_collection_item", "Insert one complete item at index (total appends). discover_site lists exact required fields. Unknown fields rejected. Prefer reusing existing image URLs. Requires current expectedRevision.", { collection: collectionSchema, index: indexSchema, item: z.record(z.string(), z.string().max(4000)), expectedRevision: revisionSchema }, async ({ collection, index, item, expectedRevision }) => mutationResult(await service.editItem(collection, index, "add", item, expectedRevision)));
  tool("patch_collection_item", "Sparse patch to one item. Replace/reuse its image with src (gallery) or image (programs/events). Exact known fields only, with index and current expectedRevision.", { collection: collectionSchema, index: indexSchema, patch: z.record(z.string(), z.string().max(4000)), expectedRevision: revisionSchema }, async ({ collection, index, patch, expectedRevision }) => mutationResult(await service.editItem(collection, index, "patch", patch, expectedRevision)));
  tool("remove_collection_item", "Remove an item from the site, including the final gallery item. Does NOT physically delete its image: saved versions/static references remain valid. Requires current expectedRevision.", { collection: collectionSchema, index: indexSchema, expectedRevision: revisionSchema }, async ({ collection, index, expectedRevision }) => mutationResult(await service.editItem(collection, index, "remove", undefined, expectedRevision)));
  tool("create_site_version", "Snapshot current content before editing; only metadata is returned. Latest five snapshots retained.", { label: z.string().min(1).max(100) }, async ({ label }) => versionMeta(await service.createVersion(label)));
  tool("list_site_versions", "Compact metadata for latest five saved versions. Never returns site snapshots.", {}, async () => ({ versions: (await service.listVersions()).map(versionMeta) }));
  tool("restore_site_version", "Replace current content with a saved version. Explicit confirm=true and current expectedRevision required; reread after a conflict. Does not delete files.", { id: z.string().min(1).max(100), confirm: z.literal(true), expectedRevision: revisionSchema }, async ({ id, expectedRevision }) => mutationResult(await service.restoreVersion(id, expectedRevision)));
  tool("upload_image", "Last resort: upload raw base64 (no data URI), max 4 MiB decoded JPEG/PNG/WebP/GIF, no SVG. Prefer reusing existing URLs for token cost. Uses server BLOB_READ_WRITE_TOKEN only. Returns URL; explicitly add/patch a collection or logoUrl to show it. Never fetches remote URLs.", { contentType: z.enum(imageMimeTypes), base64: z.string().min(1).max(MAX_BASE64_LENGTH) }, async ({ contentType, base64 }) => upload(decodeImageBase64(base64), contentType));
  return server;
}

/** Browser-based AI clients preflight with OPTIONS (no credentials); answer it openly. */
function corsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("origin");
  return {
    "access-control-allow-origin": origin ?? "*",
    "access-control-allow-methods": "POST, GET, OPTIONS",
    "access-control-allow-headers": "authorization, content-type, accept, mcp-session-id, mcp-protocol-version",
    "access-control-expose-headers": "mcp-session-id, www-authenticate",
    "access-control-max-age": "86400",
    vary: "origin",
  };
}

/** Basic password validation precedes body parsing, discovery, tool reads, and any service construction. */
export async function handleMcpRequest(request: Request, factory: () => McpServer = () => createMcpServer()): Promise<Response> {
  const cors = corsHeaders(request);
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  // Accept Basic, Bearer, or the raw pasted secret — Claude's connector dialog
  // sends the header value literally, so most setups arrive as Bearer or bare.
  const password = extractAdminSecret(request);
  if (!password || !verifyAdminPassword(password)) return new Response("Admin password required", {
    status: 401, headers: { ...cors, "www-authenticate": 'Basic realm="SMV Admin MCP", charset="UTF-8"', "cache-control": "no-store" },
  });
  if (request.method !== "POST") return new Response("Use stateless MCP POST", { status: 405, headers: { ...cors, allow: "POST" } });
  let parsedBody: unknown;
  try {
    const body = await readBoundedBody(request, MAX_BASE64_LENGTH + 64 * 1024);
    parsedBody = JSON.parse(new TextDecoder().decode(body));
  } catch { return new Response("Invalid or oversized JSON request", { status: 400, headers: cors }); }
  const transport = new WebStandardStreamableHTTPServerTransport({ enableJsonResponse: true, sessionIdGenerator: undefined });
  const server = factory();
  try {
    await server.connect(transport);
    const response = await transport.handleRequest(request, { parsedBody });
    // Buffer JSON before closing the per-request stateless transport.
    const body = await response.arrayBuffer();
    const headers = new Headers(response.headers);
    for (const [key, value] of Object.entries(cors)) headers.set(key, value);
    headers.set("cache-control", "no-store");
    return new Response(body.byteLength ? body : null, { status: response.status, headers });
  } finally { await server.close(); }
}
export default defineEventHandler((event) => handleMcpRequest(event.req as Request));
