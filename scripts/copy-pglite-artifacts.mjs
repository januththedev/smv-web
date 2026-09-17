#!/usr/bin/env node
import { copyFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const PGLITE_ARTIFACTS = ["pglite.data", "pglite.wasm", "initdb.wasm"];
const ROOT = fileURLToPath(new URL("../", import.meta.url));

/** Nitro relocates PGlite into _libs; its import.meta.url asset lookups stay relative. */
export function copyPgliteArtifacts({
  functionsDir = join(ROOT, ".vercel/output/functions"),
  sourceDir = dirname(fileURLToPath(import.meta.resolve("@electric-sql/pglite"))),
} = {}) {
  const targets = new Set();
  function visit(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== "node_modules") visit(path);
      } else if (entry.name.includes("electric-sql__pglite") && entry.name.endsWith(".mjs")) {
        targets.add(dir);
      }
    }
  }
  visit(functionsDir);
  if (!targets.size) throw new Error("No bundled PGlite chunk found in Vercel functions output");
  // Validate every source before writing, and fail the build rather than ship a broken runtime.
  for (const artifact of PGLITE_ARTIFACTS) {
    const stat = statSync(join(sourceDir, artifact), { throwIfNoEntry: false });
    if (!stat?.isFile()) throw new Error(`Missing PGlite artifact: ${artifact}`);
  }
  for (const target of targets) {
    for (const artifact of PGLITE_ARTIFACTS) {
      copyFileSync(join(sourceDir, artifact), join(target, artifact));
    }
  }
  return targets.size;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(`[pglite] Packaged runtime artifacts in ${copyPgliteArtifacts()} function directories`);
}
