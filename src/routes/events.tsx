import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { events, site, waJoin } from "@/lib/site";

export const Route = createFileRoute("/events")({
  component: Events,
  head: () => ({
    meta: [
      { title: `Events — ${site.fullName}` },
      {
        name: "description",
        content:
          "SMV GYM Cricket Tournament 2026, Western Province bodybuilding, and beach training in Wadduwa.",
      },
    ],
  }),
});

function Events() {
  return (
    <main id="main">
      <PageHero
        kicker="News"
        title="SMV in motion."
        lede="Updates, competitions and community news from SMV GYM Wadduwa."
      />

      <div className="mx-auto max-w-6xl px-5 pb-24 md:px-8">
        <div className="flex flex-col gap-16">
          {events.map((ev, i) => (
            <article
              key={ev.slug}
              className="grid items-stretch gap-6 overflow-hidden md:grid-cols-12"
            >
              <div className={i % 2 ? "md:col-span-6 md:col-start-7 md:row-start-1" : "md:col-span-6"}>
                <img
                  src={ev.image}
                  alt=""
                  className="h-full min-h-72 w-full rounded-xl object-cover"
                />
              </div>
              <div
                className={
                  i % 2
                    ? "flex flex-col justify-center md:col-span-5 md:row-start-1"
                    : "flex flex-col justify-center md:col-span-5 md:col-start-8"
                }
              >
                <p className="text-xs uppercase tracking-[0.22em] text-iron">{ev.kicker}</p>
                <p className="mt-2 text-sm text-muted">{ev.when}</p>
                <h2 className="mt-3 font-display text-4xl font-semibold uppercase leading-[0.95] tracking-tight md:text-5xl">
                  {ev.title}
                </h2>
                <p className="mt-4 text-lg text-muted">{ev.copy}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 overflow-hidden rounded-xl bg-surface shadow-[0_0_0_1px_rgb(238_234_227_/_10%)]">
          <iframe
            title="SMV GYM Facebook news"
            src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FSarangalakmalFitness&tabs=timeline&width=900&height=760&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=false"
            className="h-[760px] w-full border-0"
            loading="lazy"
          />
        </div>

        <div className="mt-20 rounded-xl bg-surface p-8 shadow-[0_0_0_1px_rgb(238_234_227_/_10%)]">
          <h2 className="font-display text-3xl font-semibold uppercase tracking-tight">
            Want in on the next one?
          </h2>
          <p className="mt-3 max-w-xl text-muted">
            Dates are shared on Facebook first. Message us and we will add you to the list.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <a href={waJoin("Hi SMV — I want details on the next event.")}>WhatsApp</a>
            </Button>
            <Button asChild variant="ghost">
              <a href={site.facebook} target="_blank" rel="noreferrer">
                Facebook
              </a>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
