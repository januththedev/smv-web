import { createFileRoute } from "@tanstack/react-router";
import { JoinForm } from "@/components/join-form";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { site, waJoin } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: `Visit — ${site.fullName}` },
      {
        name: "description",
        content: `Visit SMV GYM at ${site.address}. Call ${site.phone} or WhatsApp the floor.`,
      },
    ],
  }),
});

function Contact() {
  return (
    <main id="main">
      <PageHero
        kicker="Visit"
        title="Galle Road, Wadduwa."
        lede={site.hoursNote}
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <a href={waJoin()}>WhatsApp</a>
          </Button>
          <Button asChild variant="ghost" size="lg">
            <a href={site.mapsUrl} target="_blank" rel="noreferrer">
              Open maps
            </a>
          </Button>
        </div>
      </PageHero>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 pb-16 md:grid-cols-12 md:px-8">
        <div className="md:col-span-5">
          <dl className="space-y-6">
            <div>
              <dt className="text-xs uppercase tracking-[0.18em] text-subtle">Address</dt>
              <dd className="mt-1 text-lg text-fg">{site.address}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.18em] text-subtle">Phone</dt>
              <dd className="mt-1">
                <a className="text-lg text-fg no-underline hover:text-iron" href={`tel:${site.phoneTel}`}>
                  {site.phone}
                </a>
                <br />
                <a className="text-lg text-fg no-underline hover:text-iron" href={`tel:${site.phoneAltTel}`}>
                  {site.phoneAlt}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.18em] text-subtle">Email</dt>
              <dd className="mt-1">
                <a className="text-lg text-fg no-underline hover:text-iron" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.18em] text-subtle">Social</dt>
              <dd className="mt-1 flex flex-col gap-1">
                <a
                  className="text-fg no-underline hover:text-iron"
                  href={site.facebook}
                  target="_blank"
                  rel="noreferrer"
                >
                  Facebook — SMV GYM Wadduwa
                </a>
                <a
                  className="text-fg no-underline hover:text-iron"
                  href={site.instagram}
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram {site.instagramHandle}
                </a>
              </dd>
            </div>
          </dl>
        </div>
        <div className="overflow-hidden rounded-xl md:col-span-7">
          <iframe
            title="Map of SMV GYM Wadduwa"
            src={site.mapsEmbed}
            className="h-[22rem] w-full border-0 md:h-full md:min-h-[22rem]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24 md:px-8">
        <div className="grid gap-10 rounded-xl bg-surface p-6 shadow-[0_0_0_1px_rgb(238_234_227_/_10%)] md:grid-cols-12 md:p-10">
          <div className="md:col-span-5">
            <h2 className="font-display text-4xl font-semibold uppercase tracking-tight">
              Write to the floor
            </h2>
            <p className="mt-3 text-muted">
              Faster on WhatsApp. This form keeps a note on your device and sends you through to chat.
            </p>
          </div>
          <div className="md:col-span-7">
            <JoinForm />
          </div>
        </div>
      </section>
    </main>
  );
}
