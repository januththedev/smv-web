import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { site, waJoin } from "@/lib/site";
import { useSiteContent } from "@/lib/site-content";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const content = useSiteContent();

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = el.querySelectorAll("[data-hero]");
    if (reduce) {
      gsap.set(items, { opacity: 1, y: 0, filter: "none" });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { opacity: 0, y: 22, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.08,
        },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative min-h-[100dvh] overflow-hidden">
      <div className="absolute inset-0">
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero-floor.jpg"
          aria-hidden="true"
        >
          <source src="/videos/floor.mp4" type="video/mp4" />
        </video>
        <div className="hero-mask absolute inset-0" />
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(720px 480px at 72% 38%, rgb(196 92 50 / 28%), transparent 60%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-6xl flex-col justify-end px-5 pb-16 pt-32 md:px-8 md:pb-20">
        <img
          data-hero
          src={content.logoUrl}
          alt="SMV GYM Wadduwa"
          className="mb-5 h-16 w-16 object-contain outline-none md:h-20 md:w-20"
        />
        <p data-hero className="text-xs uppercase tracking-[0.28em] text-fg/70">
          Galle Road · Wadduwa · Sri Lanka
        </p>
        <h1
          data-hero
          className="mt-4 font-display text-[clamp(4.4rem,16vw,12rem)] font-semibold uppercase leading-[0.8] tracking-tight text-fg"
        >
          SMV
          <br />
          GYM
        </h1>
        <p data-hero className="mt-6 max-w-md text-lg text-fg/80 md:text-xl">
          {content.headline} {content.intro}
        </p>
        <div data-hero className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <a href={waJoin()}>Start on WhatsApp</a>
          </Button>
          <Button asChild variant="ghost" size="lg">
            <a href={`tel:${site.phoneTel}`}>Call us</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
