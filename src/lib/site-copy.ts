/**
 * Built-in copy catalog — the single source of truth for editable section
 * text keys. The admin/AI content layer (MCP + admin UI) can override any of
 * these per key; public pages render the override when present and fall back
 * to the value here. Every key rendered by a page MUST be listed so the
 * discover/get tools can present a complete, token-cheap catalog.
 *
 * Hero headline and intro are NOT here: they are the managed scalar fields
 * `headline` / `intro` on SiteContent, edited in the admin form. Do not add
 * duplicate catalog keys for them.
 */
export const copyDefaults = {
  /* Home */
  "home.hero.kicker": "Strength. Community. Coast.",
  "home.about.title": "The house of iron",
  "home.about.body":
    "SMV is a local gym for strength, fitness and bodybuilding. Our coach and members are here to help you train safely and keep going.",
  "home.beach.title": "No walls on Wadduwa beach.",
  "home.beach.body":
    "Training beyond the gym floor. Simple, hard sessions on Wadduwa beach, with the south coast as the backdrop.",
  "home.community.likes": "3,360",
  "home.community.likesLabel": "Likes on Facebook",
  "home.community.checkins": "2,718",
  "home.community.checkinsLabel": "Facebook check-ins",
  "home.community.recommend": "100%",
  "home.community.recommendLabel": "Would recommend",
  "home.programs.title": "How we train",
  "home.events.title": "From the journal",
  "home.events.aside": "All news",
  "home.quotes.title": "In their words",
  "home.gallery.title": "On the floor",
  "home.gallery.aside": "Open gallery",
  "home.visit.title": "Walk in",
  "home.visit.address": "567/2/1, Galle Road",
  "home.visit.body": "Wadduwa, Sri Lanka. Open every day. Call us before you come.",
  "home.visit.whatsapp": "Start on WhatsApp",
  "home.visit.map": "Map and hours",

  /* Gallery */
  "gallery.hero.title": "Life on the floor.",
  "gallery.hero.body":
    "The weight. The work. The people. From the first set to the Wadduwa coast, a closer look at life inside SMV GYM.",
  "gallery.hero.cta": "Open a frame. Step inside.",

  /* Events — the News page shows the Facebook feed; managed events render on Home */
  "events.hero.title": "From the SMV page.",
  "events.hero.lede":
    "Updates gathered from our Facebook page and the gym floor — competitions, beach sessions and daily life in Wadduwa.",
  "events.join.title": "Join the next beach session or tournament.",
  "events.join.body":
    "New dates go up on Facebook first. Message us on WhatsApp or call the floor and we will save you a spot — on the sand or on the pitch.",

  /* Membership */
  "membership.hero.title": "Come and try the gym.",
  "membership.hero.lede":
    "Visit us, call us or send a WhatsApp message. We will explain the membership clearly.",
  "membership.ways.title": "Ways to start.",
  "membership.enquiry.title": "Tell us your fitness goal.",
  "membership.enquiry.body":
    "Fill in the form and we will build a WhatsApp message for you. You send it — we reply with the plan and the price.",
  "membership.visit.title": "Find us on Galle Road.",
} as const satisfies Record<string, string>;

export type CopyKey = keyof typeof copyDefaults;
