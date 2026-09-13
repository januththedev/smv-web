import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHero } from "@/components/page-hero";
import { gallery, site } from "@/lib/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/gallery")({
  component: Gallery,
  head: () => ({
    meta: [
      { title: `Floor — ${site.fullName}` },
      {
        name: "description",
        content: "Inside SMV GYM Wadduwa — the floor, the coast, and the community.",
      },
    ],
  }),
});

const tags = ["All", "Floor", "Strength", "Conditioning", "Coast", "Community"] as const;

function Gallery() {
  const [tag, setTag] = useState<(typeof tags)[number]>("All");
  const [active, setActive] = useState<string | null>(null);
  const items = useMemo(
    () => (tag === "All" ? gallery : gallery.filter((g) => g.tag === tag)),
    [tag],
  );
  const current = gallery.find((g) => g.src === active);

  return (
    <main id="main">
      <PageHero
        kicker="Gallery"
        title="The floor."
        lede="See our gym, our members and our training sessions. Tap a photo to open it."
      />

      <div className="mx-auto max-w-6xl px-5 pb-6 md:px-8">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Gallery filters">
          {tags.map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tag === t}
              onClick={() => setTag(t)}
              className={cn(
                "h-10 rounded-full px-4 text-sm transition-[background-color,color] duration-150 ease-out",
                tag === t ? "bg-fg text-bg" : "text-muted shadow-[0_0_0_1px_rgb(238_234_227_/_14%)] hover:text-fg",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto columns-1 gap-3 px-5 pb-24 sm:columns-2 md:columns-3 md:px-8">
        {items.map((g) => (
          <button
            key={g.src}
            type="button"
            onClick={() => setActive(g.src)}
            className="mb-3 block w-full overflow-hidden rounded-lg p-0 text-left"
          >
            <img src={g.src} alt={g.alt} className="w-full object-cover" />
          </button>
        ))}
      </div>

      {current ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-bg/92 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          onClick={() => setActive(null)}
        >
          <img
            src={current.src}
            alt={current.alt}
            className="max-h-[88dvh] max-w-full rounded-lg object-contain"
          />
          <button
            type="button"
            className="absolute top-4 right-4 h-11 rounded-full bg-fg px-4 text-sm text-bg"
            onClick={() => setActive(null)}
          >
            Close
          </button>
        </div>
      ) : null}
    </main>
  );
}
