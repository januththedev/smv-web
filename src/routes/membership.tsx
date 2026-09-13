import { createFileRoute } from "@tanstack/react-router";
import { JoinForm } from "@/components/join-form";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { site, waJoin } from "@/lib/site";

export const Route = createFileRoute("/membership")({
  component: Membership,
  head: () => ({
    meta: [
      { title: `Join — ${site.fullName}` },
      {
        name: "description",
        content:
          "Join SMV GYM Wadduwa. Walk in on Galle Road or WhatsApp Saranga Lakmal for membership.",
      },
    ],
  }),
});

const paths = [
  {
    title: "Walk-in day",
    copy: "See the floor, meet the coach, lift. We will tell you if this is the right gym before you pay for a month.",
  },
  {
    title: "Monthly & longer",
    copy: "Quoted in person. Rates change with how you train — open floor, coaching, or contest prep — so we do not post a fake menu.",
  },
  {
    title: "Coaching add-on",
    copy: "Personal sessions with Saranga. Programming, form, and the uncomfortable honesty that actually moves a physique.",
  },
];

function Membership() {
  return (
    <main id="main">
      <PageHero
        kicker="Membership"
        title="Come lift. Then decide."
        lede="No brochure prices. SMV is a neighbourhood gym — you join by walking in, calling, or sending a WhatsApp."
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <a href={waJoin()}>WhatsApp to join</a>
          </Button>
          <Button asChild variant="ghost" size="lg">
            <a href={`tel:${site.phoneTel}`}>{site.phone}</a>
          </Button>
        </div>
      </PageHero>

      <section className="mx-auto grid max-w-6xl gap-4 px-5 pb-16 md:grid-cols-3 md:px-8">
        {paths.map((p) => (
          <article
            key={p.title}
            className="rounded-xl bg-surface p-6 shadow-[0_0_0_1px_rgb(238_234_227_/_10%)]"
          >
            <h2 className="font-display text-2xl font-semibold uppercase tracking-tight">
              {p.title}
            </h2>
            <p className="mt-3 text-muted">{p.copy}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-5 pb-24 md:grid-cols-12 md:px-8">
        <div className="md:col-span-5">
          <p className="text-xs uppercase tracking-[0.22em] text-iron">Enquire</p>
          <h2 className="mt-3 font-display text-5xl font-semibold uppercase leading-[0.9] tracking-tight">
            Tell us what you want from the floor.
          </h2>
          <p className="mt-4 text-muted">
            We will come back on WhatsApp or a call. Bring a goal. Leave with a plan.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-fg/85">
            <li>Open floor, seven days — confirm hours when you call.</li>
            <li>Coaching with {site.coach}.</li>
            <li>Beach sessions when the program is running.</li>
            <li>A community that actually competes.</li>
          </ul>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <JoinForm />
        </div>
      </section>
    </main>
  );
}
