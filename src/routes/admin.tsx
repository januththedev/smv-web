import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Eye, History, KeyRound, LockKeyhole, Save, Server, Sparkles } from "lucide-react";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { getDbSource } from "@/lib/get-db-source";
import { defaultSiteContent, refreshSiteContent, type SiteContent } from "@/lib/site-content";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "SMV GYM Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
});

type Content = Pick<SiteContent, "headline" | "intro" | "font" | "accent">;
type Version = Content & { id: string; label: string; createdAt: string };
const defaults: Content = defaultSiteContent;

/** Backend-specific wording: never claim Neon when the preview fallback is active. */
const storageLabels = {
  neon: { save: "Save to Neon", saved: "Saved to Neon." },
  pglite: { save: "Save content", saved: "Saved (preview storage — set DATABASE_URL to save to Neon)." },
} as const;

async function json<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    credentials: "same-origin",
    headers: { "content-type": "application/json", ...init?.headers },
    ...init,
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json() as Promise<T>;
}

function AdminPage() {
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [content, setContent] = useState<Content>(defaults);
  const [versions, setVersions] = useState<Version[]>([]);
  const [notice, setNotice] = useState("");
  const [storage, setStorage] = useState<keyof typeof storageLabels>("pglite");

  async function load() {
    const session = await json<{ authenticated: boolean }>("/api/admin/session");
    setUnlocked(session.authenticated);
    if (!session.authenticated) return;
    const [nextContent, nextVersions, nextStorage] = await Promise.all([
      json<Content>("/api/admin/content"),
      json<Version[]>("/api/admin/versions"),
      getDbSource(),
    ]);
    setContent(nextContent);
    setVersions(nextVersions);
    setStorage(nextStorage);
  }

  useEffect(() => {
    void load().catch(() => setUnlocked(false));
  }, []);

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
    try {
      setContent(
        await json<Content>("/api/admin/content", {
          method: "POST",
          // GET includes managed collections; never send them back from this scalar form.
          body: JSON.stringify({
            headline: content.headline,
            intro: content.intro,
            font: content.font,
            accent: content.accent,
          }),
        }),
      );
      await refreshSiteContent();
      setNotice(storageLabels[storage].saved);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not save.");
    }
  }

  async function version() {
    try {
      const created = await json<Version>("/api/admin/versions", {
        method: "POST",
        body: JSON.stringify({ label: `Website update ${new Date().toLocaleDateString("en-LK")}` }),
      });
      setVersions((current) => [created, ...current].slice(0, 5));
      setNotice("Version created.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not create version.");
    }
  }

  async function restore(versionToRestore: Version) {
    try {
      setContent(
        await json<Content>("/api/admin/versions", {
          method: "PUT",
          body: JSON.stringify({ id: versionToRestore.id }),
        }),
      );
      await refreshSiteContent();
      setNotice(`Restored ${versionToRestore.label}.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not restore version.");
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
      await refreshSiteContent();
      setNotice("Logo uploaded to Vercel Blob.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not upload logo.");
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

  return (
    <main className="min-h-screen bg-bg px-5 pb-20 pt-28 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-iron">SMV GYM admin</p>
            <h1 className="mt-2 font-display text-5xl uppercase">Website control</h1>
            <p className="mt-3 max-w-2xl text-muted">
              Edit the website, save your changes and create a reviewable version.
            </p>
          </div>
          <Link to="/" className="flex items-center gap-2 text-sm text-muted no-underline">
            <Eye className="size-4" />
            View website
          </Link>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
          <section className="rounded-lg border border-line bg-surface p-6">
            <h2 className="font-display text-2xl uppercase">Content and style</h2>
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
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={save}
                className="flex items-center gap-2 rounded-lg bg-iron px-5 py-3 font-semibold text-white"
              >
                <Save className="size-4" />
                {storageLabels[storage].save}
              </button>
              <button
                onClick={version}
                className="flex items-center gap-2 rounded-lg border border-line px-5 py-3"
              >
                <History className="size-4" />
                Create version
              </button>
            </div>
            {notice && <p className="mt-4 text-sm text-iron">{notice}</p>}
          </section>
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
                      <button onClick={() => restore(item)} className="mt-2 text-xs text-iron">
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
