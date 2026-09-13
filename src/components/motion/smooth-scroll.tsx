import { useEffect, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const hash = useRouterState({ select: (s) => s.location.hash });
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.registerPlugin(ScrollTrigger);

    if (reduce) {
      ScrollTrigger.normalizeScroll(false);
      return;
    }

    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.09,
      smoothWheel: true,
    });
    window.__lenis = lenis;

    lenis.on("scroll", (e) => {
      ScrollTrigger.update();
      window.dispatchEvent(
        new CustomEvent("smv-scroll", {
          detail: { velocity: e.velocity, direction: e.direction },
        }),
      );
    });

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      gsap.ticker.remove(tick);
      lenis.destroy();
      window.__lenis = undefined;
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  useEffect(() => {
    const id = hash.replace(/^#/, "");
    if (!id) return;
    const go = () => {
      const el = document.getElementById(id);
      if (!el) return;
      if (window.__lenis) window.__lenis.scrollTo(el, { offset: -96 });
      else el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    const t = window.setTimeout(go, 80);
    return () => window.clearTimeout(t);
  }, [hash, pathname]);

  return children;
}
