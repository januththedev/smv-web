import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { site, waJoin } from "@/lib/site";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: `About — ${site.fullName}` },
      {
        name: "description",
        content:
          "SMV GYM Wadduwa is Saranga Lakmal’s community gym on Galle Road — the best gym in the city, according to the people who train here.",
      },
    ],
  }),
});

function About() {
  return (
    <main id="main">
      <PageHero
        kicker="About"
        title={site.tagline}
        lede="A south-coast gym with a coach’s name on the door, a bodybuilding bench, and a cricket team. Not a chain. Not a hotel spa."
      />

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-20 md:grid-cols-12 md:px-8">
        <div className="md:col-span-6">
          <img
            src="/images/interior.jpg"
            alt="Inside SMV GYM Wadduwa"
            className="aspect-[4/5] w-full rounded-xl object-cover"
          />
        </div>
        <div className="md:col-span-5 md:col-start-8">
          <p className="text-xs uppercase tracking-[0.22em] text-iron">{site.coach}</p>
          <h2 className="mt-3 font-display text-5xl font-semibold uppercase leading-[0.9] tracking-tight">
            The floor has a name.
          </h2>
          <p className="mt-5 text-lg text-muted">
            Saranga Lakmal runs SMV from {site.addressLine}. The Facebook page still answers
            comments like a person, not a brand kit. That is the point.
          </p>
          <p className="mt-4 text-muted">
            Members call it the best gym in Wadduwa because someone watches the lift, someone
            posts the medal, and someone organises cricket when the season asks for it.
          </p>
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-3 md:px-8">
          {[
            {
              t: "Community first",
              d: `${site.community.checkins} check-ins. ${site.community.likes} on Facebook. People come back.`,
            },
            {
              t: "Compete",
              d: "Western Province bodybuilding, 2026 — a bronze from this floor. Training that has somewhere to go.",
            },
            {
              t: "Coast",
              d: "When the program is on, the gym moves to Wadduwa beach. Conditioning with a horizon.",
            },
          ].map((b) => (
            <div key={b.t}>
              <h3 className="font-display text-2xl font-semibold uppercase tracking-tight">{b.t}</h3>
              <p className="mt-3 text-muted">{b.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 md:grid-cols-12 md:px-8">
        <div className="md:col-span-5">
          <p className="text-xs uppercase tracking-[0.22em] text-iron">{site.sinhalaPlace}</p>
          <h2 className="mt-3 font-display text-5xl font-semibold uppercase leading-[0.9] tracking-tight">
            South of Colombo. On the road to Galle.
          </h2>
          <p className="mt-5 text-muted">
            Wadduwa is a coastal town, not a downtown mall. SMV sits on Galle Road so you can
            train before work, after the beach, or on the way home.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <a href={waJoin()}>Message Saranga</a>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/contact">Get directions</Link>
            </Button>
          </div>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <img
            src="/images/sri-lanka.jpg"
            alt="Sri Lankan south coast near Wadduwa"
            className="aspect-[4/3] w-full rounded-xl object-cover"
          />
        </div>
      </section>
    </main>
  );
}
