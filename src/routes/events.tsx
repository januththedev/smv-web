import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { site, waJoin } from "@/lib/site";

type NewsPost = {
  id: string;
  message?: string;
  created_time?: string;
  permalink_url?: string;
  full_picture?: string;
};

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
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [configured, setConfigured] = useState(true);

  useEffect(() => {
    fetch("/api/facebook-news")
      .then((response) => response.json())
      .then((data: { configured?: boolean; posts?: NewsPost[] }) => {
        setConfigured(data.configured !== false);
        setPosts(data.posts ?? []);
      })
      .catch(() => setConfigured(false));
  }, []);

  return (
    <main id="main">
      <PageHero
        kicker="News"
        title="SMV in motion."
        lede="Updates, competitions and community news from SMV GYM Wadduwa."
      />

      <div className="mx-auto max-w-6xl px-5 pb-24 md:px-8">
        {posts.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {posts.map((post) => (
              <article key={post.id} className="overflow-hidden rounded-xl bg-surface shadow-[0_0_0_1px_rgb(238_234_227_/_10%)]">
                {post.full_picture ? <img src={post.full_picture} alt="" className="aspect-[16/9] w-full object-cover" /> : null}
                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.18em] text-iron">
                    {post.created_time ? new Date(post.created_time).toLocaleDateString() : "SMV News"}
                  </p>
                  <p className="mt-4 whitespace-pre-wrap text-muted">{post.message ?? "SMV GYM update"}</p>
                  {post.permalink_url ? <a className="mt-5 inline-flex text-sm text-fg no-underline hover:text-iron" href={post.permalink_url} target="_blank" rel="noreferrer">View post</a> : null}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-surface p-8 shadow-[0_0_0_1px_rgb(238_234_227_/_10%)]">
            <h2 className="font-display text-3xl font-semibold uppercase tracking-tight">Latest from SMV</h2>
            <p className="mt-3 max-w-xl text-muted">
              {configured ? "Loading the latest updates from Facebook..." : "Connect the Facebook Page access token to show the latest 10 posts here."}
            </p>
          </div>
        )}

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
