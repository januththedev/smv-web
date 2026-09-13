export const site = {
  name: "SMV GYM",
  shortName: "SMV",
  fullName: "SMV GYM Wadduwa",
  tagline: "Train strong. Feel good.",
  city: "Wadduwa",
  country: "Sri Lanka",
  sinhalaPlace: "වාද්දුව",
  address: "567/2/1, Galle Road, Wadduwa, Sri Lanka",
  addressLine: "567/2/1, Galle Road",
  phone: "+94 71 273 8110",
  phoneTel: "+94712738110",
  phoneAlt: "+94 77 144 6003",
  phoneAltTel: "+94771446003",
  email: "sarangalak@gmail.com",
  whatsapp: "https://wa.me/94712738110",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=567%2F2%2F1+Galle+Road+Wadduwa+Sri+Lanka",
  mapsEmbed:
    "https://maps.google.com/maps?q=567%2F2%2F1%20Galle%20Road%20Wadduwa%20Sri%20Lanka&t=&z=16&ie=UTF8&iwloc=&output=embed",
  facebook: "https://www.facebook.com/SarangalakmalFitness",
  instagram: "https://www.instagram.com/smv_gym_wadduwa/",
  instagramAlt: "https://www.instagram.com/smv.gym.wadduwa/",
  instagramHandle: "@smv_gym_wadduwa",
  coach: "Saranga Lakmal",
  hoursNote: "Open every day. Call us before you come.",
  community: {
    likes: "3,360",
    checkins: "2,718",
    recommend: "100%",
  },
  description:
    "SMV GYM Wadduwa is a community strength gym on Galle Road — bodybuilding, personal coaching, and beach training on the south coast of Sri Lanka.",
} as const;

export const nav = [
  { href: "/", label: "Home" },
  { href: "/training", label: "Training" },
  { href: "/membership", label: "Join" },
  { href: "/gallery", label: "Floor" },
  { href: "/events", label: "Events" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Visit" },
] as const;

export const programs = [
  {
    slug: "strength",
    title: "Strength floor",
    kicker: "Iron",
    copy: "Free weights, racks, and honest work. Build the base that every other goal sits on.",
    image: "/images/deadlift.jpg",
    href: "/training",
    hash: "strength",
  },
  {
    slug: "bodybuilding",
    title: "Bodybuilding",
    kicker: "Physique",
    copy: "Stage prep and off-season volume. Members compete — including a 2026 Western Province medal.",
    image: "/images/physique.jpg",
    href: "/training",
    hash: "bodybuilding",
  },
  {
    slug: "coaching",
    title: "Personal coaching",
    kicker: "Coach",
    copy: "Work with Saranga Lakmal. Programming, form, and accountability — not a poster on the wall.",
    image: "/images/coach.jpg",
    href: "/training",
    hash: "coaching",
  },
  {
    slug: "beach",
    title: "Beach training",
    kicker: "Coast",
    copy: "Physical fitness sessions on Wadduwa beach. Sun, sand, and conditioning that does not live indoors.",
    image: "/images/beach.jpg",
    href: "/training",
    hash: "beach",
  },
] as const;

export const gallery = [
  { src: "/images/hero-floor.jpg", alt: "Athletes training on the SMV gym floor", tag: "Floor" },
  { src: "/images/deadlift.jpg", alt: "Heavy deadlift on the strength floor", tag: "Strength" },
  { src: "/images/barbell.jpg", alt: "Loaded barbell plates", tag: "Strength" },
  { src: "/images/interior.jpg", alt: "Gym interior with machines and free weights", tag: "Floor" },
  { src: "/images/dumbbell.jpg", alt: "Dumbbell press", tag: "Strength" },
  { src: "/images/woman-train.jpg", alt: "Member during a training session", tag: "Conditioning" },
  { src: "/images/battle-rope.jpg", alt: "Battle rope conditioning", tag: "Conditioning" },
  { src: "/images/dark-gym.jpg", alt: "Dark training hall", tag: "Floor" },
  { src: "/images/boxing.jpg", alt: "Boxing and striking work", tag: "Conditioning" },
  { src: "/images/beach.jpg", alt: "Wadduwa coastline used for beach training", tag: "Coast" },
  { src: "/images/cable.jpg", alt: "Cable machine work", tag: "Floor" },
  { src: "/images/group.jpg", alt: "Group training energy", tag: "Community" },
  { src: "/images/physique.jpg", alt: "Bodybuilding physique work", tag: "Strength" },
  { src: "/images/machines.jpg", alt: "Machine row and isolation work", tag: "Floor" },
  { src: "/images/kettlebell.jpg", alt: "Kettlebell training", tag: "Conditioning" },
  { src: "/images/squat.jpg", alt: "Squat session", tag: "Strength" },
  { src: "/images/woman-weights.jpg", alt: "Strength training with weights", tag: "Strength" },
  { src: "/images/sri-lanka.jpg", alt: "South coast of Sri Lanka", tag: "Coast" },
  { src: "/images/coast.jpg", alt: "Coastal water near Wadduwa", tag: "Coast" },
  { src: "/images/cricket.jpg", alt: "Community cricket", tag: "Community" },
  { src: "/images/coach.jpg", alt: "Coaching on the floor", tag: "Community" },
  { src: "/images/swim-train.jpg", alt: "Outdoor conditioning", tag: "Coast" },
] as const;

export const events = [
  {
    slug: "cricket-2026",
    kicker: "Community",
    title: "SMV GYM Cricket Tournament 2026",
    copy: "The floor steps onto the pitch. A members-and-friends tournament that is as much about the set as it is about the scoreboard.",
    image: "/images/cricket.jpg",
    when: "2026",
  },
  {
    slug: "bodybuilding-2026",
    kicker: "Podium",
    title: "Western Province Bodybuilding Championship",
    copy: "National Sports Festival 2026 — 60kg Open. Pubudu Nimsara took 3rd for SMV GYM Wadduwa. This is a gym that puts people on a stage.",
    image: "/images/physique.jpg",
    when: "2026 · 60kg Open · 3rd",
  },
  {
    slug: "beach-program",
    kicker: "Coast",
    title: "Physical Fitness Beach Training",
    copy: "Conditioning on Wadduwa beach — the south-coast session that does not need four walls. Call the floor to join the next one.",
    image: "/images/beach.jpg",
    when: "Seasonal · Wadduwa beach",
  },
] as const;

export const quotes = [
  {
    quote: "The best gym ever.",
    name: "Sashika Dissanayake",
  },
  {
    quote: "Best coach.",
    name: "Sudeepa Alwis",
  },
  {
    quote: "Best gym.",
    name: "Malithi Silva",
  },
  {
    quote: "SMV GYM Wadduwa — best gym.",
    name: "Nisal Chamara De Silva",
  },
] as const;

export const goals = [
  "Build muscle",
  "Lose fat",
  "Get stronger",
  "Bodybuilding prep",
  "General fitness",
  "Beach / conditioning",
] as const;

export function waJoin(text?: string) {
  const msg =
    text ??
    "Hi SMV GYM Wadduwa — I want to join. Please tell me the next step.";
  return `${site.whatsapp}?text=${encodeURIComponent(msg)}`;
}
