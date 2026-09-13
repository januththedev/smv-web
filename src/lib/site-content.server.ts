import { randomUUID } from "node:crypto";
import { getSql } from "@/lib/db";

export type SiteContent = {
  headline: string;
  intro: string;
  font: string;
  accent: string;
};

export type SiteVersion = SiteContent & {
  id: string;
  label: string;
  createdAt: string;
};

export const defaultSiteContent: SiteContent = {
  headline: "Train strong. Feel good.",
  intro: "A friendly gym in Wadduwa for strength, fitness and bodybuilding.",
  font: "Manrope",
  accent: "#c45c32",
};

function cleanContent(value: Partial<SiteContent>): SiteContent {
  return {
    headline: value.headline?.trim() || defaultSiteContent.headline,
    intro: value.intro?.trim() || defaultSiteContent.intro,
    font: value.font?.trim() || defaultSiteContent.font,
    accent: /^#[0-9a-f]{6}$/i.test(value.accent ?? "") ? value.accent! : defaultSiteContent.accent,
  };
}

export async function readSiteContent(): Promise<SiteContent> {
  const sql = await getSql();
  const rows = await sql<{ content: SiteContent }>`select content from site_content where id = true`;
  return rows[0] ? cleanContent(rows[0].content) : defaultSiteContent;
}

export async function updateSiteContent(change: Partial<SiteContent>): Promise<SiteContent> {
  const sql = await getSql();
  const content = cleanContent({ ...(await readSiteContent()), ...change });
  await sql`insert into site_content (id, content, updated_at) values (true, ${JSON.stringify(content)}::jsonb, now()) on conflict (id) do update set content = excluded.content, updated_at = now()`;
  return content;
}

export async function createSiteVersion(label: string): Promise<SiteVersion> {
  const sql = await getSql();
  const content = await readSiteContent();
  const version: SiteVersion = {
    ...content,
    id: randomUUID(),
    label: label.trim() || "Content update",
    createdAt: new Date().toISOString(),
  };
  await sql`insert into site_versions (id, label, content, created_at) values (${version.id}, ${version.label}, ${JSON.stringify(content)}::jsonb, ${version.createdAt})`;
  await sql`delete from site_versions where id in (select id from site_versions order by created_at desc offset 5)`;
  return version;
}

export async function listSiteVersions(): Promise<SiteVersion[]> {
  const sql = await getSql();
  const rows = await sql<{ id: string; label: string; content: SiteContent; created_at: string }>`select id, label, content, created_at from site_versions order by created_at desc limit 5`;
  return rows.map((row) => ({ ...cleanContent(row.content), id: row.id, label: row.label, createdAt: String(row.created_at) }));
}
