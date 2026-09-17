import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { nav, site } from "@/lib/site";
import { useSiteContent } from "@/lib/site-content";

export function Footer() {
  const content = useSiteContent();
  const linkClass = "inline-flex min-h-11 items-center gap-2 py-2 text-fg no-underline hover:underline underline-offset-4";
  const labelClass = "text-xs uppercase tracking-[0.2em] text-muted";

  return (
    <footer className="border-t border-line bg-bg text-fg">
      <div className="mx-auto max-w-6xl px-5 pb-12 pt-12 md:px-8 md:pt-16">
        <div className="flex items-center justify-between gap-6 border-b border-line pb-6">
          <p className={labelClass}>{site.city} · {site.country}</p>
          <img
            src={content.logoUrl}
            alt={`${site.fullName} emblem`}
            className="size-12 shrink-0 object-contain outline-none"
          />
        </div>
        <p className="py-8 font-display text-7xl font-semibold uppercase leading-none tracking-tight sm:text-9xl lg:text-[11rem]">
          {site.name}<span className="text-iron" aria-hidden="true">.</span>
        </p>
        <div className="grid gap-10 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.7fr_1.1fr] lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <p className={labelClass}>Galle Road · {site.city}</p>
            <p className="mt-5 max-w-sm font-display text-3xl font-medium uppercase leading-tight">
              {site.tagline}
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
              A friendly gym on Galle Road.
            </p>
            <a href={site.whatsapp} className={`${linkClass} mt-5 border-b border-line text-sm`}>
              WhatsApp us <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </div>
          <nav aria-label="Footer">
            <p className={labelClass}>Navigate</p>
            <ul className="mt-4">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link to={item.href} className={`${linkClass} text-base`}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="mt-3">
                <Link to="/admin" className="inline-flex min-h-11 items-center py-2 text-xs text-muted no-underline hover:text-fg hover:underline underline-offset-4">
                  Admin
                </Link>
              </li>
            </ul>
          </nav>
          <div className="min-w-0">
            <p className={labelClass}>Visit / Contact</p>
            <address className="mt-4 text-sm leading-relaxed not-italic">
              <a href={site.mapsUrl} target="_blank" rel="noreferrer" className={linkClass}>
                <span>{site.addressLine}<br />{site.city}, {site.country}</span>
                <ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
              </a>
              <div className="mt-3 flex flex-col items-start">
                <a className={linkClass} href={`tel:${site.phoneTel}`}>{site.phone}</a>
                <a className={`${linkClass} break-all`} href={`mailto:${site.email}`}>{site.email}</a>
              </div>
            </address>
            <div className="mt-5 flex flex-wrap gap-x-6 border-t border-line pt-3 text-sm">
              <a href={site.facebook} className={linkClass} rel="noreferrer" target="_blank">
                Facebook <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </a>
              <a href={site.instagram} className={linkClass} rel="noreferrer" target="_blank">
                Instagram <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-line px-5 py-6 text-xs leading-relaxed text-muted md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:justify-between sm:gap-8">
          <p>© {new Date().getFullYear()} {site.fullName}. All rights reserved.</p>
          <p>{site.hoursNote}</p>
          <a
            href="https://januth.dev"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 no-underline underline-offset-4 hover:text-fg hover:underline"
          >
            Januth made this <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
