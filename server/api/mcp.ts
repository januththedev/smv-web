import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { defineEventHandler } from "h3";
import * as z from "zod";
import { createSiteVersion, listSiteVersions, readSiteContent, updateSiteContent } from "../../src/lib/site-content.server";

function tokenIsValid(request: Request): boolean {
  const expected = process.env.MCP_API_TOKEN?.trim();
  const supplied = request.headers.get("authorization");
  return Boolean(expected && supplied === `Bearer ${expected}`);
}

function mcpServer() {
  const server = new McpServer({ name: "smv-gym-admin", version: "1.0.0" });

  server.registerTool("get_site_content", {
    title: "Get website content",
    description: "Read the current editable homepage content before proposing a change.",
  }, async () => ({ content: [{ type: "text", text: JSON.stringify(await readSiteContent(), null, 2) }] }));

  server.registerTool("update_site_content", {
    title: "Update website content",
    description: "Update editable homepage text and style. Use simple English for Sri Lankan visitors.",
    inputSchema: {
      headline: z.string().max(120).optional(),
      intro: z.string().max(500).optional(),
      font: z.enum(["Manrope", "Arial", "Georgia", "Trebuchet MS"]).optional(),
      accent: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
    },
  }, async (change) => ({ content: [{ type: "text", text: JSON.stringify(await updateSiteContent(change), null, 2) }] }));

  server.registerTool("create_site_version", {
    title: "Create content version",
    description: "Save the current website content as a named version. The latest five versions are retained for review.",
    inputSchema: { label: z.string().min(1).max(100) },
  }, async ({ label }) => ({ content: [{ type: "text", text: JSON.stringify(await createSiteVersion(label), null, 2) }] }));

  server.registerTool("list_site_versions", {
    title: "List content versions",
    description: "List the five latest saved website-content versions for review.",
  }, async () => ({ content: [{ type: "text", text: JSON.stringify(await listSiteVersions(), null, 2) }] }));
  return server;
}

export default defineEventHandler(async (event) => {
  const request = event.req as Request;
  if (!tokenIsValid(request)) return new Response("Unauthorized", { status: 401 });
  const transport = new WebStandardStreamableHTTPServerTransport({ enableJsonResponse: true });
  const server = mcpServer();
  await server.connect(transport);
  return transport.handleRequest(request);
});
