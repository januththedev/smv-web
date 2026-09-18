import { readdirSync } from "node:fs";
import { join } from "node:path";
import { createApp, toNodeHandler, type EventHandler } from "h3";
import type { Plugin } from "vite";
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
import { isMigrationFile } from "./scripts/migration-plan.mjs";

function hasGlobbedMigrations(root: string): boolean {
  try {
    return readdirSync(join(root, "migrations")).some(isMigrationFile);
  } catch {
    return false;
  }
}

function pgliteBootstrapPlugin(): Plugin {
  return {
    name: "smv:pglite-bootstrap",
    apply: "serve",
    async configureServer(server) {
      if (!hasGlobbedMigrations(server.config.root)) return;
      try {
        const mod = (await server.ssrLoadModule("/src/lib/db.ts")) as {
          ensureDbReady?: () => Promise<void>;
        };
        if (typeof mod.ensureDbReady === "function") await mod.ensureDbReady();
      } catch (err) {
        console.error("[smv] DB bootstrap failed:", err);
        throw err;
      }
    },
  };
}

function smvDevApiPlugin(): Plugin {
  return {
    name: "smv-dev-api",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathOnly = (req.url ?? "").split("?", 1)[0] ?? "";
        if (pathOnly !== "/api/news" && pathOnly !== "/api/content") {
          next();
          return;
        }
        try {
          if (pathOnly === "/api/news") {
            const mod = (await server.ssrLoadModule("/src/lib/news.server.ts")) as {
              loadNews: () => Promise<unknown>;
            };
            const data = await mod.loadNews();
            res.statusCode = 200;
            res.setHeader("content-type", "application/json; charset=utf-8");
            res.end(JSON.stringify(data));
            return;
          }
          const mod = (await server.ssrLoadModule("/src/lib/site-content.server.ts")) as {
            readSiteContent: () => Promise<unknown>;
          };
          const data = await mod.readSiteContent();
          res.statusCode = 200;
          res.setHeader("content-type", "application/json; charset=utf-8");
          res.end(JSON.stringify(data));
        } catch (err) {
          console.error("[smv-dev-api]", err);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader("content-type", "text/plain; charset=utf-8");
            res.end("api failed");
          }
        }
      });
    },
  };
}

/**
 * `server/` handlers (MCP + admin APIs) only mount through Nitro, which dev
 * skips — bridge them here over the exact same exported handlers. One H3 app
 * serves all of them through the Node adapter, and ssrLoadModule shares Vite's
 * module graph, so the same service instances back dev and build. One place
 * to extend when a new server/ route is added.
 */
function serverApiBridgePlugin(): Plugin {
  const routes: Array<[path: string, moduleId: string, method?: string]> = [
    ["/api/mcp", "/server/api/mcp.ts"],
    ["/api/admin/content", "/server/api/admin/content.ts"],
    ["/api/admin/upload", "/server/api/admin/upload.post.ts", "POST"],
    ["/api/admin/item", "/server/api/admin/item.post.ts", "POST"],
    ["/api/admin/media-token", "/server/api/admin/media-token.post.ts", "POST"],
    ["/api/admin/versions", "/server/api/admin/versions.ts"],
    ["/api/admin/login", "/server/api/admin/login.post.ts", "POST"],
    ["/api/admin/session", "/server/api/admin/session.get.ts", "GET"],
  ];
  return {
    name: "smv-server-api-bridge",
    apply: "serve",
    configureServer(server) {
      // Nitro filename suffixes (.get/.post) restrict methods in production;
      // mirror that here so dev behaves like the deployed routes.
      const methodByModule = new Map(
        routes
          .filter(([, , method]) => method)
          .map(([path, , method]) => [path, method!])
      );
      const app = createApp();
      for (const [path, moduleId] of routes) {
        app.use(path, async (event) => {
          const mod = (await server.ssrLoadModule(moduleId)) as {
            default?: EventHandler;
          };
          const handler = mod.default;
          if (typeof handler !== "function") {
            throw new Error(`${moduleId} has no default handler`);
          }
          return handler(event);
        });
      }
      const nodeHandler = toNodeHandler(app);
      server.middlewares.use(async (req, res, next) => {
        const pathOnly = (req.url ?? "").split("?", 1)[0] ?? "";
        const route = routes.find(([path]) => path === pathOnly);
        if (!route) {
          next();
          return;
        }
        const allowed = methodByModule.get(pathOnly);
        if (allowed && (req.method ?? "GET").toUpperCase() !== allowed) {
          res.statusCode = 405;
          res.setHeader("allow", allowed);
          res.end();
          return;
        }
        try {
          nodeHandler(req, res);
        } catch (err) {
          console.error("[smv-server-api]", err);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader("content-type", "text/plain; charset=utf-8");
            res.end("api failed");
          }
        }
      });
    },
  };
}

export default defineConfig(({ command, isPreview }) => ({
  server: { host: "0.0.0.0", port: 8080, strictPort: true },
  preview: { host: "127.0.0.1", port: 8081, strictPort: true },
  resolve: { tsconfigPaths: true },
  plugins: [
    pgliteBootstrapPlugin(),
    smvDevApiPlugin(),
    serverApiBridgePlugin(),
    tailwindcss(),
    tanstackStart(),
    ...(command === "build" || isPreview
      ? [nitro({ preset: "vercel", serverDir: "./server" })]
      : []),
    viteReact(),
  ],
}));
