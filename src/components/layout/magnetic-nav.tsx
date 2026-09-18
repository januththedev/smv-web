import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, MessageCircle } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { nav, site, waJoin } from "@/lib/site";
import { useSiteContent } from "@/lib/site-content";
import { cn } from "@/lib/utils";

function readScrollY() {
  const lenis = window.__lenis;
  if (lenis && typeof lenis.scroll === "number") return lenis.scroll;
  return window.scrollY;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function MagneticNav() {
  const content = useSiteContent();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
    window.__lenis?.scrollTo(0, { immediate: true });
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setCompact(readScrollY() > 16 && !open);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("smv-scroll", onScroll);

    let attached = false;
    const bindLenis = () => {
      if (attached || !window.__lenis) return;
      window.__lenis.on("scroll", onScroll);
      attached = true;
      onScroll();
    };
    bindLenis();
    const poll = window.setInterval(bindLenis, 200);
    const stop = window.setTimeout(() => window.clearInterval(poll), 3000);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("smv-scroll", onScroll);
      window.clearInterval(poll);
      window.clearTimeout(stop);
      window.__lenis?.off("scroll", onScroll);
    };
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) window.__lenis?.stop();
    else window.__lenis?.start();
    return () => {
      document.body.style.overflow = "";
      window.__lenis?.start();
    };
  }, [open]);

  // Do not steal focus on mount; restore it only after an open dialog closes.
  useEffect(() => {
    if (!open) return;
    const panel = menuPanelRef.current;
    const trigger = menuTriggerRef.current;
    const focusFrame = window.requestAnimationFrame(() => panel?.focus());
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    const containFocus = (event: FocusEvent) => {
      if (event.target instanceof Node && !panel?.contains(event.target)) {
        panel?.focus();
      }
    };
    desktop.addEventListener("change", onDesktop);
    document.addEventListener("focusin", containFocus);
    onDesktop();
    return () => {
      window.cancelAnimationFrame(focusFrame);
      desktop.removeEventListener("change", onDesktop);
      document.removeEventListener("focusin", containFocus);
      // The trigger is hidden after crossing the desktop breakpoint.
      if (trigger?.getClientRects().length) trigger.focus({ preventScroll: true });
    };
  }, [open]);

  // Escape closes; Tab is trapped inside the dialog while it is open.
  const onMenuKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const panel = menuPanelRef.current;
      if (!panel) return;
      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const current = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (current === first || current === panel || !panel.contains(current)) {
          e.preventDefault();
          last.focus();
        }
      } else if (current === last || !panel.contains(current)) {
        e.preventDefault();
        first.focus();
      }
    },
    [],
  );

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
          "fixed inset-x-0 top-0 z-50 flex justify-center transition-[padding] duration-300 ease-out motion-reduce:transition-none",
          compact ? "px-3 pt-1.5 md:px-6 md:pt-2" : "px-3 pt-3 md:px-5 md:pt-4",
        )}
      >
        <nav
          aria-label="Primary"
          className={cn(
            "glass-dock flex w-full items-center justify-between gap-2 rounded-full px-1.5 pl-2.5",
            compact ? "is-compact max-w-5xl py-0.5" : "max-w-6xl py-1.5",
          )}
        >
          <Link
            to="/"
            className="flex items-center gap-2 py-1 pr-2 no-underline"
            aria-label={`${site.fullName} home`}
          >
            <img
              src={content.logoUrl}
              alt="SMV GYM"
              className={cn(
                "object-contain outline-none transition-[width,height] duration-300 ease-out",
                compact ? "size-6" : "size-8",
              )}
            />
            <span
              className={cn(
                "hidden text-[0.65rem] uppercase tracking-[0.22em] text-muted sm:inline",
                compact && "lg:inline sm:hidden",
              )}
            >
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
              ref={menuTriggerRef}
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-full text-fg lg:hidden"
              aria-expanded={open}
              aria-haspopup="dialog"
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
        ref={menuPanelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        tabIndex={-1}
        onKeyDown={onMenuKeyDown}
        onClick={(e) => {
          // Clicking the backdrop (not the panel content) closes the menu.
          if (e.target === e.currentTarget) setOpen(false);
        }}
        hidden={!open}
        className={cn(
          "fixed inset-0 z-[60] overflow-y-auto bg-bg/80 px-6 pb-8 pt-24 backdrop-blur-xl lg:hidden",
          open ? "block" : "hidden",
        )}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="glass-dock absolute right-6 top-6 inline-flex size-11 items-center justify-center rounded-full text-fg"
          aria-label="Close menu"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
        <ul className="flex flex-col gap-1">
          {nav.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className="block min-h-11 py-3 font-display text-4xl font-semibold uppercase tracking-tight text-fg no-underline"
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
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
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const resetMotion = () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      if (ref.current) ref.current.style.transform = "";
    };
    media.addEventListener("change", resetMotion);
    return () => {
      media.removeEventListener("change", resetMotion);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  function onMove(e: MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const { clientX, clientY } = e;
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    // One style write per frame.
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const node = ref.current;
      if (!node) return;
      const r = node.getBoundingClientRect();
      // Small magnet radius: pull at most a few pixels toward the cursor.
      const x = clientX - (r.left + r.width / 2);
      const y = clientY - (r.top + r.height / 2);
      const maxShift = 5;
      const tx = Math.max(-maxShift, Math.min(maxShift, x * 0.14));
      const ty = Math.max(-maxShift, Math.min(maxShift, y * 0.16));
      node.style.transform = `translate(${tx}px, ${ty}px)`;
    });
  }

  function onLeave() {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.style.transform = "";
      return;
    }
    el.style.transform = "translate(0, 0)";
  }

  return (
    <Link
      ref={ref}
      to={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex items-center rounded-full text-[0.8rem] tracking-wide no-underline transition-[color,background-color,transform,padding,height] duration-300 ease-out",
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
