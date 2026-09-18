import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { site, waJoin } from "@/lib/site";
import { useSiteContent, useSiteCopy, defaultSiteContent } from "@/lib/site-content";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const content = useSiteContent();
  const copy = useSiteCopy();

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll("[data-hero]"),
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.09, ease: "power3.out" },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="editorial-hero" aria-labelledby="hero-title" data-admin-section="hero">
      <div className="hero-edition" data-hero>
        <span>{copy("home.hero.kicker")}</span>
        <span>{site.city} · {site.country}</span>
      </div>

      <div className="hero-composition">
        <div className="hero-story">
          <p className="hero-eyebrow" data-hero>
            <span className="hero-status-dot" aria-hidden="true" />
            SMV GYM / Galle Road
          </p>
          <h1 id="hero-title" className="hero-title" data-hero>
            {content.headline === defaultSiteContent.headline ? (
              <>TRAIN<br /><span>STRONG.</span><br />FEEL GOOD.</>
            ) : content.headline}
          </h1>
          <div className="hero-intro" data-hero>
            <span className="hero-index" aria-hidden="true">01 /</span>
            <p>{content.intro}</p>
          </div>
          <div className="hero-actions" data-hero>
            <Button asChild size="lg" className="hero-primary">
              <a href={waJoin()}>
                Start on WhatsApp <ArrowUpRight aria-hidden="true" className="size-5" />
              </a>
            </Button>
            <a className="hero-call" href={`tel:${site.phoneTel}`}>
              Call the gym <ArrowUpRight aria-hidden="true" className="size-4" />
            </a>
          </div>
        </div>

        <figure className="hero-photo" data-hero>
          <img
            src="/images/hero-floor.jpg"
            alt="Training on the gym floor"
            fetchPriority="high"
            className="hero-photo-image"
          />
          <div className="hero-photo-shade" aria-hidden="true" />
          <img className="hero-seal" src={content.logoUrl} alt="SMV GYM Wadduwa" />
          <figcaption className="hero-photo-caption">
            <span>THE WORK<br />STARTS HERE.</span>
            <span>SMV GYM<br />WADDUWA, LK</span>
          </figcaption>
        </figure>
      </div>

      <div className="hero-bottom" data-hero>
        <p>Bodybuilding <span aria-hidden="true">/</span> Personal coaching <span aria-hidden="true">/</span> Beach training</p>
        <Link to="/membership">
          Find your starting point <ArrowDown aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </section>
  );
}
