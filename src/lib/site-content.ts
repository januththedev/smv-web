import { useCallback, useSyncExternalStore } from "react";
import { defaultSiteContent, type SiteContent } from "@/lib/site-content-schema";
import { copyDefaults, type CopyKey } from "@/lib/site-copy";

export type {
  SiteContent,
  ProgramItem,
  EventItem,
  QuoteItem,
  GalleryPhoto,
  SectionsCollectionKey,
} from "@/lib/site-content-schema";
export { defaultSiteContent, sectionsCollectionKeys, isSectionsCollectionKey } from "@/lib/site-content-schema";

// One browser snapshot and one request for every consumer, including the nav/footer.
// SSR always reads defaults; subscriptions (and network I/O) only start on the client.
let snapshot = defaultSiteContent;
let inFlight: Promise<void> | undefined;
const listeners = new Set<() => void>();
const getSnapshot = () => snapshot;
const getServerSnapshot = () => defaultSiteContent;

export function refreshSiteContent(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (inFlight) return inFlight;
  inFlight = (async () => {
    try {
      const response = await fetch("/api/content", { cache: "no-store", credentials: "same-origin" });
      if (!response.ok) return;
      const next: Partial<SiteContent> = await response.json();
      if (!next || typeof next !== "object" || Array.isArray(next)) return;
      const merged = { ...defaultSiteContent, ...next };
      // Do not turn intentionally empty strings or collections into defaults.
      if (JSON.stringify(merged) !== JSON.stringify(snapshot)) {
        snapshot = merged;
        listeners.forEach((notify) => notify());
      }
      document.documentElement.style.setProperty("--color-iron", snapshot.accent);
      document.documentElement.style.setProperty("--font-sans", snapshot.font);
    } catch {
      // Retain the last good snapshot; a later focus retries failed requests.
    }
  })().finally(() => { inFlight = undefined; });
  return inFlight;
}

const onFocus = () => { void refreshSiteContent(); };
function subscribe(notify: () => void) {
  listeners.add(notify);
  if (listeners.size === 1) {
    window.addEventListener("focus", onFocus);
    void refreshSiteContent();
  }
  return () => {
    listeners.delete(notify);
    if (!listeners.size) window.removeEventListener("focus", onFocus);
  };
}

export function useSiteContent(): SiteContent {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useSiteCopy() {
  const { sections } = useSiteContent();
  return useCallback((key: CopyKey): string => sections[key] ?? copyDefaults[key], [sections]);
}
