import { r as defineEventHandler } from "../../_libs/h3+rou3+srvx.mjs";
import { n as McpServer, r as _enum, s as string, t as WebStandardStreamableHTTPServerTransport } from "../../_libs/@modelcontextprotocol/sdk+[...].mjs";
import { a as updateSiteContent, n as listSiteVersions, r as readSiteContent, t as createSiteVersion } from "../../_chunks/site-content.server.mjs";
import { a as verifyAdminPassword, n as basicAdminPassword } from "../../_chunks/admin-auth.mjs";
//#region server/api/mcp.ts
function requestIsAuthenticated(request) {
	const password = basicAdminPassword(request);
	return Boolean(password && verifyAdminPassword(password));
}
function mcpServer() {
	const server = new McpServer({
		name: "smv-gym-admin",
		version: "1.0.0"
	});
	server.registerTool("get_site_content", {
		title: "Get website content",
		description: "Read the current editable homepage content before proposing a change."
	}, async () => ({ content: [{
		type: "text",
		text: JSON.stringify(await readSiteContent(), null, 2)
	}] }));
	server.registerTool("update_site_content", {
		title: "Update website content",
		description: "Update editable homepage text and style. Use simple English for Sri Lankan visitors.",
		inputSchema: {
			headline: string().max(120).optional(),
			intro: string().max(500).optional(),
			font: _enum([
				"Manrope",
				"Arial",
				"Georgia",
				"Trebuchet MS"
			]).optional(),
			accent: string().regex(/^#[0-9a-fA-F]{6}$/).optional()
		}
	}, async (change) => ({ content: [{
		type: "text",
		text: JSON.stringify(await updateSiteContent(change), null, 2)
	}] }));
	server.registerTool("create_site_version", {
		title: "Create content version",
		description: "Save the current website content as a named version. The latest five versions are retained for review.",
		inputSchema: { label: string().min(1).max(100) }
	}, async ({ label }) => ({ content: [{
		type: "text",
		text: JSON.stringify(await createSiteVersion(label), null, 2)
	}] }));
	server.registerTool("list_site_versions", {
		title: "List content versions",
		description: "List the five latest saved website-content versions for review."
	}, async () => ({ content: [{
		type: "text",
		text: JSON.stringify(await listSiteVersions(), null, 2)
	}] }));
	return server;
}
var mcp_default = defineEventHandler(async (event) => {
	const request = event.req;
	if (!requestIsAuthenticated(request)) return new Response("Admin password required", {
		status: 401,
		headers: { "www-authenticate": "Basic realm=\"SMV Admin MCP\", charset=\"UTF-8\"" }
	});
	const transport = new WebStandardStreamableHTTPServerTransport({ enableJsonResponse: true });
	await mcpServer().connect(transport);
	return transport.handleRequest(request);
});
//#endregion
export { mcp_default as default };
