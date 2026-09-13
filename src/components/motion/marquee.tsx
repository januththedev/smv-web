import { useEffect, useRef } from "react";
import { site } from "@/lib/site";

const ITEMS = [
  site.tagline,
  "Strength",
  "Bodybuilding",
  "Beach training",
  site.sinhalaPlace,
  "Personal coaching",
  "South coast",
  "Galle Road",
];

export function VelocityMarquee() {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let raf = 0;
    const onScroll = (e: Event) => {
      const v = (e as CustomEvent).detail?.velocity ?? 0;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const skew = Math.max(-12, Math.min(12, v * 1.4));
        const duration = Math.max(10, 28 - Math.abs(v) * 3);
        el.style.setProperty("--marquee-skew", `${skew}deg`);
        el.style.setProperty("--marquee-duration", `${duration}s`);
      });
    };
    window.addEventListener("smv-scroll", onScroll);
    return () => {
      window.removeEventListener("smv-scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={wrap}
      className="relative overflow-hidden border-y border-line bg-surface py-4"
      aria-hidden="true"
    >
      <div className="marquee-track gap-10 text-fg">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center gap-10 pr-10">
            {ITEMS.map((item) => (
              <span
                key={`${copy}-${item}`}
                className="font-display text-4xl font-semibold uppercase tracking-[0.08em] text-fg/90 md:text-5xl"
              >
                {item}
                <span className="ml-10 inline-block text-iron">/</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
