import { useEffect, useRef, type ReactNode, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
};

export function SpotlightCard({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const tilt = useRef(false);

  useEffect(() => {
    tilt.current =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || !tilt.current) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const px = (x / r.width) * 2 - 1;
    const py = (y / r.height) * 2 - 1;
    el.style.setProperty("--spot-x", `${x}px`);
    el.style.setProperty("--spot-y", `${y}px`);
    el.style.transform = `perspective(1000px) rotateY(${px * 5}deg) rotateX(${-py * 5}deg)`;
  }

  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "none";
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn(
        "relative overflow-hidden rounded-xl bg-surface shadow-[0_0_0_1px_rgb(238_234_227_/_10%)] transition-transform duration-150 ease-out",
        className,
      )}
    >
      <div className="spotlight-glow pointer-events-none absolute inset-0 z-10 mix-blend-screen" />
      {children}
    </div>
  );
}
