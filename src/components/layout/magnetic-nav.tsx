import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, MessageCircle } from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { nav, site, waJoin } from "@/lib/site";
import { useSiteContent } from "@/lib/site-content";
import { cn } from "@/lib/utils";

export function MagneticNav() {
  const content = useSiteContent();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
    window.__lenis?.scrollTo(0, { immediate: true });
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 32 && !open);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-bg"
      >
        Skip to content
      </a>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 flex justify-center transition-[padding] duration-300 ease-out",
          compact ? "px-5 pt-2 md:px-8" : "px-3 pt-3 md:px-4 md:pt-4",
        )}
      >
        <nav
          aria-label="Primary"
          className={cn(
            "glass-dock flex w-full items-center justify-between gap-2 rounded-full px-2 pl-3 transition-[max-width,padding] duration-300 ease-out",
            compact ? "max-w-5xl py-0.5" : "max-w-6xl py-1",
          )}
        >
          <Link
            to="/"
            className="flex items-baseline gap-2 py-1.5 pr-2 no-underline"
            aria-label={`${site.fullName} home`}
          >
            <img src={content.logoUrl} alt="SMV GYM" className={cn("object-contain outline-none transition-[width,height] duration-300", compact ? "size-6" : "size-7")} />
            <span className="hidden text-[0.65rem] uppercase tracking-[0.22em] text-muted sm:inline">
              Wadduwa
            </span>
          </Link>

          <ul className="hidden items-center gap-0.5 lg:flex">
            {nav.map((item) => (
              <li key={item.href}>
                <MagneticLink
                  href={item.href}
                  active={
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href)
                  }
                  compact={compact}
                >
                  {item.label}
                </MagneticLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1">
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <a href={waJoin()}>
                <MessageCircle className="size-3.5" />
                Join
              </a>
            </Button>
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-full text-fg lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            </button>
          </div>
        </nav>
      </header>

      <div
        id="mobile-nav"
        hidden={!open}
        className={cn(
          "fixed inset-0 z-40 bg-bg/95 px-6 pt-32 backdrop-blur-xl lg:hidden",
          open ? "block" : "hidden",
        )}
      >
        <ul className="flex flex-col gap-1">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                onClick={() => setOpen(false)}
                className="block py-3 font-display text-4xl font-semibold uppercase tracking-tight text-fg no-underline"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col gap-3">
          <Button asChild size="lg">
            <a href={waJoin()}>WhatsApp us</a>
          </Button>
          <Button asChild variant="ghost" size="lg">
            <a href={`tel:${site.phoneTel}`}>{site.phone}</a>
          </Button>
        </div>
      </div>
    </>
  );
}

function MagneticLink({
  href,
  active,
  compact,
  children,
}: {
  href: string;
  active: boolean;
  compact: boolean;
  children: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  function onMove(e: MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * 0.28}px, ${y * 0.32}px)`;
  }

  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0, 0)";
  }

  return (
    <Link
      ref={ref}
      to={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn(
        "inline-flex items-center rounded-full text-[0.8rem] tracking-wide no-underline transition-[color,background-color,transform,padding,height] duration-300 ease-out will-change-transform",
        compact ? "h-8 px-3" : "h-10 px-3.5",
        active
          ? "bg-fg/10 text-fg shadow-[0_1px_0_rgb(255_255_255_/_10%)_inset]"
          : "text-muted hover:text-fg",
      )}
    >
      {children}
    </Link>
  );
}
