import { type ReactNode } from "react";

export function PageHero({
  kicker,
  title,
  lede,
  children,
}: {
  kicker: string;
  title: string;
  lede?: string;
  children?: ReactNode;
}) {
  return (
    <header className="mx-auto max-w-6xl px-5 pt-40 pb-12 md:px-8 md:pt-48 md:pb-16">
      <p className="text-xs uppercase tracking-[0.24em] text-iron">{kicker}</p>
      <h1 className="mt-3 font-display text-[clamp(3rem,8vw,6.5rem)] font-semibold uppercase leading-[0.88] tracking-tight text-fg">
        {title}
      </h1>
      {lede ? <p className="mt-6 max-w-xl text-lg text-muted">{lede}</p> : null}
      {children}
    </header>
  );
}
