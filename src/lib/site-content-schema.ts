import * as z from "zod";
import { events, gallery, programs, quotes } from "@/lib/site";
import { copyDefaults } from "@/lib/site-copy";

export type GalleryPhoto = { src: string; alt: string; tag: string };
export type ProgramItem = { slug: string; title: string; kicker: string; copy: string; image: string };
export type EventItem = { slug: string; kicker: string; title: string; copy: string; image: string; when: string };
export type QuoteItem = { quote: string; name: string };
export type SiteContent = {
  headline: string; intro: string; font: string; accent: string; logoUrl: string;
  /** Missing key uses copyDefaults; an empty string intentionally hides copy. */
  sections: Record<string, string>;
  programs: ProgramItem[]; events: EventItem[]; quotes: QuoteItem[]; gallery: GalleryPhoto[];
};
export const defaultSiteContent: SiteContent = {
  headline: "Train strong. Feel good.", intro: "A friendly gym in Wadduwa for strength, fitness and bodybuilding.",
  font: "Manrope", accent: "#c45c32", logoUrl: "/images/smv-logo.png", sections: {},
  programs: programs.map((p) => ({ ...p })), events: events.map((e) => ({ ...e })),
  quotes: quotes.map((q) => ({ ...q })), gallery: gallery.map((g) => ({ ...g })),
};
export const sectionsCollectionKeys = ["programs", "events", "quotes", "gallery"] as const;
export type SectionsCollectionKey = (typeof sectionsCollectionKeys)[number];
export const allowedFonts = ["Manrope", "Arial", "Georgia", "Trebuchet MS"] as const;
export const maxItems = { programs: 12, events: 12, quotes: 12, gallery: 60 } as const;
export const sectionKeys = () => Object.keys(copyDefaults).sort();
export const hasSectionKey = (key: string) => Object.hasOwn(copyDefaults, key);
export function isSectionsCollectionKey(value: string): value is SectionsCollectionKey {
  return (sectionsCollectionKeys as readonly string[]).includes(value);
}

/** No protocol-relative URLs, credentials, escapes, traversal, whitespace or executable schemes. */
export function isSafeImageUrl(value: string): boolean {
  if (value.length > 2048 || /[\s\\\u0000-\u001f\u007f]/u.test(value)) return false;
  if (value.startsWith("/images/")) {
    return /^\/images\/(?:[A-Za-z0-9_-]+\/)*[A-Za-z0-9_-][A-Za-z0-9_.-]*$/.test(value)
      && !value.split("/").some((part) => part === "." || part === "..");
  }
  if (!/^https:\/\//i.test(value)) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !!url.hostname && !url.username && !url.password;
  } catch { return false; }
}
export const imageUrlSchema = z.string().max(2048).refine(isSafeImageUrl, "Use a local /images/ path or credential-free HTTPS URL");
const text = (max = 300) => z.string().max(max);
const slug = z.string().max(80).regex(/^(?:[a-z0-9]+(?:-[a-z0-9]+)*)?$/);
export const itemSchemas = {
  programs: z.strictObject({ slug, title: text(), kicker: text(), copy: text(800), image: imageUrlSchema }),
  events: z.strictObject({ slug, title: text(), kicker: text(), copy: text(800), image: imageUrlSchema, when: text() }),
  quotes: z.strictObject({ quote: text(800), name: text() }),
  gallery: z.strictObject({ src: imageUrlSchema, alt: text(), tag: text() }),
};
export function itemFields(collection: SectionsCollectionKey): readonly string[] { return Object.keys(itemSchemas[collection].shape); }
export const sectionKeySchema = z.string().max(160).refine(hasSectionKey, "Unknown/non-rendered section key; consult discover_site");
export const sectionsSchema = z.record(sectionKeySchema, text(4000));
export const scalarShape = { headline: text(120), intro: text(500), font: z.enum(allowedFonts), accent: z.string().regex(/^#[0-9a-f]{6}$/i), logoUrl: imageUrlSchema };
export const contentSchema = z.strictObject({
  ...scalarShape, sections: sectionsSchema,
  programs: z.array(itemSchemas.programs).max(maxItems.programs),
  events: z.array(itemSchemas.events).max(maxItems.events),
  quotes: z.array(itemSchemas.quotes).max(maxItems.quotes),
  gallery: z.array(itemSchemas.gallery).max(maxItems.gallery),
});
export const contentPatchSchema = contentSchema.partial();
export const adminScalarPatchSchema = z.strictObject({
  headline: scalarShape.headline.optional(), intro: scalarShape.intro.optional(),
  font: scalarShape.font.optional(), accent: scalarShape.accent.optional(),
});

/** Read compatibility only. Never use this forgiving normalizer to validate writes. */
export function cleanContent(value: unknown): SiteContent {
  const raw = value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
  const result = structuredClone(defaultSiteContent);
  for (const key of Object.keys(scalarShape) as (keyof typeof scalarShape)[]) {
    const parsed = scalarShape[key].safeParse(raw[key]);
    if (parsed.success) result[key] = parsed.data;
  }
  result.sections = {};
  if (raw.sections && typeof raw.sections === "object" && !Array.isArray(raw.sections)) {
    for (const [key, value] of Object.entries(raw.sections)) {
      if (hasSectionKey(key) && typeof value === "string") result.sections[key] = value.slice(0, 4000);
    }
  }
  for (const collection of sectionsCollectionKeys) {
    if (!Array.isArray(raw[collection])) continue;
    const rows: unknown[] = [];
    for (const row of raw[collection].slice(0, maxItems[collection])) {
      if (!row || typeof row !== "object" || Array.isArray(row)) continue;
      // Legacy missing text fields become empty, not unrelated default item copy.
      const candidate: Record<string, unknown> = {};
      for (const field of itemFields(collection)) candidate[field] = (row as Record<string, unknown>)[field] ?? "";
      const parsed = itemSchemas[collection].safeParse(candidate);
      if (parsed.success) rows.push(parsed.data);
    }
    Object.assign(result, { [collection]: rows });
  }
  return result;
}
