import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, Phone } from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { nav, site, waJoin } from "@/lib/site";
import { cn } from "@/lib/utils";

export function MagneticNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    setOpen(false);
    window.__lenis?.scrollTo(0, { immediate: true });
  }, [pathname]);

  useEffect(() => {
    const onScroll = (e: Event) => {
      const direction = (e as CustomEvent).detail?.direction ?? 0;
      const y = window.scrollY;
      if (y < 24) {
        setHidden(false);
        lastY.current = y;
        return;
      }
      if (open) {
        setHidden(false);
        return;
      }
      setHidden(direction === 1 && y > lastY.current + 8);
      lastY.current = y;
    };
    const onWin = () => {
      const y = window.scrollY;
      if (y < 24) setHidden(false);
      else if (!open) setHidden(y > lastY.current);
      lastY.current = y;
    };
    window.addEventListener("smv-scroll", onScroll);
    window.addEventListener("scroll", onWin, { passive: true });
    return () => {
      window.removeEventListener("smv-scroll", onScroll);
      window.removeEventListener("scroll", onWin);
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
          "fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] md:px-4 md:pt-4",
          hidden && !open ? "-translate-y-[120%]" : "translate-y-0",
        )}
      >
        <nav
          aria-label="Primary"
          className="glass-dock flex w-full max-w-5xl items-center justify-between gap-2 rounded-full px-2 py-0.5 pl-3"
        >
          <Link
            to="/"
            className="flex items-baseline gap-2 py-2 pr-2 no-underline"
            aria-label={`${site.fullName} home`}
          >
            <img src="/images/smv-logo.png" alt="SMV GYM" className="size-8 object-contain outline-none" />
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
                >
                  {item.label}
                </MagneticLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1">
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <a href={`tel:${site.phoneTel}`}>
                <Phone className="size-3.5" />
                Call
              </a>
            </Button>
            <Button asChild size="sm" className="hidden sm:inline-flex pr-3.5">
              <a href={waJoin()}>Join</a>
            </Button>
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-full text-fg lg:hidden"
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
            <a href={waJoin()}>WhatsApp the floor</a>
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
  children,
}: {
  href: string;
  active: boolean;
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
        "inline-flex h-10 items-center rounded-full px-3.5 text-[0.8rem] tracking-wide no-underline transition-[color,background-color,transform] duration-150 ease-out will-change-transform",
        active ? "bg-fg/8 text-fg" : "text-muted hover:text-fg",
      )}
    >
      {children}
    </Link>
  );
}
