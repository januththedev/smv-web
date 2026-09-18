import { createFileRoute, Link } from "@tanstack/react-router";
import { put } from "@vercel/blob/client";
import { Check, Eye, History, ImagePlus, KeyRound, LockKeyhole, Pencil, Plus, Save, Server, Sparkles, Trash2, X } from "lucide-react";
import { useEffect, useState, type ChangeEvent, type FormEvent, type MouseEvent } from "react";
import { Home } from "@/routes/index";
import { getDbSource } from "@/lib/get-db-source";
import { copyDefaults, type CopyKey } from "@/lib/site-copy";
import { defaultSiteContent, refreshSiteContent } from "@/lib/site-content";
import { isSectionsCollectionKey, itemFields, maxItems, type SectionsCollectionKey, type SiteContent } from "@/lib/site-content-schema";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "SMV GYM Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
});

type Version = { id: string; label: string; createdAt: string };
type Draft = Record<string, string>;
type Editing = { collection: SectionsCollectionKey; index: number; isNew: boolean; draft: Draft };
type ScalarField = "headline" | "intro" | "font" | "accent";
type Drawer = { kind: "section"; id: string } | { kind: "style" } | { kind: "versions" } | { kind: "mcp" } | null;

/**
 * Click-to-edit map: every homepage section in the preview below carries a
 * matching `data-admin-section` attribute (see src/routes/index.tsx and the
 * Hero component). Collection items carry `data-admin-collection` +
 * `data-admin-index`. Clicking the preview opens the editor for that exact
 * part — no separate form pages.
 *
 * LOCKED (never editable, by construction — no editor exists for them):
 * - the footer credit "Januth made this" (rendered by the shared Footer)
 * - contact facts in code (phone numbers, street address, map pin)
 * - fixed design assets (hero/beach/about photos, marquee words, buttons)
 */
type SectionConfig = {
  id: string;
  title: string;
  hint: string;
  texts: { key: CopyKey; label: string; multiline?: boolean }[];
  scalars?: { field: ScalarField; label: string }[];
  collections?: SectionsCollectionKey[];
  logo?: boolean;
};

const SECTIONS: SectionConfig[] = [
  {
    id: "hero",
    title: "Hero",
    hint: "Top of the homepage. Click Save and it goes live instantly.",
    texts: [{ key: "home.hero.kicker", label: "Eyebrow kicker" }],
    scalars: [
      { field: "headline", label: "Main heading" },
      { field: "intro", label: "Welcome message" },
    ],
    logo: true,
  },
  {
    id: "about",
    title: "01 · The house of iron",
    hint: "Introduction two-column block.",
    texts: [
      { key: "home.about.title", label: "Section title" },
      { key: "home.about.body", label: "Body copy", multiline: true },
    ],
  },
  {
    id: "programs",
    title: "02 · How we train",
    hint: "Section title plus the program cards. Click a card to edit it directly.",
    texts: [{ key: "home.programs.title", label: "Section title" }],
    collections: ["programs"],
  },
  {
    id: "beach",
    title: "Beach interlude",
    hint: "Dark inverted band about the coast.",
    texts: [
      { key: "home.beach.title", label: "Title" },
      { key: "home.beach.body", label: "Body copy", multiline: true },
    ],
  },
  {
    id: "community",
    title: "03 · The community",
    hint: "Stat ledger. Numbers and their labels are all editable.",
    texts: [
      { key: "home.community.likes", label: "First number" },
      { key: "home.community.likesLabel", label: "First label" },
      { key: "home.community.checkins", label: "Second number" },
      { key: "home.community.checkinsLabel", label: "Second label" },
      { key: "home.community.recommend", label: "Third number" },
      { key: "home.community.recommendLabel", label: "Third label" },
    ],
  },
  {
    id: "events",
    title: "04 · From the journal",
    hint: "Homepage journal rows, fed by the events collection.",
    texts: [
      { key: "home.events.title", label: "Section title" },
      { key: "home.events.aside", label: "Link label" },
    ],
    collections: ["events"],
  },
  {
    id: "quotes",
    title: "Member stories",
    hint: "Quotes grid. Click a quote to edit it directly.",
    texts: [{ key: "home.quotes.title", label: "Section title" }],
    collections: ["quotes"],
  },
  {
    id: "gallery",
    title: "06 · On the floor",
    hint: "Photo teaser plus the full gallery collection.",
    texts: [
      { key: "home.gallery.title", label: "Section title" },
      { key: "home.gallery.aside", label: "Link label" },
    ],
    collections: ["gallery"],
  },
  {
    id: "visit",
    title: "Walk in",
    hint: "Bottom call-to-action band.",
    texts: [
      { key: "home.visit.title", label: "Eyebrow" },
      { key: "home.visit.address", label: "Address heading" },
      { key: "home.visit.body", label: "Body copy", multiline: true },
      { key: "home.visit.whatsapp", label: "WhatsApp button" },
      { key: "home.visit.map", label: "Map button" },
    ],
  },
];

/** Backend-specific wording: never claim Neon when the preview fallback is active. */
const storageLabels = {
  neon: { save: "Save to Neon", saved: "Saved to Neon." },
  pglite: { save: "Save content", saved: "Saved (preview storage — set DATABASE_URL to save to Neon)." },
} as const;

const collectionTitles: Record<SectionsCollectionKey, string> = {
  programs: "Programs", events: "Events & journal", quotes: "Member quotes", gallery: "Gallery (photos & videos)",
};
const fieldLabels: Record<string, string> = {
  slug: "Slug", title: "Title", kicker: "Kicker", copy: "Description", image: "Image URL",
  when: "When", quote: "Quote", name: "Name", src: "Media URL", alt: "Alt text", tag: "Tag",
  type: "Kind", poster: "Video poster image URL",
};
const multilineFields = new Set(["copy", "quote", "body"]);
const photoFields = new Set(["image", "src", "poster"]);

async function json<T>(url: string, init?: RequestInit): Promise<{ data: T; etag?: string }> {
  const response = await fetch(url, {
    credentials: "same-origin",
    headers: { "content-type": "application/json", ...init?.headers },
    ...init,
  });
  if (!response.ok) throw new Error(await response.text());
  return { data: (await response.json()) as T, etag: response.headers.get("etag") ?? undefined };
}

function itemLabel(item: Draft): string {
  const text = item.title || item.name || item.alt || item.quote;
  return text ? text.slice(0, 60) : "Untitled";
}

/** Default field values for a brand-new collection item. */
function blankItem(collection: SectionsCollectionKey): Draft {
  const draft: Draft = {};
  for (const field of itemFields(collection)) draft[field] = "";
  if (collection === "gallery") draft.type = "photo";
  return draft;
}

function AdminPage() {
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [revision, setRevision] = useState("");
  const [versions, setVersions] = useState<Version[]>([]);
  const [notice, setNotice] = useState("");
  const [storage, setStorage] = useState<keyof typeof storageLabels>("pglite");
  const [drawer, setDrawer] = useState<Drawer>(null);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [scalarDraft, setScalarDraft] = useState({ headline: "", intro: "", font: "", accent: "" });
  const [editing, setEditing] = useState<Editing | null>(null);
  const [uploading, setUploading] = useState("");

  const effectiveCopy = (key: CopyKey) => content.sections[key] ?? copyDefaults[key];

  function applyContent(next: SiteContent, etag?: string) {
    setContent(next);
    if (etag) setRevision(etag);
  }

  async function load() {
    const session = (await json<{ authenticated: boolean }>("/api/admin/session")).data;
    setUnlocked(session.authenticated);
    if (!session.authenticated) return;
    const [page, versionList, nextStorage] = await Promise.all([
      json<SiteContent>("/api/admin/content"),
      json<Version[]>("/api/admin/versions"),
      getDbSource(),
    ]);
    applyContent(page.data, page.etag);
    setVersions(versionList.data);
    setStorage(nextStorage);
    // Sync the preview below (it reads the shared content snapshot).
    await refreshSiteContent();
  }

  useEffect(() => {
    void load().catch(() => setUnlocked(false));
  }, []);

  function handleError(error: unknown, fallback: string) {
    if (error instanceof Error && /Stale revision/.test(error.message)) {
      setNotice("Someone saved changes while you were editing — reloading the latest version. Try again.");
      void load().catch(() => setUnlocked(false));
      return;
    }
    setNotice(error instanceof Error ? error.message : fallback);
  }

  async function login(e: FormEvent) {
    e.preventDefault();
    try {
      await json("/api/admin/login", { method: "POST", body: JSON.stringify({ password }) });
      setPassword("");
      setNotice("");
      await load();
    } catch {
      setNotice("Password is not correct.");
    }
  }

  function openSection(id: string) {
    const section = SECTIONS.find((s) => s.id === id);
    if (!section) return;
    const nextDraft: Record<string, string> = {};
    for (const field of section.texts) nextDraft[field.key] = effectiveCopy(field.key);
    setDraft(nextDraft);
    setScalarDraft({ headline: content.headline, intro: content.intro, font: content.font, accent: content.accent });
    setDrawer({ kind: "section", id });
  }

  function openStyle() {
    setScalarDraft({ headline: content.headline, intro: content.intro, font: content.font, accent: content.accent });
    setDrawer({ kind: "style" });
  }

  async function saveSection(section: SectionConfig) {
    const changedSections: Record<string, string> = {};
    for (const field of section.texts) {
      if (draft[field.key] !== effectiveCopy(field.key)) changedSections[field.key] = draft[field.key] ?? "";
    }
    const scalarPatch: Record<string, string> = {};
    for (const { field } of section.scalars ?? []) {
      if (scalarDraft[field] !== content[field]) scalarPatch[field] = scalarDraft[field];
    }
    if (!Object.keys(changedSections).length && !Object.keys(scalarPatch).length) {
      setNotice("No changes to save.");
      return;
    }
    try {
      const saved = await json<SiteContent>("/api/admin/content", {
        method: "POST",
        headers: { "if-match": revision },
        // Never send collections back from this form; item edits use /api/admin/item.
        body: JSON.stringify({
          headline: scalarPatch.headline ?? content.headline,
          intro: scalarPatch.intro ?? content.intro,
          font: scalarPatch.font ?? content.font,
          accent: scalarPatch.accent ?? content.accent,
          ...(Object.keys(changedSections).length ? { sections: changedSections } : {}),
        }),
      });
      applyContent(saved.data, saved.etag);
      await refreshSiteContent();
      setNotice(storageLabels[storage].saved);
      setDrawer(null);
    } catch (error) {
      handleError(error, "Could not save.");
    }
  }

  async function saveStyle() {
    try {
      const saved = await json<SiteContent>("/api/admin/content", {
        method: "POST",
        headers: { "if-match": revision },
        body: JSON.stringify({
          headline: scalarDraft.headline || content.headline,
          intro: scalarDraft.intro || content.intro,
          font: scalarDraft.font || content.font,
          accent: scalarDraft.accent || content.accent,
        }),
      });
      applyContent(saved.data, saved.etag);
      await refreshSiteContent();
      setNotice(storageLabels[storage].saved);
      setDrawer(null);
    } catch (error) {
      handleError(error, "Could not save.");
    }
  }

  async function version() {
    try {
      const created = await json<Version>("/api/admin/versions", {
        method: "POST",
        body: JSON.stringify({ label: `Website update ${new Date().toLocaleDateString("en-LK")}` }),
      });
      setVersions((current) => [created.data, ...current].slice(0, 5));
      setNotice("Version created.");
    } catch (error) {
      handleError(error, "Could not create version.");
    }
  }

  async function restore(versionToRestore: Version) {
    try {
      const restored = await json<SiteContent>("/api/admin/versions", {
        method: "PUT",
        headers: { "if-match": revision },
        body: JSON.stringify({ id: versionToRestore.id }),
      });
      applyContent(restored.data, restored.etag);
      await refreshSiteContent();
      setNotice(`Restored ${versionToRestore.label}.`);
    } catch (error) {
      handleError(error, "Could not restore version.");
    }
  }

  async function uploadLogo(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: form,
        credentials: "same-origin",
      });
      if (!response.ok) throw new Error(await response.text());
      await load();
      setNotice("Logo uploaded to Vercel Blob.");
    } catch (error) {
      handleError(error, "Could not upload logo.");
    }
  }

  /** Direct-to-Blob upload: token from the server, bytes never relay through it. */
  async function uploadMedia(file: File, kind: "photo" | "video"): Promise<string> {
    if (kind === "video" && file.size > 120 * 1024 * 1024) throw new Error("Videos must be under 120 MB");
    const token = await json<{ pathname: string; clientToken: string }>("/api/admin/media-token", {
      method: "POST",
      body: JSON.stringify({ kind, contentType: file.type }),
    });
    const blob = await put(token.data.pathname, file, {
      access: "public",
      token: token.data.clientToken,
      contentType: file.type,
      multipart: file.size > 4 * 1024 * 1024,
    });
    return blob.url;
  }

  async function handleMediaPick(event: ChangeEvent<HTMLInputElement>, field: "src" | "image" | "poster") {
    const file = event.target.files?.[0];
    if (!file || !editing) return;
    setUploading("Uploading…");
    try {
      const url = await uploadMedia(file, field === "src" && file.type.startsWith("video/") ? "video" : "photo");
      setEditing((current) => current && { ...current, draft: { ...current.draft, [field]: url } });
      setUploading("");
    } catch (error) {
      setUploading("");
      handleError(error, "Could not upload the file.");
    }
  }

  function openItemEditor(collection: SectionsCollectionKey, index: number) {
    const row = (content[collection] as unknown as Draft[])[index];
    if (!row) return;
    setEditing({ collection, index, isNew: false, draft: { ...row, type: row.type || "photo" } });
  }

  async function saveItem() {
    if (!editing) return;
    const draftItem = { ...editing.draft };
    // Optional fields must be omitted, not empty, when left blank.
    for (const key of Object.keys(draftItem)) if (draftItem[key] === "" && (key === "poster" || key === "type")) delete draftItem[key];
    try {
      const saved = await json<{ content: SiteContent; revision: string }>("/api/admin/item", {
        method: "POST",
        body: JSON.stringify({
          collection: editing.collection,
          action: editing.isNew ? "add" : "patch",
          index: editing.index,
          [editing.isNew ? "item" : "patch"]: draftItem,
          expectedRevision: revision,
        }),
      });
      applyContent(saved.data.content, saved.data.revision);
      setEditing(null);
      setNotice(editing.isNew ? "Added." : "Saved.");
      await refreshSiteContent();
    } catch (error) {
      handleError(error, "Could not save the item.");
    }
  }

  async function removeItem(collection: SectionsCollectionKey, index: number) {
    if (!window.confirm("Remove this item from the website?")) return;
    try {
      const saved = await json<{ content: SiteContent; revision: string }>("/api/admin/item", {
        method: "POST",
        body: JSON.stringify({ collection, action: "remove", index, expectedRevision: revision }),
      });
      applyContent(saved.data.content, saved.data.revision);
      if (editing?.collection === collection && editing.index === index) setEditing(null);
      setNotice("Removed.");
      await refreshSiteContent();
    } catch (error) {
      handleError(error, "Could not remove the item.");
    }
  }

  /** Preview clicks never navigate: anchors are disabled, clicks open editors. */
  function handlePreviewClick(e: MouseEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement | null;
    const closest = target?.closest?.bind(target);
    if (!closest) return;
    if (closest("a")) e.preventDefault();
    const item = closest("[data-admin-collection]");
    if (item) {
      const collection = item.getAttribute("data-admin-collection") ?? "";
      const index = Number(item.getAttribute("data-admin-index"));
      if (isSectionsCollectionKey(collection) && Number.isInteger(index)) openItemEditor(collection, index);
      return;
    }
    const section = closest("[data-admin-section]");
    if (section) {
      const id = section.getAttribute("data-admin-section") ?? "";
      if (SECTIONS.some((s) => s.id === id)) openSection(id);
    }
  }

  if (!unlocked) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md items-center px-5">
        <form onSubmit={login} className="w-full rounded-lg border border-line bg-surface p-7">
          <LockKeyhole className="mb-5 size-7 text-iron" />
          <p className="text-xs uppercase tracking-[0.2em] text-muted">SMV GYM admin</p>
          <h1 className="mt-2 font-display text-4xl uppercase">Sign in</h1>
          <p className="mt-3 text-muted">Use the admin password saved in Vercel.</p>
          <input
            aria-label="Admin password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-6 w-full rounded-lg border border-line bg-bg px-4 py-3"
            placeholder="Admin password"
          />
          <button className="mt-4 w-full rounded-lg bg-iron px-4 py-3 font-semibold text-white">
            Open admin
          </button>
          {notice && <p className="mt-3 text-sm text-iron">{notice}</p>}
          <Link to="/" className="mt-5 block text-center text-sm text-muted no-underline">
            Back to website
          </Link>
        </form>
      </main>
    );
  }

  const activeSection = drawer?.kind === "section" ? SECTIONS.find((s) => s.id === drawer.id) : undefined;

  return (
    <main className="min-h-screen bg-bg pb-20 pt-28 md:pt-32">
      <style>{`
        .admin-preview [data-admin-section] { cursor: pointer; border-radius: 2px; }
        .admin-preview [data-admin-section]:hover { outline: 2px dashed var(--color-iron); outline-offset: 6px; }
        .admin-preview [data-admin-collection] { cursor: pointer; }
        .admin-preview [data-admin-collection]:hover { outline: 2px dashed var(--color-iron); outline-offset: 4px; }
      `}</style>

      {/* Sticky control bar */}
      <div className="sticky top-16 z-40 border-y border-line bg-bg/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-5 gap-y-3 px-5 py-4 md:px-8">
          <div className="mr-auto">
            <p className="text-xs uppercase tracking-[0.2em] text-iron">SMV GYM admin</p>
            <h1 className="font-display text-2xl uppercase leading-none md:text-3xl">Website control</h1>
          </div>
          <span className="hidden text-xs text-muted sm:inline">{storage === "neon" ? "Neon database" : "Preview storage"}</span>
          <button onClick={openStyle} className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-[0.14em] hover:text-iron">
            Style
          </button>
          <button onClick={() => setDrawer({ kind: "versions" })} className="flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-xs uppercase tracking-[0.14em] hover:text-iron">
            <History className="size-3.5" /> Versions
          </button>
          <button onClick={() => setDrawer({ kind: "mcp" })} className="flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-xs uppercase tracking-[0.14em] hover:text-iron">
            <Server className="size-3.5" /> MCP
          </button>
          <Link to="/" className="flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-muted no-underline hover:text-fg">
            <Eye className="size-3.5" /> View website
          </Link>
        </div>
        <div className="border-t border-line">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-1 px-5 py-2 text-xs text-muted md:px-8">
            <span className="flex items-center gap-1.5">
              <Pencil className="size-3.5 text-iron" />
              Click any part of the site below to edit it — preview links are disabled.
            </span>
            {notice && <span className="text-fg">{notice}</span>}
          </div>
        </div>
      </div>

      {/* Live site preview — the real homepage, click any block to edit */}
      <div className="admin-preview" onClickCapture={handlePreviewClick}>
        <Home />
      </div>
      <p className="mx-auto max-w-6xl px-5 pt-6 text-xs text-muted md:px-8">
        Footer credit “Januth made this” is permanently locked and cannot be edited.
      </p>

      {/* Editor drawer */}
      {drawer && (
        <>
          <div className="fixed inset-0 z-[65] bg-black/50" onClick={() => setDrawer(null)} aria-hidden="true" />
          <aside className="fixed right-0 top-0 z-[70] h-full w-full max-w-md overflow-y-auto border-l border-line bg-bg p-6" aria-label="Editor">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-iron">Editing</p>
                <h2 className="mt-1 font-display text-3xl uppercase">
                  {drawer.kind === "section" ? activeSection?.title : drawer.kind === "style" ? "Style" : drawer.kind === "versions" ? "Latest versions" : "MCP connection"}
                </h2>
                {drawer.kind === "section" && <p className="mt-2 text-sm text-muted">{activeSection?.hint}</p>}
              </div>
              <button onClick={() => setDrawer(null)} aria-label="Close editor" className="rounded-full border border-line p-2 text-muted hover:text-fg">
                <X className="size-4" />
              </button>
            </div>

            {drawer.kind === "section" && activeSection && (
              <div className="mt-6 space-y-5">
                {(activeSection.scalars ?? []).map(({ field, label }) => (
                  <label key={field} className="block text-sm text-muted">
                    {label}
                    {field === "headline" || field === "intro" ? (
                      <textarea
                        value={scalarDraft[field]}
                        onChange={(e) => setScalarDraft({ ...scalarDraft, [field]: e.target.value })}
                        rows={field === "intro" ? 3 : 2}
                        className="mt-2 w-full rounded-lg border border-line bg-surface px-4 py-3 text-fg"
                      />
                    ) : null}
                  </label>
                ))}
                {activeSection.texts.map((field) => (
                  <label key={field.key} className="block text-sm text-muted">
                    {field.label}
                    {field.multiline ? (
                      <textarea
                        value={draft[field.key] ?? ""}
                        onChange={(e) => setDraft({ ...draft, [field.key]: e.target.value })}
                        rows={3}
                        className="mt-2 w-full rounded-lg border border-line bg-surface px-4 py-3 text-fg"
                      />
                    ) : (
                      <input
                        value={draft[field.key] ?? ""}
                        onChange={(e) => setDraft({ ...draft, [field.key]: e.target.value })}
                        className="mt-2 w-full rounded-lg border border-line bg-surface px-4 py-3 text-fg"
                      />
                    )}
                  </label>
                ))}
                {activeSection.logo && (
                  <label className="flex cursor-pointer items-center justify-between rounded-lg border border-dashed border-line p-4 text-sm text-muted">
                    <span>Replace logo (Vercel Blob)</span>
                    <input type="file" accept="image/*" onChange={uploadLogo} className="sr-only" />
                  </label>
                )}
                {(activeSection.collections ?? []).map((collection) => (
                  <div key={collection} className="rounded-lg border border-line p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold">{collectionTitles[collection]}</p>
                      <span className="text-xs text-muted">{content[collection].length} of {maxItems[collection]}</span>
                    </div>
                    <div className="mt-3 space-y-2">
                      {(content[collection] as unknown as Draft[]).map((item, index) => (
                        <div key={index} className="flex items-center gap-2 rounded bg-surface p-2">
                          <button
                            onClick={() => openItemEditor(collection, index)}
                            className="min-w-0 flex-1 truncate text-left text-sm font-semibold hover:text-iron"
                          >
                            {item.type === "video" ? "▶ " : ""}{itemLabel(item)}
                          </button>
                          <button onClick={() => void removeItem(collection, index)} aria-label={`Remove ${itemLabel(item)}`} className="shrink-0 p-1 text-muted hover:text-fg">
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => setEditing({ collection, index: content[collection].length, isNew: true, draft: blankItem(collection) })}
                        disabled={content[collection].length >= maxItems[collection]}
                        className="flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm disabled:opacity-40"
                      >
                        <Plus className="size-4" /> Add item
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => void saveSection(activeSection)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-iron px-5 py-3 font-semibold text-white"
                >
                  <Save className="size-4" /> {storageLabels[storage].save}
                </button>
              </div>
            )}

            {drawer.kind === "style" && (
              <div className="mt-6 space-y-5">
                <label className="block text-sm text-muted">
                  Font
                  <select
                    value={scalarDraft.font || content.font}
                    onChange={(e) => setScalarDraft({ ...scalarDraft, font: e.target.value })}
                    className="mt-2 w-full rounded-lg border border-line bg-surface px-4 py-3 text-fg"
                  >
                    <option>Manrope</option>
                    <option>Arial</option>
                    <option>Georgia</option>
                    <option>Trebuchet MS</option>
                  </select>
                </label>
                <label className="block text-sm text-muted">
                  Accent colour
                  <input
                    type="color"
                    value={/^#[0-9a-f]{6}$/i.test(scalarDraft.accent) ? scalarDraft.accent : content.accent}
                    onChange={(e) => setScalarDraft({ ...scalarDraft, accent: e.target.value })}
                    className="mt-2 h-12 w-full rounded-lg border border-line bg-surface p-1"
                  />
                </label>
                <label className="flex cursor-pointer items-center justify-between rounded-lg border border-dashed border-line p-4 text-sm text-muted">
                  <span>Replace logo (Vercel Blob)</span>
                  <input type="file" accept="image/*" onChange={uploadLogo} className="sr-only" />
                </label>
                <button
                  onClick={() => void saveStyle()}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-iron px-5 py-3 font-semibold text-white"
                >
                  <Save className="size-4" /> {storageLabels[storage].save}
                </button>
              </div>
            )}

            {drawer.kind === "versions" && (
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => void version()}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-line px-5 py-3 text-sm font-semibold"
                >
                  Create version snapshot
                </button>
                {versions.length ? (
                  versions.map((item, index) => (
                    <div key={item.id} className="rounded-lg bg-surface p-3">
                      <p className="flex items-center gap-2 text-sm font-semibold">
                        {index === 0 && <Check className="size-4 text-emerald-400" />}
                        {item.label}
                      </p>
                      <p className="mt-1 text-xs text-muted">{new Date(item.createdAt).toLocaleString("en-LK")}</p>
                      <button onClick={() => void restore(item)} className="mt-2 text-xs text-iron">
                        Restore this version
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted">No versions yet.</p>
                )}
              </div>
            )}

            {drawer.kind === "mcp" && (
              <div className="mt-6 space-y-4 text-sm text-muted">
                <p>
                  Use your domain URL with an MCP client. Send the admin password as an
                  <code className="text-fg">Authorization</code> header —{" "}
                  <code className="text-fg">Bearer &lt;password&gt;</code> works, as do HTTP Basic
                  or the bare password. An automatic password dialog is
                  not guaranteed; clients that cannot send the header cannot connect.
                </p>
                <code className="block overflow-x-auto rounded bg-surface p-3 text-xs text-fg">
                  https://your-domain.com/api/mcp
                </code>
                <p className="flex gap-2 text-xs">
                  <KeyRound className="size-3 shrink-0" />
                  Shared secret, not per-user. Any username is accepted; use your admin password as a Bearer token.
                </p>
                <p className="flex gap-2 text-xs">
                  <Sparkles className="size-3 shrink-0" />
                  Tools: discover the site, read and edit any section or gallery item, upload
                  images, and manage versions.
                </p>
              </div>
            )}
          </aside>
        </>
      )}

      {/* Collection item editor */}
      {editing && (
        <>
          <div className="fixed inset-0 z-[75] bg-black/50" onClick={() => setEditing(null)} aria-hidden="true" />
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <div className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-lg border border-line bg-bg p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">
                  {editing.isNew ? `New ${collectionTitles[editing.collection]}` : `Editing: ${itemLabel(editing.draft)}`}
                </p>
                <button onClick={() => setEditing(null)} aria-label="Cancel edit" className="text-muted hover:text-fg">
                  <X className="size-4" />
                </button>
              </div>
              <div className="mt-4 space-y-4">
                {itemFields(editing.collection).map((field) => (
                  <label key={field} className="block text-sm text-muted">
                    {fieldLabels[field] ?? field}
                    {field === "type" ? (
                      <select
                        value={editing.draft.type ?? "photo"}
                        onChange={(e) => setEditing({ ...editing, draft: { ...editing.draft, type: e.target.value } })}
                        className="mt-2 w-full rounded-lg border border-line bg-surface px-4 py-3 text-fg"
                      >
                        <option value="photo">Photo</option>
                        <option value="video">Video</option>
                      </select>
                    ) : multilineFields.has(field) ? (
                      <textarea
                        value={editing.draft[field] ?? ""}
                        onChange={(e) => setEditing({ ...editing, draft: { ...editing.draft, [field]: e.target.value } })}
                        rows={3}
                        className="mt-2 w-full rounded-lg border border-line bg-surface px-4 py-3 text-fg"
                      />
                    ) : (
                      <input
                        value={editing.draft[field] ?? ""}
                        onChange={(e) => setEditing({ ...editing, draft: { ...editing.draft, [field]: e.target.value } })}
                        className="mt-2 w-full rounded-lg border border-line bg-surface px-4 py-3 text-fg"
                      />
                    )}
                    {photoFields.has(field) && editing.draft[field] ? (
                      <img src={editing.draft[field]} alt="" className="mt-2 h-20 w-20 rounded object-cover" />
                    ) : null}
                    {field === "type" && editing.draft.type === "video" && editing.draft.src ? (
                      <video src={editing.draft.src} className="mt-2 h-20 rounded bg-black" muted />
                    ) : null}
                    {photoFields.has(field) ? (
                      <span className="mt-2 flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-line px-4 py-3 text-xs">
                        <ImagePlus className="size-4" />
                        Upload {field === "poster" ? "poster image" : field === "src" ? "photo or video" : "image"}
                        <input
                          type="file"
                          accept={field === "src" ? "image/*,video/mp4,video/webm,video/quicktime" : "image/*"}
                          onChange={(e) => void handleMediaPick(e, field as "src" | "image" | "poster")}
                          className="sr-only"
                        />
                      </span>
                    ) : null}
                  </label>
                ))}
              </div>
              {uploading && <p className="mt-3 text-sm text-muted">{uploading}</p>}
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() => void saveItem()}
                  disabled={Boolean(uploading)}
                  className="flex items-center gap-2 rounded-lg bg-iron px-5 py-3 font-semibold text-white disabled:opacity-40"
                >
                  <Save className="size-4" />
                  {editing.isNew ? "Add to website" : "Save item"}
                </button>
                {!editing.isNew && (
                  <button
                    onClick={() => void removeItem(editing.collection, editing.index)}
                    className="flex items-center gap-2 rounded-lg border border-line px-5 py-3 text-sm text-muted hover:text-fg"
                  >
                    <Trash2 className="size-4" /> Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
