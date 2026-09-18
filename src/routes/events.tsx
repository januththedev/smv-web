import { useEffect, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Phone } from "lucide-react";
import gsap from "gsap";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { getNews } from "@/lib/get-news";
import { fallbackNews, type NewsPost } from "@/lib/news";
import { site, waJoin } from "@/lib/site";
import { useSiteContent, useSiteCopy } from "@/lib/site-content";

export const Route = createFileRoute("/events")({
  loader: async () => {
    try {
      return await getNews();
    } catch {
      return { posts: fallbackNews, live: false, source: "gym" as const };
    }
  },
  component: Events,
  head: () => ({
    meta: [
      { title: `News — ${site.fullName}` },
      {
        name: "description",
        content:
          "News from SMV GYM Wadduwa — cricket, bodybuilding, beach training and Facebook updates.",
      },
    ],
  }),
});

/** The strongest story leads: the championship podium result, when present. */
function isLeadStory(post: NewsPost) {
  const hay = `${post.title} ${post.body}`.toLowerCase();
  return hay.includes("bodybuild") || hay.includes("championship") || hay.includes("podium");
}

function orderLead(posts: NewsPost[]) {
  if (posts.length < 2) return posts;
  const leadIndex = posts.findIndex(isLeadStory);
  if (leadIndex <= 0) return posts;
  return [posts[leadIndex], ...posts.slice(0, leadIndex), ...posts.slice(leadIndex + 1)];
}

function Events() {
  const { events } = useSiteContent();
  const copy = useSiteCopy();
  const root = useRef<HTMLDivElement>(null);
  const payload = Route.useLoaderData();
  const posts = payload.posts.length ? payload.posts : fallbackNews;
  const [lead, ...rest] = orderLead(posts);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll("[data-reveal]"),
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.09, ease: "power3.out" },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <main id="main" ref={root}>
      <PageHero
        kicker="News & Community"
        title={copy("events.hero.title")}
        lede={copy("events.hero.lede")}
      />

      <div className="mx-auto max-w-6xl px-5 pb-24 md:px-8">
        {/* Managed announcements are independent of the Facebook/news loader. */}
        <section aria-labelledby="managed-events-heading" className="mb-16 md:mb-24">
          <h2 id="managed-events-heading" className="font-display text-3xl font-semibold uppercase tracking-tight md:text-4xl">
            {copy("events.managed.title")}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{copy("events.managed.body")}</p>
          <div className="mt-8 divide-y divide-line border-y border-line">
            {events.map((event, index) => (
              <article key={`${event.slug}-${index}`} className="grid gap-5 py-7 md:grid-cols-12 md:gap-8">
                <img src={event.image} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover md:col-span-3" />
                <div className="md:col-span-9">
                  <p className="text-xs uppercase tracking-[0.2em] text-iron">
                    {[event.kicker, event.when].filter(Boolean).join(" · ")}
                  </p>
                  <h3 className="mt-2 font-display text-3xl font-semibold uppercase tracking-tight md:text-4xl">{event.title}</h3>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{event.copy}</p>
                </div>
              </article>
            ))}
            {!events.length && <p className="py-7 text-sm text-muted">No gym updates at the moment.</p>}
          </div>
        </section>

        {/* Provenance note — hedged, no implied live feed or strict chronology. */}
        <div
          data-reveal
          className="flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-line py-3 text-[0.6875rem] uppercase tracking-[0.22em] text-muted"
        >
          <span>
            {payload.live
              ? "Sourced from our Facebook page"
              : "Latest notes from the gym"}
          </span>
          <span>Photos from the gym archive — illustrative, not always from the event</span>
        </div>

        {lead ? <LeadStory post={lead} /> : null}

        {rest.length ? (
          <section aria-labelledby="journal-heading" className="mt-16 md:mt-24">
            <div className="flex items-baseline justify-between gap-4">
              <h2
                id="journal-heading"
                data-reveal
                className="font-display text-2xl font-semibold uppercase tracking-tight text-fg md:text-3xl"
              >
                The journal
              </h2>
              <p data-reveal className="text-[0.6875rem] uppercase tracking-[0.22em] text-muted">
                More from the page
              </p>
            </div>

            <ol className="mt-8 border-t border-line">
              {rest.map((post, index) => (
                <li key={post.id} data-reveal className="border-b border-line">
                  <JournalRow post={post} index={index + 2} />
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        <JoinNext />
      </div>
    </main>
  );
}

function LeadStory({ post }: { post: NewsPost }) {
  return (
    <article className="mt-10 md:mt-16" aria-labelledby="lead-story-title">
      <p
        data-reveal
        className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.6875rem] uppercase tracking-[0.24em] text-iron"
      >
        <span aria-hidden="true">01 /</span>
        <span>Lead story</span>
        <span aria-hidden="true" className="h-px w-10 bg-iron/60" />
        <span className="text-muted">{post.when}</span>
      </p>

      <h2
        id="lead-story-title"
        data-reveal
        className="mt-4 font-display text-[clamp(2.6rem,9vw,6.5rem)] font-semibold uppercase leading-[0.88] tracking-tight text-fg"
      >
        {post.title}
      </h2>

      <figure data-reveal className="mt-8 overflow-hidden rounded-xs shadow-border md:mt-10">
        <img
          src={post.image}
          alt={post.image === "/images/physique.jpg"
            ? "Gym archive photograph of bodybuilding training"
            : "Gym archive photograph accompanying this story"}
          className="aspect-[16/10] w-full object-cover md:aspect-[21/9]"
          loading="lazy"
        />
      </figure>

      <div className="mt-8 grid gap-8 md:mt-10 md:grid-cols-12">
        <p data-reveal className="text-lg leading-relaxed text-fg/85 md:col-span-7 md:text-xl">
          {post.body}
        </p>
        <div data-reveal className="md:col-span-5 md:pl-6 md:border-l md:border-line">
          <p className="text-sm leading-relaxed text-muted">
            Every story here starts on the floor, the pitch or the sand. Full photos and details
            live on our Facebook page.
          </p>
          <a
            href={post.href}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm uppercase tracking-[0.18em] text-fg no-underline transition-colors hover:text-iron"
          >
            View on Facebook <ArrowUpRight aria-hidden="true" className="size-4" />
          </a>
        </div>
      </div>
    </article>
  );
}

function JournalRow({ post, index }: { post: NewsPost; index: number }) {
  return (
    <article className="group grid grid-cols-[auto_1fr] items-start gap-x-5 gap-y-4 py-6 md:grid-cols-[auto_9rem_1fr_auto] md:items-center md:gap-x-8 md:py-8">
      <p
        aria-hidden="true"
        className="pt-0.5 font-display text-xl leading-none tracking-[0.08em] text-iron md:text-2xl"
      >
        {String(index).padStart(2, "0")}
      </p>

      <figure className="hidden overflow-hidden rounded-xs shadow-border md:block">
        <img
          src={post.image}
          alt=""
          className="aspect-[4/3] w-36 object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          loading="lazy"
        />
      </figure>

      <div className="col-start-2 md:col-start-3">
        <p className="text-[0.6875rem] uppercase tracking-[0.22em] text-muted">{post.when}</p>
        <h3 className="mt-1.5 font-display text-3xl font-semibold uppercase leading-[0.92] tracking-tight text-fg md:text-4xl">
          {post.title}
        </h3>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          {post.body.length > 140 ? `${post.body.slice(0, 140).trimEnd()}…` : post.body}
        </p>
      </div>

      <div className="col-start-2 md:col-start-4">
        <a
          href={post.href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center gap-1.5 text-[0.8125rem] uppercase tracking-[0.18em] text-fg no-underline transition-colors hover:text-iron"
        >
          Facebook <ArrowUpRight aria-hidden="true" className="size-3.5" />
        </a>
      </div>
    </article>
  );
}

function JoinNext() {
  const copy = useSiteCopy();
  return (
    <section
      aria-labelledby="join-next-heading"
      data-reveal
      className="mt-20 border-y border-line py-10 md:mt-28 md:py-14"
    >
      <p className="text-[0.6875rem] uppercase tracking-[0.24em] text-iron">Next up</p>
      <h2
        id="join-next-heading"
        className="mt-3 max-w-3xl font-display text-[clamp(2.2rem,6.5vw,4.5rem)] font-semibold uppercase leading-[0.88] tracking-tight text-fg"
      >
        {copy("events.join.title")}
      </h2>
      <p className="mt-5 max-w-xl text-muted">
        {copy("events.join.body")}
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button asChild size="lg" className="min-h-11">
          <a
            href={waJoin("Hi SMV — I want to join the next beach training session or tournament.")}
          >
            WhatsApp the gym <ArrowUpRight aria-hidden="true" className="size-4" />
          </a>
        </Button>
        <a
          href={`tel:${site.phoneTel}`}
          className="inline-flex min-h-11 items-center gap-2 text-[0.8125rem] uppercase tracking-[0.18em] text-fg no-underline transition-colors hover:text-iron"
        >
          <Phone aria-hidden="true" className="size-4" />
          Call {site.phone}
        </a>
      </div>
    </section>
  );
}
