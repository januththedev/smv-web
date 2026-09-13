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
    copy: "See the gym, meet the coach and try a session. We will help you decide before you pay for a month.",
  },
  {
    title: "Monthly & longer",
    copy: "Membership depends on how you want to train. Ask us for the current price when you visit or message us.",
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
        title="Come and try the gym."
        lede="Visit us, call us or send a WhatsApp message. We will explain the membership clearly."
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
            Tell us your fitness goal.
          </h2>
          <p className="mt-4 text-muted">
            Tell us your goal. We will reply on WhatsApp or by phone and help you choose the right plan.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-fg/85">
            <li>Open every day — confirm the hours when you call.</li>
            <li>Coaching with {site.coach}.</li>
            <li>Weight gain, weight loss and bodybuilding coaching.</li>
            <li>A community that trains together.</li>
          </ul>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <JoinForm />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24 md:px-8">
        <div className="overflow-hidden rounded-xl bg-surface shadow-[0_0_0_1px_rgb(238_234_227_/_10%)]">
          <div className="grid gap-8 p-6 md:grid-cols-[0.8fr_1.2fr] md:p-10">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-iron">Visit SMV</p>
              <h2 className="mt-3 font-display text-5xl font-semibold uppercase leading-[0.9] tracking-tight">
                Find us on Galle Road.
              </h2>
              <p className="mt-4 text-muted">{site.address}</p>
              <a className="mt-6 inline-flex text-sm text-fg no-underline hover:text-iron" href={site.mapsUrl} target="_blank" rel="noreferrer">
                Open directions
              </a>
            </div>
            <iframe
              title="Map of SMV GYM Wadduwa"
              src={site.mapsEmbed}
              className="h-80 w-full border-0 md:h-96"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
