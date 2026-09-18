import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { copyPgliteArtifacts, PGLITE_ARTIFACTS } from "./copy-pglite-artifacts.mjs";

const ARTIFACT_BYTES = Object.fromEntries(
  PGLITE_ARTIFACTS.map((name) => [name, `binary:${name}`]),
);

function makeTree({ withFunctionBundles = true, withArtifacts = true } = {}) {
  const root = mkdtempSync(join(tmpdir(), "pglite-pack-"));
  mkdirSync(join(root, "dist"), { recursive: true });
  if (withArtifacts) {
    for (const [name, content] of Object.entries(ARTIFACT_BYTES)) {
      writeFileSync(join(root, "dist", name), content);
    }
  }
  const dirs = [join(root, "functions", "__server.func", "_libs")];
  if (withFunctionBundles) {
    dirs.push(
      join(root, "functions", "api", "content.func", "_libs"),
      join(root, "functions", "api", "mcp.func", "_libs"),
      join(root, "functions", "api", "admin", "login.func", "_libs"),
    );
  }
  for (const dir of dirs) {
    mkdirSync(dir, { recursive: true });
  }
  if (withFunctionBundles) writeFileSync(
    join(root, "functions", "__server.func", "_libs", "electric-sql__pglite.mjs"),
    "export {}",
  );
  if (withFunctionBundles) {
    for (const dir of dirs.slice(1)) {
      writeFileSync(join(dir, "electric-sql__pglite.mjs"), "export {}");
      // Other lib chunks live alongside; they must never receive artifacts.
      writeFileSync(join(dir, "pg.mjs"), "export {}");
    }
  }
  return root;
}

function artifactDirs(root) {
  const found = [];
  const visit = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) visit(path);
      else if (entry.name === "pglite.data") found.push(join(dir));
    }
  };
  visit(join(root, "functions"));
  return found.sort();
}

test("copies PGlite artifacts next to every bundled chunk", () => {
  const root = makeTree();
  const count = copyPgliteArtifacts({
    functionsDir: join(root, "functions"),
    sourceDir: join(root, "dist"),
  });
  assert.equal(count, 4);
  assert.deepEqual(artifactDirs(root), [
    join(root, "functions", "__server.func", "_libs"),
    join(root, "functions", "api", "admin", "login.func", "_libs"),
    join(root, "functions", "api", "content.func", "_libs"),
    join(root, "functions", "api", "mcp.func", "_libs"),
  ]);
  rmSync(root, { recursive: true, force: true });
});

test("artifacts land in _libs only — never near unrelated chunks or the static dir", () => {
  const root = makeTree();
  copyPgliteArtifacts({
    functionsDir: join(root, "functions"),
    sourceDir: join(root, "dist"),
  });
  const stray = artifactDirs(root).filter((dir) => !dir.includes("_libs"));
  assert.deepEqual(stray, []);
  // Node-only chunk next to pglite's must stay clean.
  assert.equal(readdirSync(join(root, "functions", "api", "content.func", "_libs")).includes("pglite.data"), true);
  rmSync(root, { recursive: true, force: true });
});

test("is idempotent — a repeated pass leaves byte-identical copies", () => {
  const root = makeTree();
  const options = { functionsDir: join(root, "functions"), sourceDir: join(root, "dist") };
  copyPgliteArtifacts(options);
  copyPgliteArtifacts(options);
  assert.equal(artifactDirs(root).length, 4);
  for (const dir of artifactDirs(root)) {
    for (const [name, bytes] of Object.entries(ARTIFACT_BYTES)) {
      assert.equal(readFileSync(join(dir, name), "utf8"), bytes);
    }
  }
  rmSync(root, { recursive: true, force: true });
});

test("a fresh output with no bundles yet is a hard error, not a silent pass", () => {
  const root = makeTree({ withFunctionBundles: false });
  assert.throws(
    () =>
      copyPgliteArtifacts({
        functionsDir: join(root, "functions"),
        sourceDir: join(root, "dist"),
      }),
    /No bundled PGlite chunk/,
  );
  rmSync(root, { recursive: true, force: true });
});

test("a missing source artifact fails before any copy is made", () => {
  const root = makeTree();
  rmSync(join(root, "dist", "pglite.data"));
  const target = join(root, "functions", "__server.func", "_libs");
  assert.throws(
    () =>
      copyPgliteArtifacts({
        functionsDir: join(root, "functions"),
        sourceDir: join(root, "dist"),
      }),
    /Missing PGlite artifact/,
  );
  // The directory that would have received files is untouched.
  assert.equal(readdirSync(target).includes("pglite.data"), false);
  rmSync(root, { recursive: true, force: true });
});
