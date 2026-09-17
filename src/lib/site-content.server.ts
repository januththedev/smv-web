import { createHash, randomUUID } from "node:crypto";
import * as z from "zod";
import type { Sql } from "@/lib/db";
import {
  cleanContent, contentPatchSchema, contentSchema, itemSchemas,
  type SectionsCollectionKey, type SiteContent,
} from "@/lib/site-content-schema";
export * from "@/lib/site-content-schema";

export type SiteVersion = SiteContent & { id: string; label: string; createdAt: string };
export type StoredVersion = { id: string; label: string; createdAt: string; content: unknown };
export interface ContentRepository {
  read(): Promise<unknown | null>;
  compareAndSwap(previous: unknown | null, next: SiteContent): Promise<boolean>;
  saveVersion(version: StoredVersion): Promise<void>;
  listVersions(): Promise<StoredVersion[]>;
  getVersion(id: string): Promise<StoredVersion | null>;
}
function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical((value as Record<string, unknown>)[key])}`).join(",")}}`;
  return JSON.stringify(value);
}
export function revisionOf(content: SiteContent): string { return createHash("sha256").update(canonical(content)).digest("hex"); }
export class ContentConflictError extends Error {
  readonly statusCode = 409;
  constructor(public currentRevision: string) { super("Stale revision; reread the target and retry with its current revision."); }
}
export const revisionSchema = z.string().regex(/^[a-f0-9]{64}$/);
const labelSchema = z.string().min(1).max(100);
const idSchema = z.string().min(1).max(100);

/** The raw JSONB comparison guards the actual row, even when legacy read normalization changes its shape. */
export function createSqlContentRepository(sqlProvider: () => Promise<Sql>): ContentRepository {
  return {
    async read() {
      const sql = await sqlProvider();
      const rows = await sql<{ content: unknown }>`select content from site_content where id = true`;
      return rows[0]?.content ?? null;
    },
    async compareAndSwap(previous, next) {
      const sql = await sqlProvider();
      const rows = previous === null
        ? await sql`insert into site_content (id, content, updated_at) values (true, ${JSON.stringify(next)}::jsonb, now()) on conflict (id) do nothing returning id`
        : await sql`update site_content set content = ${JSON.stringify(next)}::jsonb, updated_at = now() where id = true and content = ${JSON.stringify(previous)}::jsonb returning id`;
      return rows.length === 1;
    },
    async saveVersion(version) {
      const sql = await sqlProvider();
      await sql`insert into site_versions (id, label, content, created_at) values (${version.id}, ${version.label}, ${JSON.stringify(version.content)}::jsonb, ${version.createdAt})`;
      await sql`delete from site_versions where id in (select id from site_versions order by created_at desc, id desc offset 5)`;
    },
    async listVersions() {
      const sql = await sqlProvider();
      const rows = await sql<{ id: string; label: string; content: unknown; created_at: string | Date }>`select id, label, content, created_at from site_versions order by created_at desc, id desc limit 5`;
      return rows.map((row) => ({ id: row.id, label: row.label, content: row.content, createdAt: new Date(row.created_at).toISOString() }));
    },
    async getVersion(id) {
      const sql = await sqlProvider();
      const rows = await sql<{ id: string; label: string; content: unknown; created_at: string | Date }>`select id, label, content, created_at from site_versions where id = ${id}`;
      const row = rows[0];
      return row ? { id: row.id, label: row.label, content: row.content, createdAt: new Date(row.created_at).toISOString() } : null;
    },
  };
}

export function createContentService(repository: ContentRepository) {
  const read = async () => cleanContent(await repository.read());
  async function mutate(apply: (current: SiteContent) => SiteContent, expectedRevision?: string): Promise<SiteContent> {
    if (expectedRevision !== undefined) revisionSchema.parse(expectedRevision);
    for (let attempt = 0; attempt < 5; attempt++) {
      const raw = await repository.read();
      const current = cleanContent(raw);
      if (expectedRevision !== undefined && revisionOf(current) !== expectedRevision) throw new ContentConflictError(revisionOf(current));
      const next = contentSchema.parse(apply(current));
      if (await repository.compareAndSwap(raw, next)) return next;
      if (expectedRevision !== undefined) throw new ContentConflictError(revisionOf(await read()));
    }
    throw new ContentConflictError(revisionOf(await read()));
  }
  async function patch(input: unknown, expectedRevision?: string) {
    const change = contentPatchSchema.parse(input);
    if (expectedRevision === undefined && Object.keys(change).some((key) => ["sections", "programs", "events", "quotes", "gallery"].includes(key))) {
      throw new Error("An expected revision is required for sections and collections");
    }
    return mutate((current) => ({ ...current, ...change, sections: { ...current.sections, ...change.sections } }), expectedRevision);
  }
  async function editItem(collection: SectionsCollectionKey, index: number, action: "add" | "patch" | "remove", input: unknown, expectedRevision: string) {
    revisionSchema.parse(expectedRevision);
    if (!Object.hasOwn(itemSchemas, collection)) throw new Error("Unknown collection");
    return mutate((current) => {
      const items = [...current[collection]] as unknown as Record<string, string>[];
      if (!Number.isInteger(index) || index < 0 || index > items.length || (action !== "add" && index === items.length)) throw new Error("Item index does not exist");
      if (action === "add") items.splice(index, 0, itemSchemas[collection].parse(input));
      else if (action === "remove") items.splice(index, 1);
      else {
        const partial = itemSchemas[collection].partial().parse(input);
        if (!Object.keys(partial).length) throw new Error("Patch must contain at least one field");
        items[index] = itemSchemas[collection].parse({ ...items[index], ...partial });
      }
      return { ...current, [collection]: items } as SiteContent;
    }, expectedRevision);
  }
  async function createVersion(label: string): Promise<SiteVersion> {
    labelSchema.parse(label);
    const content = await read();
    const version = { id: randomUUID(), label, createdAt: new Date().toISOString(), content };
    await repository.saveVersion(version);
    return { ...content, id: version.id, label, createdAt: version.createdAt };
  }
  async function listVersions(): Promise<SiteVersion[]> {
    return (await repository.listVersions()).map((row) => ({ ...cleanContent(row.content), id: row.id, label: row.label, createdAt: row.createdAt }));
  }
  async function restoreVersion(id: string, expectedRevision: string): Promise<SiteContent> {
    idSchema.parse(id);
    revisionSchema.parse(expectedRevision);
    const version = await repository.getVersion(id);
    if (!version) throw new Error("Version not found");
    return mutate(() => cleanContent(version.content), expectedRevision);
  }
  return { read, patch, editItem, createVersion, listVersions, restoreVersion };
}
export type ContentService = ReturnType<typeof createContentService>;
// Lazy import prevents DB bootstrap during module loading, authentication failures and injected tests.
export const contentService = createContentService(createSqlContentRepository(async () => (await import("@/lib/db")).getSql()));
export const readSiteContent = contentService.read;
export const updateSiteContent = contentService.patch;
export const createSiteVersion = contentService.createVersion;
export const listSiteVersions = contentService.listVersions;
export function patchSiteItem(collection: SectionsCollectionKey, index: number, patch: Record<string, unknown>, expectedRevision: string) {
  return contentService.editItem(collection, index, "patch", patch, expectedRevision);
}
/** Existing session-authenticated admin UI restore compatibility; CAS still catches concurrent writes. */
export async function restoreSiteVersion(id: string, expectedRevision?: string) {
  return contentService.restoreVersion(id, expectedRevision ?? revisionOf(await contentService.read()));
}
