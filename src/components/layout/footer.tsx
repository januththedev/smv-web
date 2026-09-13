import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { nav, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-12 md:px-8">
        <div className="md:col-span-5">
          <p className="font-display text-5xl font-semibold uppercase tracking-tight text-fg">
            SMV GYM
          </p>
          <p className="mt-2 text-sm uppercase tracking-[0.2em] text-iron">
            {site.sinhalaPlace} · {site.city}
          </p>
          <p className="mt-5 max-w-sm text-muted">{site.tagline}. On Galle Road, not in a brochure.</p>
        </div>
        <div className="md:col-span-3">
          <p className="text-xs uppercase tracking-[0.18em] text-subtle">Navigate</p>
          <ul className="mt-4 space-y-2">
            {nav.map((item) => (
              <li key={item.href}>
                <Link to={item.href} className="text-fg/90 no-underline hover:text-fg">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-4">
          <p className="text-xs uppercase tracking-[0.18em] text-subtle">Visit</p>
          <address className="mt-4 not-italic text-fg/90">
            {site.addressLine}
            <br />
            {site.city}, {site.country}
          </address>
          <p className="mt-4">
            <a className="text-fg no-underline hover:text-iron" href={`tel:${site.phoneTel}`}>
              {site.phone}
            </a>
            <br />
            <a className="text-fg no-underline hover:text-iron" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </p>
          <div className="mt-5 flex flex-wrap gap-4 text-sm">
            <a
              href={site.facebook}
              className="inline-flex items-center gap-1 text-muted no-underline hover:text-fg"
              rel="noreferrer"
              target="_blank"
            >
              Facebook <ArrowUpRight className="size-3.5" />
            </a>
            <a
              href={site.instagram}
              className="inline-flex items-center gap-1 text-muted no-underline hover:text-fg"
              rel="noreferrer"
              target="_blank"
            >
              Instagram <ArrowUpRight className="size-3.5" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-line px-5 py-5 text-xs text-subtle md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.fullName}. All rights reserved.</p>
          <p>{site.hoursNote}</p>
        </div>
      </div>
    </footer>
  );
}
