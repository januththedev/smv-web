import { useEffect, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import { Hero } from "@/components/sections/hero";
import { VelocityMarquee } from "@/components/motion/marquee";
import { ScrubHeading } from "@/components/motion/scrub-heading";
import { Button } from "@/components/ui/button";
import { useSiteContent, useSiteCopy } from "@/lib/site-content";
import { site, waJoin } from "@/lib/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: `${site.fullName} — ${site.tagline}` },
      { name: "description", content: site.description },
    ],
  }),
});

/* Ruled section header: index + title + trailing rule, shared by every section. */
function SectionHead({
  index,
  title,
  aside,
}: {
  index: string;
  title: string;
  aside?: { label: string; to: string };
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b border-line pb-5">
      <div className="flex items-baseline gap-4">
        <span className="font-display text-sm font-semibold tracking-[0.2em] text-iron">
          {index}
        </span>
        <h2 data-scroll-title className="font-display text-4xl font-semibold uppercase leading-none tracking-tight md:text-6xl">
          {title.split(" ").map((word, i) => (
            <span key={`${word}-${i}`}>
              {i > 0 ? " " : ""}
              <span data-reveal-word className="inline-block">{word}</span>
            </span>
          ))}
        </h2>
      </div>
      {aside ? (
        <Link
          to={aside.to}
          className="group inline-flex min-h-11 shrink-0 items-center gap-1.5 text-xs text-muted no-underline hover:text-fg sm:text-sm"
        >
          {aside.label}
          <ArrowUpRight
            aria-hidden="true"
            className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      ) : null}
    </div>
  );
}

function Home() {
  const mainRef = useRef<HTMLElement>(null);
  const content = useSiteContent();
  const copy = useSiteCopy();
  // Managed collections may be emptied or shortened in the admin layer.
  const programs = content.programs;
  const events = content.events;
  const quotes = content.quotes;
  const gallery = content.gallery;

  useEffect(() => {
    const root = mainRef.current;
    if (!root || !("IntersectionObserver" in window)) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();
    const frames = new Set<number>();
    const counters = Array.from(root.querySelectorAll<HTMLElement>("[data-scroll-count]"));
    const formatter = new Intl.NumberFormat("en-US");
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting || preference.matches) continue;
        observer.unobserve(entry.target);
        const element = entry.target as HTMLElement;
        if (element.hasAttribute("data-scroll-title")) {
          element.querySelectorAll<HTMLElement>("[data-reveal-word]").forEach((word, i) => {
            const animation = word.animate(
              [{ opacity: 0, transform: "translateY(18px)" }, { opacity: 1, transform: "translateY(0)" }],
              { duration: 600, delay: Math.min(i * 65, 260), easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "backwards" },
            );
            animations.add(animation);
            animation.onfinish = () => animations.delete(animation);
          });
        } else {
          const final = element.dataset.scrollCount!;
          const target = Number(final.replace(/[^\d.]/g, ""));
          const suffix = final.endsWith("%") ? "%" : "";
          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / 1400, 1);
            element.textContent = progress === 1
              ? final
              : `${formatter.format(Math.round(target * (1 - (1 - progress) ** 3)))}${suffix}`;
            if (progress < 1) schedule();
          };
          const schedule = () => {
            const frame = requestAnimationFrame((now) => {
              frames.delete(frame);
              tick(now);
            });
            frames.add(frame);
          };
          schedule();
        }
      }
    }, { threshold: 0.2, rootMargin: "0px 0px -8% 0px" });

    const finish = () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      frames.forEach(cancelAnimationFrame);
      animations.clear();
      frames.clear();
      counters.forEach((element) => { element.textContent = element.dataset.scrollCount!; });
    };
    if (!preference.matches) {
      root.querySelectorAll("[data-scroll-title], [data-scroll-count]").forEach((element) => observer.observe(element));
    }
    preference.addEventListener("change", finish);
    return () => {
      finish();
      preference.removeEventListener("change", finish);
    };
  }, []);

  return (
    <main id="main" ref={mainRef}>
      <Hero />
      <VelocityMarquee />

      {/* 01 — Introduction: ruled editorial two-column */}
      <section className="mx-auto max-w-6xl px-5 pt-20 md:px-8 md:pt-28">
        <SectionHead index="01" title={copy("home.about.title")} />
        <div className="grid gap-10 pt-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-4">
            <p className="text-xs uppercase tracking-[0.22em] text-muted">
              Galle Road — {site.city}
            </p>
            <p className="mt-6 text-lg leading-relaxed text-fg">
              {copy("home.about.body")}
            </p>
            <Button asChild variant="ghost" className="mt-8 pr-3.5">
              <Link to="/membership">
                Join SMV <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3 md:col-span-7 md:col-start-6 md:gap-4">
            <img
              src="/images/interior.jpg"
              alt="Gym interior with machines and free weights"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover"
            />
            <img
              src="/images/rack.jpg"
              alt="Squat rack ready for training"
              loading="lazy"
              className="mt-8 aspect-[4/5] w-full object-cover md:mt-12"
            />
          </div>
        </div>
      </section>

      {/* 02 — Programs: asymmetric 2-column editorial photo cards */}
      <section className="mx-auto max-w-6xl px-5 pt-24 md:px-8 md:pt-32">
        <SectionHead index="02" title={copy("home.programs.title")} />
        <div className="grid gap-x-4 gap-y-14 pt-10 sm:grid-cols-2 md:gap-y-20">
          {programs.map((p, i) => {
            // Asymmetric rhythm: alternate column placement, offset and ratio.
            const a = i % 2 === 0;
            return (
              <article
                key={`${p.slug}-${i}`}
                className={
                  a
                    ? "sm:col-span-1"
                    : "sm:col-span-1 sm:mt-16 md:mt-24"
                }
              >
                <figure className="relative">
                  <div
                    className={
                      a
                        ? "aspect-[4/3] overflow-hidden"
                        : "aspect-[3/4] overflow-hidden"
                    }
                  >
                    <img
                      src={p.image}
                      alt={p.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                    />
                  </div>
                  <span
                    aria-hidden="true"
                    className="absolute -top-5 right-0 font-display text-6xl font-semibold leading-none tracking-tight text-fg/15 md:text-7xl"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </figure>
                <div className="mt-5 border-t border-line pt-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-iron">
                    {p.kicker}
                  </p>
                  <h3 className="mt-2 font-display text-3xl font-semibold uppercase tracking-tight md:text-4xl">
                    {p.title}
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
                    {p.copy}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Interlude — inverted editorial band: the coast */}
      <section className="mt-24 bg-fg text-bg md:mt-32">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-12 md:px-8 md:py-24">
          <div className="md:col-span-7">
            <p className="text-xs uppercase tracking-[0.24em] opacity-60">
              The south coast
            </p>
            <h2 className="mt-4 font-display text-5xl font-semibold uppercase leading-[0.9] tracking-tight md:text-7xl">
              {copy("home.beach.title")}
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed opacity-70">
              {copy("home.beach.body")}
            </p>
          </div>
          <figure className="md:col-span-5">
            <img
              src="/images/beach.jpg"
              alt="Wadduwa coastline used for beach training"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover md:aspect-[3/4]"
            />
            <figcaption className="mt-3 flex justify-between text-xs uppercase tracking-[0.18em] opacity-60">
              <span>Beach training</span>
              <span>Wadduwa, LK</span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* 03 — Community: ruled stat ledger, real Facebook numbers */}
      <section className="mx-auto max-w-6xl px-5 pt-24 md:px-8 md:pt-32">
        <SectionHead index="03" title="The community" />
        <ul className="grid grid-cols-1 divide-y divide-line border-x border-b border-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            { n: site.community.likes, l: "Likes on Facebook" },
            { n: site.community.checkins, l: "Facebook check-ins" },
            { n: site.community.recommend, l: "Would recommend" },
          ].map((s) => (
            <li key={s.l} className="px-6 py-10">
              <p className="font-display text-5xl font-semibold tracking-tight tabular-nums md:text-6xl">
                <span className="sr-only">{s.n}</span>
                <span aria-hidden="true" className="inline-grid">
                  <span className="invisible col-start-1 row-start-1">{s.n}</span>
                  <span data-scroll-count={s.n} className="col-start-1 row-start-1">{s.n}</span>
                </span>
              </p>
              <p className="mt-2 text-sm text-muted">{s.l}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 04 — Journal: editorial ruled rows, not a calendar */}
      <section className="mx-auto max-w-6xl px-5 pt-24 md:px-8 md:pt-32">
        <SectionHead
          index="04"
          title={copy("home.events.title")}
          aside={{ label: copy("home.events.aside"), to: "/events" }}
        />
        <div className="divide-y divide-line">
          {events.map((ev, i) => (
            <article key={`${ev.slug}-${i}`} className="group">
              <Link
                to="/events"
                className="grid items-center gap-5 py-7 no-underline md:grid-cols-12 md:gap-8"
              >
                <span className="font-display text-sm font-semibold tracking-[0.2em] text-iron md:col-span-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="md:col-span-2">
                  <img
                    src={ev.image}
                    alt=""
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover md:aspect-square"
                  />
                </div>
                <div className="md:col-span-7">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">
                    {ev.kicker} · {ev.when}
                  </p>
                  <h3 className="mt-2 font-display text-3xl font-semibold uppercase leading-tight tracking-tight transition-colors group-hover:text-iron md:text-4xl">
                    {ev.title}
                  </h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                    {ev.copy}
                  </p>
                </div>
                <span className="hidden justify-self-end text-muted transition-transform group-hover:translate-x-1 group-hover:text-fg md:col-span-2 md:block">
                  <ArrowRight aria-hidden="true" className="size-6" />
                </span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Quotes — restrained, ruled single column pair */}
      <section className="mx-auto max-w-6xl px-5 pt-24 md:px-8 md:pt-32">
        <SectionHead index="05" title={copy("home.quotes.title")} />
        <div className="grid gap-x-8 pt-10 sm:grid-cols-2">
          {quotes.map((q, i) => (
            <blockquote
              key={`${q.name}-${i}`}
              className="border-t border-line py-7"
            >
              <p className="font-display text-2xl font-semibold uppercase leading-tight tracking-tight text-fg md:text-3xl">
                “{q.quote}”
              </p>
              <footer className="mt-3 flex items-baseline gap-3 text-sm text-muted">
                <span className="font-display text-xs font-semibold tracking-[0.2em] text-iron">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {q.name}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* 06 — Gallery teaser: offset sharp photo spread */}
      <section className="mx-auto max-w-6xl px-5 pt-24 md:px-8 md:pt-32">
        <SectionHead
          index="06"
          title={copy("home.gallery.title")}
          aside={{ label: copy("home.gallery.aside"), to: "/gallery" }}
        />
        <div className="grid grid-cols-2 gap-3 pt-10 md:grid-cols-4 md:gap-4">
          {gallery.length ? (
            gallery.slice(0, 4).map((photo, i) => (
              <img
                key={`${photo.src}-${i}`}
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className={cn(
                  "aspect-[3/4] w-full object-cover",
                  i % 2 === 1 && "md:mt-10",
                )}
              />
            ))
          ) : (
            <p className="col-span-2 text-sm text-muted md:col-span-4">
              New photos are on the way.
            </p>
          )}
        </div>
      </section>

      {/* Scrub interlude */}
      <section className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
        <p className="mb-4 text-xs uppercase tracking-[0.22em] text-muted">
          Your next chapter
        </p>
        <ScrubHeading text="Gain. Lose. Build." />
      </section>

      {/* 07 — Visit: strong CTA band */}
      <section className="border-t border-line bg-surface">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-12 md:px-8 md:py-24">
          <div className="md:col-span-7">
            <p className="text-xs uppercase tracking-[0.22em] text-iron">
              {copy("home.visit.title")}
            </p>
            <h2 className="mt-3 font-display text-5xl font-semibold uppercase leading-[0.9] tracking-tight md:text-7xl">
              {copy("home.visit.address")}
            </h2>
            <p className="mt-5 flex items-start gap-2 text-muted">
              <MapPin aria-hidden="true" className="mt-1 size-4 shrink-0 text-iron" />
              {copy("home.visit.body")}
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 md:col-span-5 md:items-end md:justify-end">
            <Button asChild size="lg">
              <a href={waJoin()}>
                {copy("home.visit.whatsapp")} <ArrowUpRight className="size-4" />
              </a>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link to="/membership">{copy("home.visit.map")}</Link>
            </Button>
            <a
              href={`tel:${site.phoneTel}`}
              className="mt-1 text-sm text-muted no-underline hover:text-fg"
            >
              Or call {site.phone}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
