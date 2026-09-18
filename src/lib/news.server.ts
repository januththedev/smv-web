import { fallbackNews, type NewsPayload, type NewsPost } from "@/lib/news";
import { site } from "@/lib/site";
import { fetchNewsText as fetchText } from "./news-fetch.server.ts";

const CACHE_MS = 15 * 60 * 1000;
const LOCAL_IMAGES = [
  "/images/cricket.jpg",
  "/images/physique.jpg",
  "/images/beach.jpg",
  "/images/hero-floor.jpg",
  "/images/group.jpg",
  "/images/boxing.jpg",
  "/images/coach.jpg",
  "/images/deadlift.jpg",
];

let cache: { at: number; payload: NewsPayload } | null = null;

function decodeEntities(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&/g, "&")
    .replace(/"/g, '"')
    .replace(/&#39;|'/g, "'")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function tag(xml: string, name: string) {
  const match = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"));
  return match ? decodeEntities(match[1] ?? "") : "";
}

function pickImage(title: string, body: string, index: number): string {
  const hay = `${title} ${body}`.toLowerCase();
  if (hay.includes("cricket")) return "/images/cricket.jpg";
  if (hay.includes("bodybuild") || hay.includes("physique") || hay.includes("championship")) {
    return "/images/physique.jpg";
  }
  if (hay.includes("beach") || hay.includes("coast")) return "/images/beach.jpg";
  if (hay.includes("box")) return "/images/boxing.jpg";
  if (hay.includes("coach")) return "/images/coach.jpg";
  return LOCAL_IMAGES[index % LOCAL_IMAGES.length] ?? "/images/hero-floor.jpg";
}

function formatWhen(raw: string) {
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return "Facebook";
  return date.toLocaleDateString("en-LK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function parseRss(xml: string): NewsPost[] {
  const blocks = [...xml.matchAll(/<(?:item|entry)[\s\S]*?<\/(?:item|entry)>/gi)].map(
    (match) => match[0],
  );
  const posts: NewsPost[] = [];
  for (const [index, block] of blocks.entries()) {
    const title = tag(block, "title") || tag(block, "media:title");
    const body =
      tag(block, "description") ||
      tag(block, "content") ||
      tag(block, "summary") ||
      tag(block, "content:encoded");
    const href =
      block.match(/<link[^>]*href=["']([^"']+)["']/i)?.[1] ||
      tag(block, "link") ||
      tag(block, "guid") ||
      site.facebook;
    const when = formatWhen(tag(block, "pubDate") || tag(block, "published") || tag(block, "updated"));
    if (!title || title.length < 4) continue;
    const cleanBody = body.slice(0, 220);
    posts.push({
      id: `live-${index}-${title.slice(0, 24)}`,
      title: title.slice(0, 90),
      body: cleanBody || "See this update on the SMV GYM Facebook page.",
      when,
      image: pickImage(title, cleanBody, index),
      href: href.startsWith("http") ? href : site.facebook,
    });
    if (posts.length >= 8) break;
  }
  return posts;
}

function mergePosts(live: NewsPost[]) {
  const seen = new Set<string>();
  const out: NewsPost[] = [];
  for (const post of [...live, ...fallbackNews]) {
    const key = post.title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(post);
  }
  return out.slice(0, 8);
}

export async function loadNews(): Promise<NewsPayload> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.payload;

  const sources = [
    `https://rsshub.app/facebook/page/SarangalakmalFitness`,
    `https://rsshub.app/facebook/page/SarangalakmalFitness?format=atom`,
    site.facebookEmbed,
  ];

  let livePosts: NewsPost[] = [];
  for (const url of sources) {
    const text = await fetchText(url);
    if (!text) continue;
    livePosts = parseRss(text);
    if (livePosts.length) break;
  }

  const payload: NewsPayload = livePosts.length
    ? { posts: mergePosts(livePosts), live: true, source: "facebook" }
    : { posts: fallbackNews, live: false, source: "gym" };

  cache = { at: Date.now(), payload };
  return payload;
}
