export const site = {
  name: "SMV GYM",
  shortName: "SMV",
  fullName: "SMV GYM Wadduwa",
  tagline: "Train strong. Feel good.",
  city: "Wadduwa",
  country: "Sri Lanka",
  sinhalaPlace: "Wadduwa",
  address: "567/2/1, Galle Road, Wadduwa, Sri Lanka",
  addressLine: "567/2/1, Galle Road",
  phone: "+94 71 273 8110",
  phoneTel: "+94712738110",
  phoneAlt: "+94 77 144 6003",
  phoneAltTel: "+94771446003",
  email: "sarangalak@gmail.com",
  whatsapp: "https://wa.me/94712738110",
  mapsUrl: "https://maps.google.com/?cid=1919696542040790709",
  mapsEmbed:
    "https://maps.google.com/maps?cid=1919696542040790709&z=17&output=embed",
  facebook: "https://www.facebook.com/SarangalakmalFitness",
  facebookEmbed:
    "https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FSarangalakmalFitness&tabs=timeline&width=500&height=720&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true",
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
  { href: "/membership", label: "Join" },
  { href: "/gallery", label: "Gallery" },
  { href: "/events", label: "News" },
] as const;

export const programs = [
  {
    slug: "weight-gain",
    title: "Weight gain",
    kicker: "Build",
    copy: "Structured training and practical guidance to help you add quality size and strength.",
    image: "/images/deadlift.jpg",
  },
  {
    slug: "weight-loss",
    title: "Weight loss",
    kicker: "Move",
    copy: "Consistent training, conditioning and accountability for a stronger, healthier you.",
    image: "/images/woman-train.jpg",
  },
  {
    slug: "bodybuilding",
    title: "Bodybuilding",
    kicker: "Physique",
    copy: "Stage prep and off-season volume with coaching that keeps every session purposeful.",
    image: "/images/physique.jpg",
  },
  {
    slug: "beach-training",
    title: "Beach training",
    kicker: "Coast",
    copy: "Train on Wadduwa beach. Simple, hard sessions by the sea.",
    image: "/images/beach.jpg",
  },
] as const;

export const gallery = [
  { src: "/images/gym-2026-09-01.jpg", alt: "Seated shoulder and lateral-raise machine on the SMV gym floor", tag: "Floor" },
  { src: "/images/gym-2026-09-02.jpg", alt: "Wide view of the training floor with benches and machines", tag: "Floor" },
  { src: "/images/gym-2026-09-03.jpg", alt: "Treadmill row with screens for cardio sessions", tag: "Conditioning" },
  { src: "/images/gym-2026-09-04.jpg", alt: "Heavy bag in front of the SMV Wadduwa backdrop", tag: "Conditioning" },
  { src: "/images/gym-2026-09-05.jpg", alt: "Training floor with plate-loaded machines and benches", tag: "Floor" },
  { src: "/images/gym-2026-09-06.jpg", alt: "Seated row station on the machine floor", tag: "Floor" },
  { src: "/images/gym-2026-09-07.jpg", alt: "Benches and free-weight corner of the gym", tag: "Floor" },
  { src: "/images/gym-2026-09-08.jpg", alt: "Leg press machine loaded for leg day", tag: "Strength" },
  { src: "/images/gym-2026-09-09.jpg", alt: "Chest fly machine with weight stack", tag: "Floor" },
  { src: "/images/gym-2026-09-10.jpg", alt: "Posterior-chain bench for glute and hamstring work", tag: "Strength" },
  { src: "/images/gym-2026-09-11.jpg", alt: "Plate-loaded lever machines along the strength wall", tag: "Strength" },
  { src: "/images/gym-2026-09-12.jpg", alt: "Plate-loaded row stations ready for training", tag: "Strength" },
  { src: "/images/gym-2026-09-13.jpg", alt: "Workout bench beside the treadmill row", tag: "Floor" },
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
