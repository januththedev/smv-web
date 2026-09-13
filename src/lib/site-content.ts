import { useEffect, useState } from "react";

export type PublicSiteContent = { headline: string; intro: string; font: string; accent: string };
const fallback: PublicSiteContent = { headline: "Train strong. Feel good.", intro: "A friendly gym in Wadduwa for strength, fitness and bodybuilding.", font: "Manrope", accent: "#c45c32" };

export function useSiteContent() {
  const [content, setContent] = useState(fallback);
  useEffect(() => {
    void fetch("/api/content").then((response) => response.ok ? response.json() : fallback).then((next: PublicSiteContent) => {
      setContent(next);
      document.documentElement.style.setProperty("--color-iron", next.accent);
      document.documentElement.style.setProperty("--font-sans", next.font);
    }).catch(() => undefined);
  }, []);
  return content;
}
