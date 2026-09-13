import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Hero } from "@/components/sections/hero";
import { VelocityMarquee } from "@/components/motion/marquee";
import { ScrubHeading } from "@/components/motion/scrub-heading";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { Button } from "@/components/ui/button";
import { events, gallery, programs, quotes, site, waJoin } from "@/lib/site";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: `${site.fullName} — ${site.tagline}` },
      { name: "description", content: site.description },
    ],
  }),
});

function Home() {
  return (
    <main id="main">
      <Hero />
      <VelocityMarquee />

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-12 md:px-8 md:py-28">
        <div className="md:col-span-5">
          <p className="text-xs uppercase tracking-[0.22em] text-iron">Galle Road</p>
          <h2 className="mt-3 font-display text-5xl font-semibold uppercase leading-[0.92] tracking-tight md:text-6xl">
            A friendly gym in Wadduwa.
          </h2>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <p className="text-lg text-muted">
            SMV is a local gym for strength, fitness and bodybuilding. Our coach and members
            are here to help you train safely and keep going.
          </p>
          <p className="mt-4 text-muted">
            Visit us for a first session and see if SMV is right for you.
          </p>
          <Button asChild variant="ghost" className="mt-8 pr-3.5">
            <Link to="/about">
              The story <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="px-5 pb-8 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex items-end justify-between gap-6">
            <h2 className="font-display text-4xl font-semibold uppercase tracking-tight md:text-5xl">
              How we train
            </h2>
            <Link
              to="/training"
              className="hidden text-sm text-muted no-underline hover:text-fg sm:inline"
            >
              All training
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {programs.map((p) => (
              <SpotlightCard key={p.slug} className="min-h-[22rem]">
                <Link to="/training" hash={p.slug} className="relative block h-full no-underline">
                  <img
                    src={p.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
                  <div className="relative flex h-full min-h-[22rem] flex-col justify-end p-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-iron">{p.kicker}</p>
                    <h3 className="mt-2 font-display text-3xl font-semibold uppercase tracking-tight">
                      {p.title}
                    </h3>
                    <p className="mt-2 max-w-sm text-sm text-fg/80">{p.copy}</p>
                  </div>
                </Link>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-24 md:px-8">
        <p className="text-xs uppercase tracking-[0.22em] text-muted">South coast</p>
        <ScrubHeading text="Train on the sand. Lift on Galle Road." />
      </section>

      <section className="relative overflow-hidden">
        <img
          src="/images/sri-lanka.jpg"
          alt="South coast of Sri Lanka"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-bg/70" />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-5 py-24 md:grid-cols-2 md:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-iron">Beach program</p>
            <h2 className="mt-3 font-display text-5xl font-semibold uppercase leading-[0.9] tracking-tight">
              Physical fitness, Wadduwa beach.
            </h2>
          </div>
          <div className="flex flex-col justify-end">
            <p className="text-lg text-fg/85">
              SMV runs outdoor conditioning on the coast — the session the Facebook page still
              posts as the beach training program. Same coach. Different floor.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <a href={waJoin("Hi SMV — I want the next beach training session.")}>
                  Join a beach session
                </a>
              </Button>
              <Button asChild variant="ghost">
                <Link to="/events">See events</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-line md:grid-cols-4">
          {[
            { n: site.community.likes, l: "Community on Facebook" },
            { n: site.community.checkins, l: "Have trained here" },
            { n: site.community.recommend, l: "Would recommend" },
            { n: "2026", l: "Championship medal" },
          ].map((s) => (
            <div key={s.l} className="bg-surface px-6 py-10">
              <p className="font-display text-4xl font-semibold tracking-tight text-fg md:text-5xl">
                {s.n}
              </p>
              <p className="mt-2 text-sm text-muted">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="font-display text-4xl font-semibold uppercase tracking-tight">
            On the calendar
          </h2>
          <Link to="/events" className="text-sm text-muted no-underline hover:text-fg">
            All events
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {events.map((ev) => (
            <article
              key={ev.slug}
              className="overflow-hidden rounded-xl bg-surface shadow-[0_0_0_1px_rgb(238_234_227_/_10%)]"
            >
              <img src={ev.image} alt="" className="h-44 w-full object-cover" />
              <div className="p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-iron">{ev.kicker}</p>
                <h3 className="mt-2 font-display text-2xl font-semibold uppercase leading-tight tracking-tight">
                  {ev.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{ev.when}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20 md:px-8">
        <h2 className="font-display text-4xl font-semibold uppercase tracking-tight">
          From the floor
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {quotes.map((q) => (
            <blockquote
              key={q.name}
              className="rounded-xl bg-raised p-6 shadow-[0_0_0_1px_rgb(238_234_227_/_8%)]"
            >
              <p className="font-display text-3xl font-semibold uppercase leading-tight tracking-tight text-fg">
                {q.quote}
              </p>
              <footer className="mt-4 text-sm text-muted">{q.name}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="px-5 pb-24 md:px-8">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-xl">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {gallery.slice(0, 8).map((g) => (
              <img
                key={g.src}
                src={g.src}
                alt={g.alt}
                className="aspect-[4/5] h-full w-full object-cover"
              />
            ))}
          </div>
          <div className="flex items-center justify-between bg-surface px-5 py-4">
            <p className="text-sm text-muted">The floor, the coast, the work.</p>
            <Link to="/gallery" className="text-sm text-fg no-underline hover:text-iron">
              Open gallery
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-surface px-5 py-20 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-iron">Walk in</p>
            <h2 className="mt-3 font-display text-5xl font-semibold uppercase leading-[0.9] tracking-tight md:text-6xl">
              {site.addressLine}
            </h2>
            <p className="mt-4 text-muted">
              {site.city}, {site.country}. {site.hoursNote}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <a href={waJoin()}>WhatsApp</a>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link to="/contact">Map and hours</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
