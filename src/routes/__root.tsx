import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { Footer } from "@/components/layout/footer";
import { MagneticNav } from "@/components/layout/magnetic-nav";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { site } from "@/lib/site";
import appCss from "../styles.css?url";

const APP_NAME = site.fullName;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content: site.description,
      },
      { name: "theme-color", content: "#09090b" },
      { name: "author", content: site.coach },
      { name: "robots", content: "index,follow" },
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/images/smv-logo.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/images/smv-logo.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@500;600;700;800&family=Manrope:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  component: RootDocument,
});

function RootDocument() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HealthClub",
    name: site.fullName,
    description: site.description,
    url: "https://smvgym.lk",
    telephone: site.phone,
    email: site.email,
    image: "/images/hero-floor.jpg",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.addressLine,
      addressLocality: site.city,
      addressCountry: "LK",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 6.6667,
      longitude: 79.9333,
    },
    sameAs: [site.facebook, site.instagram],
  };

  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-bg text-fg">
        <PreviewHostBridge />
        <AuthProvider>
          <SmoothScroll>
            <div className="grain" aria-hidden="true" />
            <ScrollProgress />
            <MagneticNav />
            <Outlet />
            <Footer />
          </SmoothScroll>
        </AuthProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Scripts />
      </body>
    </html>
  );
}
