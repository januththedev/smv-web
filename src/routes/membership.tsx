import { useEffect, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { JoinForm } from "@/components/join-form";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { site, waJoin } from "@/lib/site";
import { useSiteCopy } from "@/lib/site-content";

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

const afterSubmit = [
  {
    step: "01",
    title: "Prepare your message",
    copy: "The form prepares a WhatsApp message and saves a copy of your details in this browser when storage is available. Nothing is sent to the gym.",
  },
  {
    step: "02",
    title: "Open WhatsApp",
    copy: "Choose Open WhatsApp on the next screen. Review the message, then send it to Saranga yourself. You stay in control of what you send.",
  },
  {
    step: "03",
    title: "We reply",
    copy: "Saranga answers on WhatsApp or by phone with the current membership price and the next step for your goal.",
  },
];

function Membership() {
  const copy = useSiteCopy();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ctx: ReturnType<typeof import("gsap").gsap.context> | undefined;
    let cancelled = false;
    void import("gsap").then(({ gsap }) => {
      if (cancelled || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      ctx = gsap.context(() => {
        gsap.from(".membership-row", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
        });
        gsap.from(".membership-reveal", {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.15,
        });
      }, mainRef);
    });
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <main id="main" ref={mainRef}>
      <PageHero
        kicker="Membership"
        title={copy("membership.hero.title")}
        lede={copy("membership.hero.lede")}
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

      {/* Ways to start — numbered ruled rows */}
      <section
        aria-labelledby="ways-heading"
        className="mx-auto max-w-6xl px-5 pb-24 md:px-8"
      >
        <div className="flex items-baseline justify-between gap-4 border-b border-line pb-4">
          <h2
            id="ways-heading"
            className="font-display text-[clamp(2.25rem,6vw,4.5rem)] font-semibold uppercase leading-[0.88] tracking-tight text-fg"
          >
            {copy("membership.ways.title")}
          </h2>
          <span
            aria-hidden="true"
            className="font-display text-3xl font-semibold text-iron md:text-5xl"
          >
            01–03
          </span>
        </div>

        <div>
          {paths.map((p, i) => (
            <article
              key={p.title}
              className="membership-row grid grid-cols-[auto_1fr] items-start gap-x-5 gap-y-3 border-b border-line py-7 md:grid-cols-[6rem_minmax(0,4fr)_minmax(0,6fr)] md:gap-x-10 md:py-9"
            >
              <span
                aria-hidden="true"
                className="font-display text-4xl font-semibold leading-none text-iron md:text-6xl"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="min-w-0 font-display text-2xl font-semibold uppercase leading-[0.95] tracking-tight text-fg md:pt-1 md:text-3xl">
                {p.title}
              </h3>
              <p className="col-span-2 max-w-prose text-[0.9375rem] leading-relaxed text-muted md:col-span-1 md:pt-1.5">
                {p.copy}
              </p>
            </article>
          ))}
        </div>

        <p className="mt-6 text-sm text-muted">{site.hoursNote}</p>
      </section>

      {/* Enquiry: honest explanation + form */}
      <section
        aria-labelledby="enquiry-heading"
        className="mx-auto max-w-6xl px-5 pb-24 md:px-8"
      >
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="text-xs uppercase tracking-[0.24em] text-iron">
              Enquire
            </p>
            <h2
              id="enquiry-heading"
              className="mt-3 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-semibold uppercase leading-[0.88] tracking-tight text-fg"
            >
              {copy("membership.enquiry.title")}
            </h2>
            <p className="mt-4 text-muted">
              {copy("membership.enquiry.body")}
            </p>

            <div className="mt-10 border-t border-line">
              <h3 className="sr-only">What happens after you submit</h3>
              {afterSubmit.map((s) => (
                <div
                  key={s.step}
                  className="membership-reveal grid grid-cols-[auto_1fr] gap-x-4 border-b border-line py-5"
                >
                  <span
                    aria-hidden="true"
                    className="font-display text-xl font-semibold leading-none text-iron"
                  >
                    {s.step}
                  </span>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-fg">
                      {s.title}
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">
                      {s.copy}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <ul className="mt-8 space-y-3 text-sm text-fg/85">
              <li>Coaching with {site.coach}.</li>
              <li>Weight gain, weight loss and bodybuilding coaching.</li>
              <li>A community that trains together.</li>
            </ul>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <JoinForm />
          </div>
        </div>
      </section>

      {/* Visit — inverted band */}
      <section
        aria-labelledby="visit-heading"
        className="bg-fg text-bg"
      >
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:items-center md:gap-14 md:px-8 md:py-24">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-iron">
              Visit SMV
            </p>
            <h2
              id="visit-heading"
              className="mt-3 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-semibold uppercase leading-[0.88] tracking-tight text-bg"
            >
              {copy("membership.visit.title")}
            </h2>
            <p className="mt-4 text-bg/70">{site.address}</p>
            <a
              className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold uppercase tracking-[0.18em] text-bg no-underline underline-offset-4 hover:text-iron"
              href={site.mapsUrl}
              target="_blank"
              rel="noreferrer"
            >
              Open directions →
            </a>
          </div>
          <iframe
            title="Map of SMV GYM Wadduwa"
            src={site.mapsEmbed}
            className="h-80 w-full rounded-xs border-0 shadow-[0_0_0_1px_rgb(9_9_11_/_20%)] md:h-96"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </main>
  );
}
