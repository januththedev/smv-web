import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { site, waJoin } from "@/lib/site";

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
        <div className="rounded-xl bg-surface p-8 shadow-[0_0_0_1px_rgb(238_234_227_/_10%)]">
          <h2 className="font-display text-3xl font-semibold uppercase tracking-tight">Latest from SMV</h2>
          <p className="mt-3 max-w-xl text-muted">See the latest posts, announcements and photos directly on our Facebook page.</p>
          <a className="mt-6 inline-flex rounded-full bg-fg px-5 py-3 text-sm text-bg no-underline hover:bg-iron hover:text-fg" href={site.facebook} target="_blank" rel="noreferrer">
            Open SMV on Facebook
          </a>
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
