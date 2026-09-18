import { createFileRoute, Link } from "@tanstack/react-router";
import { put } from "@vercel/blob/client";
import { Check, Eye, History, ImagePlus, KeyRound, LockKeyhole, Plus, Save, Server, Sparkles, Trash2, X } from "lucide-react";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { getDbSource } from "@/lib/get-db-source";
import { copyDefaults, type CopyKey } from "@/lib/site-copy";
import { defaultSiteContent, refreshSiteContent } from "@/lib/site-content";
import { itemFields, maxItems, sectionsCollectionKeys, type SectionsCollectionKey, type SiteContent } from "@/lib/site-content-schema";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "SMV GYM Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
});

type Version = { id: string; label: string; createdAt: string };
type Draft = Record<string, string>;
type Editing = { collection: SectionsCollectionKey; index: number; isNew: boolean; draft: Draft };

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
  const [sectionsDraft, setSectionsDraft] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<Editing | null>(null);
  const [uploading, setUploading] = useState("");

  const effectiveCopy = (key: CopyKey) => content.sections[key] ?? copyDefaults[key];

  function applyContent(next: SiteContent, etag?: string) {
    setContent(next);
    if (etag) setRevision(etag);
    setSectionsDraft(() => {
      const draft: Record<string, string> = {};
      for (const key of Object.keys(copyDefaults) as CopyKey[]) draft[key] = next.sections[key] ?? copyDefaults[key];
      return draft;
    });
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

  async function save() {
    const changedSections: Record<string, string> = {};
    for (const key of Object.keys(copyDefaults) as CopyKey[]) {
      if (sectionsDraft[key] !== effectiveCopy(key)) changedSections[key] = sectionsDraft[key];
    }
    const patch: Record<string, unknown> = {
      headline: content.headline,
      intro: content.intro,
      font: content.font,
      accent: content.accent,
    };
    if (Object.keys(changedSections).length) patch.sections = changedSections;
    try {
      const saved = await json<SiteContent>("/api/admin/content", {
        method: "POST",
        headers: { "if-match": revision },
        // Never send collections back from this form; item edits use /api/admin/item.
        body: JSON.stringify(patch),
      });
      applyContent(saved.data, saved.etag);
      await refreshSiteContent();
      setNotice(storageLabels[storage].saved);
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
      await refreshSiteContent();
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

  async function saveItem() {
    if (!editing) return;
    const draft = { ...editing.draft };
    // Optional fields must be omitted, not empty, when left blank.
    for (const key of Object.keys(draft)) if (draft[key] === "" && (key === "poster" || key === "type")) delete draft[key];
    try {
      const saved = await json<{ content: SiteContent; revision: string }>("/api/admin/item", {
        method: "POST",
        body: JSON.stringify({
          collection: editing.collection,
          action: editing.isNew ? "add" : "patch",
          index: editing.index,
          [editing.isNew ? "item" : "patch"]: draft,
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

  const sectionGroups = (Object.keys(copyDefaults) as CopyKey[]).reduce<Record<string, CopyKey[]>>(
    (groups, key) => {
      (groups[key.split(".")[0] ?? key] ??= []).push(key);
      return groups;
    },
    {},
  );

  return (
    <main className="min-h-screen bg-bg px-5 pb-20 pt-28 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-iron">SMV GYM admin</p>
            <h1 className="mt-2 font-display text-5xl uppercase">Website control</h1>
            <p className="mt-3 max-w-2xl text-muted">
              Click any text to edit it. Add, change or remove programs, events, quotes, photos and
              videos — every save updates the live website.
            </p>
          </div>
          <Link to="/" className="flex items-center gap-2 text-sm text-muted no-underline">
            <Eye className="size-4" />
            View website
          </Link>
        </div>
        {notice && (
          <p className="mt-6 rounded-lg border border-line bg-surface px-4 py-3 text-sm text-fg">{notice}</p>
        )}

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-5">
            {/* Style, headline and intro */}
            <section className="rounded-lg border border-line bg-surface p-6">
              <h2 className="font-display text-2xl uppercase">Style and welcome</h2>
              <label className="mt-6 flex cursor-pointer justify-between rounded-lg border border-dashed border-line p-4 text-sm text-muted">
                <span>Upload logo to Vercel Blob</span>
                <input type="file" accept="image/*" onChange={uploadLogo} className="sr-only" />
              </label>
              <label className="mt-6 block text-sm text-muted">
                Main heading
                <input
                  value={content.headline}
                  onChange={(e) => setContent({ ...content, headline: e.target.value })}
                  className="mt-2 w-full rounded-lg border border-line bg-bg px-4 py-3 text-fg"
                />
              </label>
              <label className="mt-5 block text-sm text-muted">
                Welcome message
                <textarea
                  value={content.intro}
                  onChange={(e) => setContent({ ...content, intro: e.target.value })}
                  rows={3}
                  className="mt-2 w-full rounded-lg border border-line bg-bg px-4 py-3 text-fg"
                />
              </label>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <label className="text-sm text-muted">
                  Font
                  <select
                    value={content.font}
                    onChange={(e) => setContent({ ...content, font: e.target.value })}
                    className="mt-2 w-full rounded-lg border border-line bg-bg px-4 py-3 text-fg"
                  >
                    <option>Manrope</option>
                    <option>Arial</option>
                    <option>Georgia</option>
                    <option>Trebuchet MS</option>
                  </select>
                </label>
                <label className="text-sm text-muted">
                  Accent colour
                  <input
                    type="color"
                    value={content.accent}
                    onChange={(e) => setContent({ ...content, accent: e.target.value })}
                    className="mt-2 h-12 w-full rounded-lg border border-line bg-bg p-1"
                  />
                </label>
              </div>
              <button
                onClick={save}
                className="mt-7 flex items-center gap-2 rounded-lg bg-iron px-5 py-3 font-semibold text-white"
              >
                <Save className="size-4" />
                {storageLabels[storage].save}
              </button>
            </section>

            {/* Section copy editors */}
            <section className="rounded-lg border border-line bg-surface p-6">
              <h2 className="font-display text-2xl uppercase">Page text</h2>
              <p className="mt-2 text-sm text-muted">Every line of page copy, grouped by page.</p>
              {Object.entries(sectionGroups).map(([group, keys]) => (
                <div key={group} className="mt-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-iron">{group}</p>
                  <div className="mt-3 space-y-4">
                    {keys.map((key) => (
                      <label key={key} className="block text-sm text-muted">
                        {key}
                        {copyDefaults[key].length > 70 ? (
                          <textarea
                            value={sectionsDraft[key] ?? ""}
                            onChange={(e) => setSectionsDraft({ ...sectionsDraft, [key]: e.target.value })}
                            rows={2}
                            className="mt-2 w-full rounded-lg border border-line bg-bg px-4 py-3 text-fg"
                          />
                        ) : (
                          <input
                            value={sectionsDraft[key] ?? ""}
                            onChange={(e) => setSectionsDraft({ ...sectionsDraft, [key]: e.target.value })}
                            className="mt-2 w-full rounded-lg border border-line bg-bg px-4 py-3 text-fg"
                          />
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <button
                onClick={save}
                className="mt-7 flex items-center gap-2 rounded-lg bg-iron px-5 py-3 font-semibold text-white"
              >
                <Save className="size-4" />
                {storageLabels[storage].save}
              </button>
            </section>

            {/* Collection editors */}
            {sectionsCollectionKeys.map((collection) => (
              <section key={collection} className="rounded-lg border border-line bg-surface p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-display text-2xl uppercase">{collectionTitles[collection]}</h2>
                  <span className="text-xs text-muted">
                    {content[collection].length} of {maxItems[collection]}
                  </span>
                </div>
                <div className="mt-5 space-y-3">
                  {content[collection].map((item, index) => {
                    const row = item as unknown as Draft;
                    const isEditing = editing?.collection === collection && editing.index === index && !editing.isNew;
                    return isEditing ? null : (
                      <div key={index} className="rounded-lg bg-bg p-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="min-w-0 flex-1 truncate text-sm font-semibold">
                            {row.type === "video" ? "▶ " : ""}
                            {itemLabel(row)}
                          </p>
                          <div className="flex shrink-0 items-center gap-3">
                            <button
                              onClick={() => setEditing({ collection, index, isNew: false, draft: { ...row, type: row.type || "photo" } })}
                              className="text-xs text-iron"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => void removeItem(collection, index)}
                              className="text-xs text-muted"
                              aria-label={`Remove ${itemLabel(row)}`}
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </div>
                        {row.image || row.src ? (
                          <p className="mt-1 truncate text-xs text-muted">{row.image || row.src}</p>
                        ) : null}
                      </div>
                    );
                  })}
                  {editing?.collection === collection && editing.isNew ? null : (
                    <button
                      onClick={() => setEditing({ collection, index: content[collection].length, isNew: true, draft: blankItem(collection) })}
                      disabled={content[collection].length >= maxItems[collection]}
                      className="flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm disabled:opacity-40"
                    >
                      <Plus className="size-4" />
                      Add item
                    </button>
                  )}
                </div>
                {editing?.collection === collection && (
                  <div className="mt-5 rounded-lg border border-iron/40 bg-bg p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">
                        {editing.isNew ? "New item" : `Editing: ${itemLabel(editing.draft)}`}
                      </p>
                      <button onClick={() => setEditing(null)} aria-label="Cancel edit" className="text-muted">
                        <X className="size-4" />
                      </button>
                    </div>
                    <div className="mt-4 space-y-4">
                      {itemFields(collection).map((field) => (
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
                            <img
                              src={editing.draft[field]}
                              alt=""
                              className="mt-2 h-20 w-20 rounded object-cover"
                            />
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
                    <button
                      onClick={() => void saveItem()}
                      disabled={Boolean(uploading)}
                      className="mt-5 flex items-center gap-2 rounded-lg bg-iron px-5 py-3 font-semibold text-white disabled:opacity-40"
                    >
                      <Save className="size-4" />
                      {editing.isNew ? "Add to website" : "Save item"}
                    </button>
                  </div>
                )}
              </section>
            ))}
          </div>

          <aside className="space-y-5">
            <div className="rounded-lg border border-line bg-surface p-6">
              <div className="flex items-center gap-3">
                <History className="size-5 text-iron" />
                <h2 className="font-display text-2xl uppercase">Latest versions</h2>
              </div>
              <div className="mt-5 space-y-3">
                {versions.length ? (
                  versions.map((item, index) => (
                    <div key={item.id} className="rounded-lg bg-bg p-3">
                      <p className="flex items-center gap-2 text-sm font-semibold">
                        {index === 0 && <Check className="size-4 text-emerald-400" />}
                        {item.label}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        {new Date(item.createdAt).toLocaleString("en-LK")}
                      </p>
                      <button onClick={() => void restore(item)} className="mt-2 text-xs text-iron">
                        Restore this version
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted">No versions yet.</p>
                )}
              </div>
            </div>
            <div className="rounded-lg border border-line bg-surface p-6">
              <div className="flex items-center gap-3">
                <Server className="size-5 text-iron" />
                <h2 className="font-display text-2xl uppercase">MCP connection</h2>
              </div>
              <p className="mt-3 text-sm text-muted">
                Use your domain URL with an MCP client. Configure HTTP Basic credentials in the
                connector using the same admin password as here. An automatic password dialog is
                not guaranteed; clients that cannot send Basic credentials cannot connect.
              </p>
              <code className="mt-4 block overflow-x-auto rounded bg-bg p-3 text-xs text-fg">
                https://your-domain.com/api/mcp
              </code>
              <p className="mt-3 flex gap-2 text-xs text-muted">
                <KeyRound className="size-3 shrink-0" />
                HTTP Basic authentication. Any username is accepted; use your admin password.
              </p>
              <p className="mt-3 flex gap-2 text-xs text-muted">
                <Sparkles className="size-3 shrink-0" />
                Tools: discover the site, read and edit any section or gallery item, upload
                images, and manage versions.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
