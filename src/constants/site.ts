export const SITE = {
  name: "Forever Jewels",
  shortName: "FJ",
  tagline: "Emotions, Crafted in Gold",
  description:
    "Forever Jewels crafts fine, certified diamond jewelry — engagement rings, wedding bands, and custom designs made to be treasured for generations.",
  url: "https://www.foreverjewelsinc.com",
  logo: "/images/logo.png",
  logoWidth: 266,
  logoHeight: 51,
  /** Default link-preview card (1200×630 JPEG) — regenerate with scripts/generate-brand-assets.mjs. */
  ogImage: "/images/og-forever-jewels.jpg",
  email: "abhi@foreverjewelsinc.com",
  /** Region only — the business deliberately publishes no street address or phone number. */
  address: "New Jersey, USA",
  state: "NJ",
  country: "USA",
  countryCode: "US",
  hours: "Mon – Sat: 10:00 AM – 7:00 PM",
  /** Machine-readable `hours` for structured data — keep the two in sync. */
  openingHours: {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "10:00",
    closes: "19:00",
  },
  founded: 2008,
} as const;

export const SOCIAL_LINKS = [
  { name: "Instagram", href: "https://www.instagram.com/foreverjewelsinc/" },
  { name: "Facebook", href: "https://www.facebook.com/foreverjewelsinc/" },
] as const;

export const CONTACT_ACTIONS = {
  email: `mailto:${SITE.email}?subject=${encodeURIComponent("Enquiry from foreverjewels.com")}`,
  schedule: "/book-appointment",
  inquiry: "/contact",
} as const;
