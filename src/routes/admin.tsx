import { createFileRoute, Link } from "@tanstack/react-router";
import { Image, Save, Type, Upload, BarChart3, LockKeyhole } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

export const Route = createFileRoute("/admin")({ component: AdminPage });

type Content = { headline: string; intro: string; font: string; accent: string };
const defaults: Content = {
  headline: "Train strong. Feel good.",
  intro: "A friendly gym in Wadduwa for strength, fitness and bodybuilding.",
  font: "Manrope",
  accent: "#c45c32",
};

function AdminPage() {
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [content, setContent] = useState<Content>(defaults);
  const [saved, setSaved] = useState(false);
  const expected = import.meta.env.VITE_ADMIN_PASSWORD || "change-me";

  useEffect(() => {
    const stored = localStorage.getItem("smv-content");
    if (stored) setContent({ ...defaults, ...JSON.parse(stored) });
    setUnlocked(sessionStorage.getItem("smv-admin") === "1");
  }, []);

  function login(e: FormEvent) {
    e.preventDefault();
    if (password === expected) {
      sessionStorage.setItem("smv-admin", "1");
      setUnlocked(true);
    }
  }

  function save() {
    localStorage.setItem("smv-content", JSON.stringify(content));
    document.documentElement.style.setProperty("--color-iron", content.accent);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  if (!unlocked) return <main className="mx-auto flex min-h-screen max-w-md items-center px-5"><form onSubmit={login} className="w-full rounded-xl bg-surface p-8"><LockKeyhole className="mb-5 size-8 text-iron" /><p className="text-xs uppercase tracking-[0.2em] text-muted">SMV GYM admin</p><h1 className="mt-2 font-display text-4xl uppercase">Welcome back</h1><p className="mt-3 text-muted">Enter your admin password to edit the website.</p><input aria-label="Admin password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-6 w-full rounded-lg border border-line bg-bg px-4 py-3" placeholder="Password" /><button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-iron px-4 py-3 font-semibold text-white">Open editor</button><Link to="/" className="mt-5 block text-center text-sm text-muted no-underline">Back to website</Link></form></main>;

  return <main className="min-h-screen bg-bg px-5 pb-20 pt-28 md:px-8"><div className="mx-auto max-w-6xl"><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-xs uppercase tracking-[0.2em] text-iron">SMV GYM admin</p><h1 className="mt-2 font-display text-5xl uppercase">Edit your website</h1><p className="mt-3 max-w-xl text-muted">Change words, colours and images here. Your updates are saved for the website.</p></div><Link to="/" className="text-sm text-muted no-underline hover:text-fg">View website</Link></div><div className="mt-10 grid gap-5 lg:grid-cols-[1.4fr_0.8fr]"><section className="rounded-xl bg-surface p-6"><div className="mb-6 flex items-center gap-3"><Type className="size-5 text-iron" /><h2 className="font-display text-2xl uppercase">Home page words</h2></div><label className="block text-sm text-muted">Main heading<input value={content.headline} onChange={(e) => setContent({ ...content, headline: e.target.value })} className="mt-2 w-full rounded-lg border border-line bg-bg px-4 py-3 text-fg" /></label><label className="mt-5 block text-sm text-muted">Short welcome message<textarea value={content.intro} onChange={(e) => setContent({ ...content, intro: e.target.value })} rows={4} className="mt-2 w-full rounded-lg border border-line bg-bg px-4 py-3 text-fg" /></label><div className="mt-5 grid gap-5 sm:grid-cols-2"><label className="block text-sm text-muted">Font<select value={content.font} onChange={(e) => setContent({ ...content, font: e.target.value })} className="mt-2 w-full rounded-lg border border-line bg-bg px-4 py-3 text-fg"><option>Manrope</option><option>Arial</option><option>Georgia</option><option>Trebuchet MS</option></select></label><label className="block text-sm text-muted">Accent colour<input type="color" value={content.accent} onChange={(e) => setContent({ ...content, accent: e.target.value })} className="mt-2 h-12 w-full rounded-lg border border-line bg-bg p-1" /></label></div><button onClick={save} className="mt-7 flex items-center gap-2 rounded-lg bg-iron px-5 py-3 font-semibold text-white"><Save className="size-4" />{saved ? "Saved" : "Save changes"}</button></section><aside className="space-y-5"><div className="rounded-xl bg-surface p-6"><div className="flex items-center gap-3"><Image className="size-5 text-iron" /><h2 className="font-display text-2xl uppercase">Logo and photos</h2></div><img src="/images/smv-logo.png" alt="SMV GYM logo" className="mx-auto mt-6 h-40 w-40 object-contain" /><button className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-line px-4 py-3 text-sm"><Upload className="size-4" />Upload image</button><p className="mt-3 text-xs text-muted">Vercel Blob will store images after you connect BLOB_READ_WRITE_TOKEN.</p></div><div className="rounded-xl bg-surface p-6"><div className="flex items-center gap-3"><BarChart3 className="size-5 text-iron" /><h2 className="font-display text-2xl uppercase">Visitors</h2></div><p className="mt-3 text-sm text-muted">Visitor tracking is ready to connect to Vercel Analytics or your database.</p><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-lg bg-bg p-4"><p className="text-2xl font-semibold">--</p><p className="text-xs text-muted">Visits</p></div><div className="rounded-lg bg-bg p-4"><p className="text-2xl font-semibold">--</p><p className="text-xs text-muted">Today</p></div></div></div></aside></div></div></main>;
}
