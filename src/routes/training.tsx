import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { site, waJoin } from "@/lib/site";

export const Route = createFileRoute("/training")({
  component: Training,
  head: () => ({
    meta: [
      { title: `Training — ${site.fullName}` },
      {
        name: "description",
        content:
          "Strength, bodybuilding, personal coaching with Saranga Lakmal, and beach training at SMV GYM Wadduwa.",
      },
    ],
  }),
});

const blocks = [
  {
    id: "strength",
    kicker: "Iron",
    title: "Strength floor",
    copy: "The work starts with a bar. Squats, pulls, presses — coached enough that you do not guess, quiet enough that you still have to do it. This is a gym that respects heavy days.",
    image: "/images/deadlift.jpg",
    alt: "Deadlift on the strength floor",
  },
  {
    id: "bodybuilding",
    kicker: "Physique",
    title: "Bodybuilding",
    copy: "Off-season volume and contest prep live here. In 2026 Pubudu Nimsara took 3rd in the 60kg Open at the Western Province Bodybuilding Championship. If you want a stage, the floor already knows the path.",
    image: "/images/physique.jpg",
    alt: "Bodybuilding physique training",
  },
  {
    id: "coaching",
    kicker: "Coach",
    title: "Personal coaching",
    copy: "Saranga Lakmal programs, watches the lift, and tells you the truth. Members keep calling it the best coaching on this stretch of Galle Road — because someone is actually in the room.",
    image: "/images/coach.jpg",
    alt: "Personal coaching on the gym floor",
  },
  {
    id: "beach",
    kicker: "Coast",
    title: "Beach training",
    copy: "Physical fitness sessions on Wadduwa beach. Conditioning that does not need air-con. Call or WhatsApp for the next outdoor date — same numbers the beach program posters already carry.",
    image: "/images/beach.jpg",
    alt: "Wadduwa beach used for outdoor training",
  },
];

function Training() {
  return (
    <main id="main">
      <PageHero
        kicker="Training"
        title="Choose your training."
        lede="Strength, physique, a coach who stays on the floor, and the Indian Ocean as a second gym. Pick a lane — or use all of them."
      />

      <div className="mx-auto max-w-6xl px-5 pb-24 md:px-8">
        <div className="flex flex-col gap-24">
          {blocks.map((b, i) => (
            <article
              id={b.id}
              key={b.id}
              className="grid scroll-mt-28 items-center gap-8 md:grid-cols-12"
            >
              <div className={i % 2 === 1 ? "md:col-span-6 md:col-start-7 md:row-start-1" : "md:col-span-6"}>
                <img
                  src={b.image}
                  alt={b.alt}
                  className="aspect-[4/5] w-full rounded-xl object-cover"
                />
              </div>
              <div className={i % 2 === 1 ? "md:col-span-5 md:row-start-1" : "md:col-span-5 md:col-start-8"}>
                <p className="text-xs uppercase tracking-[0.22em] text-iron">{b.kicker}</p>
                <h2 className="mt-3 font-display text-5xl font-semibold uppercase leading-[0.9] tracking-tight">
                  {b.title}
                </h2>
                <p className="mt-5 text-lg text-muted">{b.copy}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-24 flex flex-col items-start gap-4 rounded-xl bg-surface p-8 shadow-[0_0_0_1px_rgb(238_234_227_/_10%)] md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-3xl font-semibold uppercase tracking-tight">
              Come in and talk to us.
            </h2>
            <p className="mt-2 text-muted">Membership is quoted on the floor — not guessed on a page.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <a href={waJoin()}>WhatsApp</a>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/membership">Join SMV</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
