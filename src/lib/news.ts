import { site } from "@/lib/site";

export type NewsPost = {
  id: string;
  title: string;
  body: string;
  when: string;
  image: string;
  href: string;
};

export const fallbackNews: NewsPost[] = [
  {
    id: "cricket-2026",
    title: "SMV GYM Cricket Tournament 2026",
    body: "The gym hits the pitch. A cricket day for members and friends — come play or come cheer.",
    when: "September 2026",
    image: "/images/cricket.jpg",
    href: site.facebook,
  },
  {
    id: "bodybuilding-2026",
    title: "Western Province Bodybuilding Championship",
    body: "National Sports Festival 2026. 60kg Open. Pubudu Nimsara took 3rd for SMV GYM Wadduwa.",
    when: "September 2026",
    image: "/images/physique.jpg",
    href: site.facebook,
  },
  {
    id: "beach-program",
    title: "Physical Fitness Beach Training",
    body: "Conditioning on Wadduwa beach. Call us to join the next session.",
    when: "Seasonal · Wadduwa beach",
    image: "/images/beach.jpg",
    href: site.facebook,
  },
  {
    id: "floor-sessions",
    title: "Training on the SMV floor",
    body: "Strength, bodybuilding and coaching with Saranga Lakmal. Walk in on Galle Road.",
    when: "Open every day",
    image: "/images/hero-floor.jpg",
    href: site.facebook,
  },
];

export type NewsPayload = {
  posts: NewsPost[];
  live: boolean;
  source: "facebook" | "gym";
};
