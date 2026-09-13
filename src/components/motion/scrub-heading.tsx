import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ScrubHeading({ text }: { text: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      el.style.backgroundPosition = "0% 0";
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    const tween = gsap.fromTo(
      el,
      { backgroundPosition: "100% 0" },
      {
        backgroundPosition: "0% 0",
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          end: "top 28%",
          scrub: 0.6,
        },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <h2
      ref={ref}
      className="scrub-fill font-display text-[clamp(3.2rem,11vw,9.5rem)] font-semibold uppercase leading-[0.88] tracking-tight"
    >
      {text}
    </h2>
  );
}
