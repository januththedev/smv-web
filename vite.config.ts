import { readdirSync } from "node:fs";
import { join } from "node:path";
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

export default defineConfig(({ command, isPreview }) => ({
  server: { host: "0.0.0.0", port: 8080, strictPort: true },
  preview: { host: "127.0.0.1", port: 8081, strictPort: true },
  resolve: { tsconfigPaths: true },
  plugins: [
    pgliteBootstrapPlugin(),
    smvDevApiPlugin(),
    tailwindcss(),
    tanstackStart(),
    ...(command === "build" || isPreview
      ? [nitro({ preset: "vercel", serverDir: "./server" })]
      : []),
    viteReact(),
  ],
}));
