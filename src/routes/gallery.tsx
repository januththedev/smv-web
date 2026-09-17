import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { site } from "@/lib/site";
import { useSiteContent, useSiteCopy, type GalleryPhoto } from "@/lib/site-content";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/gallery")({
  component: Gallery,
  head: () => ({
    meta: [
      { title: `Gallery — ${site.fullName}` },
      {
        name: "description",
        content: "Inside SMV GYM Wadduwa — our gym, the coast and our community.",
      },
    ],
  }),
});

/*
 * Editorial row plan — a 12-column grid laid out as deliberate "spreads",
 * the way a print journal paces a photo essay. H is the shared row height
 * expressed in column units, so every image in a spread lands on the same
 * baseline: a span-S cell gets aspect S/H.
 */
type Row = { spans: number[]; h: number };

const ROWS: Row[] = [
  { spans: [7, 5], h: 5 },
  { spans: [5, 7], h: 4 },
  { spans: [12], h: 5 },
  { spans: [4, 4, 4], h: 6 },
  { spans: [7, 5], h: 4 },
  { spans: [5, 7], h: 5 },
  { spans: [12], h: 4 },
  { spans: [4, 8], h: 6 },
  { spans: [7, 5], h: 5 },
  { spans: [5, 7], h: 4 },
  { spans: [12], h: 5 },
  { spans: [4, 8], h: 4 },
];

const DESKTOP_SPAN: Record<number, string> = {
  4: "md:col-span-4",
  5: "md:col-span-5",
  7: "md:col-span-7",
  8: "md:col-span-8",
  12: "md:col-span-12",
};

/* Static class map so Tailwind's scanner sees every literal. */
const DESKTOP_ASPECT: Record<string, string> = {
  "4/4": "md:aspect-[4/4]",
  "4/6": "md:aspect-[4/6]",
  "5/4": "md:aspect-[5/4]",
  "5/5": "md:aspect-[5/5]",
  "7/4": "md:aspect-[7/4]",
  "7/5": "md:aspect-[7/5]",
  "8/4": "md:aspect-[8/4]",
  "8/6": "md:aspect-[8/6]",
  "12/4": "md:aspect-[12/4]",
  "12/5": "md:aspect-[12/5]",
};

/* Varied mobile proportions — no uniform squares on small screens either. */
const MOBILE_ASPECT = [
  "aspect-[4/3]",
  "aspect-[3/4]",
  "aspect-[16/10]",
  "aspect-[4/5]",
];

type Photo = {
  src: string;
  alt: string;
  tag: string;
  span: number;
  frameClass: string;
};

function layoutPhotos(items: ReadonlyArray<{ src: string; alt: string; tag: string }>): Photo[] {
  const photos: Photo[] = [];
  let rowIdx = 0;
  let colIdx = 0;
  for (const g of items) {
    const row = ROWS[rowIdx % ROWS.length];
    const span = row.spans[colIdx % row.spans.length];
    const key = `${span}/${row.h}`;
    photos.push({
      ...g,
      span,
      frameClass: cn(
        MOBILE_ASPECT[photos.length % MOBILE_ASPECT.length],
        DESKTOP_ASPECT[key],
      ),
    });
    colIdx += 1;
    if (colIdx >= row.spans.length) {
      colIdx = 0;
      rowIdx += 1;
    }
  }
  return photos;
}

function Gallery() {
  const { gallery } = useSiteContent();
  const copy = useSiteCopy();
  // null is the all-photos filter; actual tags may be "All" or empty.
  const [selectedTag, setTag] = useState<string | null>(null);
  const tags = useMemo(() => [
    { value: null, label: "All", count: gallery.length },
    ...Array.from(new Set(gallery.map((photo) => photo.tag))).map((value) => ({
      value,
      label: value === "All" ? "All (tag)" : value || "Untagged",
      count: gallery.filter((photo) => photo.tag === value).length,
    })),
  ], [gallery]);
  const tag = tags.some((item) => item.value === selectedTag) ? selectedTag : null;
  const [selection, setSelection] = useState<{
    collection: GalleryPhoto[]; tag: string | null; index: number;
  } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const allPhotosRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const items = useMemo(
    () => (tag === null ? gallery : gallery.filter((g) => g.tag === tag)),
    [tag, gallery],
  );
  const photos = useMemo(() => layoutPhotos(items), [items]);
  // Never reuse an index against a newly loaded/reordered collection.
  const openIndex = selection?.collection === gallery && selection.tag === tag
    ? selection.index : null;
  const current = openIndex !== null ? photos[openIndex] : undefined;
  const isOpen = current !== undefined;

  useEffect(() => {
    if (selectedTag !== tag) setTag(tag);
  }, [selectedTag, tag]);

  /* Subtle editorial entrance — transform/opacity only, motion-guarded. */
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || photos.length === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;
    void import("gsap").then(({ gsap }) => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        gsap.fromTo(
          grid.querySelectorAll("[data-photo]"),
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", stagger: 0.05, clearProps: "all" },
        );
      }, grid);
    });
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [photos]);

  useEffect(() => {
    if (!isOpen) return;
    const lenis = window.__lenis;
    const wasStopped = lenis?.isStopped;
    lenis?.stop();
    return () => {
      if (!wasStopped) lenis?.start();
    };
  }, [isOpen]);

  const step = (delta: number) => {
    if (!isOpen || photos.length < 2) return;
    setSelection((value) => value && value.collection === gallery && value.tag === tag
      ? { ...value, index: (value.index + delta + photos.length) % photos.length }
      : null);
  };

  return (
    <main id="main">
      <header className="mx-auto max-w-6xl px-5 pt-32 pb-12 md:px-8 md:pt-44 md:pb-16">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-4 text-xs uppercase tracking-[0.22em] text-muted">
          <span>SMV / Photo journal</span>
          <span>{String(gallery.length).padStart(2, "0")} frames · Wadduwa</span>
        </div>
        <div className="mt-10 grid items-end gap-8 md:grid-cols-12 md:gap-6">
          <h1 className="font-display text-[clamp(4rem,12vw,9rem)] font-semibold uppercase leading-[0.86] tracking-tight md:col-span-8">
            {copy("gallery.hero.title") === "Life on the floor." ? (
              <>Life on<br />the floor<span className="text-iron">.</span></>
            ) : copy("gallery.hero.title")}
          </h1>
          <div className="max-w-sm md:col-span-4 md:pb-1">
            <p className="text-base leading-relaxed text-muted">
              {copy("gallery.hero.body")}
            </p>
            <p className="mt-5 text-xs uppercase tracking-[0.18em] text-fg">{copy("gallery.hero.cta")}</p>
          </div>
        </div>
      </header>

      {/* Editorial filter tabs */}
      <div className="mx-auto max-w-6xl px-5 pb-10 md:px-8 md:pb-14">
        <div
          className="w-full"
          role="group"
          aria-label="Filter photos by subject"
        >
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-b border-line">
            {tags.map((t) => {
              const selected = tag === t.value;
              return (
                <button
                  key={t.value === null ? "all-photos" : `tag-${t.value}`}
                  ref={t.value === null ? allPhotosRef : undefined}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => { setTag(t.value); setSelection(null); }}
                  className={cn(
                    "-mb-px inline-flex min-h-11 min-w-11 items-center gap-1.5 border-b-2 whitespace-nowrap text-xs uppercase tracking-[0.2em]",
                    selected
                      ? "border-iron text-fg"
                      : "border-transparent text-muted hover:text-fg",
                  )}
                >
                  {t.label}
                  <span
                    className={cn(
                      "font-display text-sm tracking-normal",
                      selected ? "text-fg" : "text-muted",
                    )}
                  >
                    {t.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <p className="sr-only" aria-live="polite">
          Showing {photos.length} {photos.length === 1 ? "photo" : "photos"}
          {tag === null ? "" : ` in ${tag || "Untagged"}`}
        </p>
      </div>

      {/* Varied-proportion photo grid */}
      <div className="mx-auto max-w-6xl px-5 pb-24 md:px-8 md:pb-32">
        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-x-4 gap-y-10 md:grid-cols-12 md:gap-x-6 md:gap-y-14"
        >
          {photos.length === 0 && (
            <p className="py-10 text-sm text-muted md:col-span-12">New photos are on the way.</p>
          )}
          {photos.map((p, i) => (
            <figure key={`${tag}-${p.src}-${i}`} data-photo className={cn("min-w-0", DESKTOP_SPAN[p.span])}>
              <div className={cn("relative overflow-hidden bg-surface", p.frameClass)}>
                <button
                  type="button"
                  onClick={(event) => {
                    openerRef.current = event.currentTarget;
                    setSelection({ collection: gallery, tag, index: i });
                  }}
                  aria-label={`Open photo: ${p.alt}`}
                  aria-haspopup="dialog"
                  className="absolute inset-0 block h-full w-full overflow-hidden shadow-border focus-visible:-outline-offset-4"
                >
                  <img
                    src={p.src}
                    alt={p.alt}
                    loading={i < 3 ? "eager" : "lazy"}
                    decoding="async"
                    {...(i === 0 ? { fetchPriority: "high" as const } : {})}
                    className="h-full w-full object-cover"
                  />
                </button>
              </div>
              <figcaption className="mt-3 flex items-baseline justify-between gap-4">
                <span className="shrink-0 font-display text-sm tracking-[0.08em] text-iron">
                  {String(i + 1).padStart(2, "0")}
                  <span className="ml-2 font-sans text-[0.625rem] uppercase tracking-[0.22em] text-muted">
                    {p.tag}
                  </span>
                </span>
                <span className="hidden text-right text-xs text-muted sm:block">{p.alt}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <Dialog.Root
        open={current !== undefined}
        onOpenChange={(open) => {
          if (!open) setSelection(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[60] bg-bg/92 backdrop-blur-sm" />
          <Dialog.Content
            data-lenis-prevent
            aria-describedby={undefined}
            onOpenAutoFocus={(event) => {
              event.preventDefault();
              closeRef.current?.focus();
            }}
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              const target = openerRef.current?.isConnected
                ? openerRef.current : allPhotosRef.current;
              target?.focus({ preventScroll: true });
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") {
                e.preventDefault();
                step(1);
              } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                step(-1);
              }
            }}
            className="fixed inset-0 z-[61] flex flex-col items-center justify-center p-4 focus:outline-none md:p-10"
          >
            <Dialog.Title className="sr-only">{current?.alt ?? "Photo"}</Dialog.Title>

            {current ? (
              <figure className="flex max-h-full flex-col items-center gap-4">
                <img
                  key={current.src}
                  src={current.src}
                  alt={current.alt}
                  className="max-h-[74dvh] w-auto max-w-full rounded-lg object-contain shadow-border"
                />
                <figcaption className="flex w-full max-w-3xl flex-wrap items-baseline justify-between gap-2 px-1 text-xs uppercase tracking-[0.2em] text-muted">
                  <span>
                    <span className="font-display text-base tracking-[0.08em] text-iron">
                      {String(openIndex! + 1).padStart(2, "0")}
                    </span>
                    <span className="ml-3">{current.tag}</span>
                  </span>
                  <span className="tracking-[0.14em]">
                    {String(openIndex! + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
                  </span>
                </figcaption>
                <p className="max-w-3xl px-1 text-sm text-fg/85">{current.alt}</p>
              </figure>
            ) : null}

            <Dialog.Close
              ref={closeRef}
              aria-label="Close photo viewer"
              className="absolute top-4 right-4 inline-flex size-11 items-center justify-center rounded-full bg-fg text-bg transition-colors hover:bg-iron md:top-6 md:right-6"
            >
              <X className="size-5" aria-hidden="true" />
            </Dialog.Close>

            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => step(-1)}
              className="absolute top-1/2 left-3 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-raised text-fg shadow-border transition-colors hover:text-iron md:left-6"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => step(1)}
              className="absolute top-1/2 right-3 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-raised text-fg shadow-border transition-colors hover:text-iron md:right-6"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </main>
  );
}
