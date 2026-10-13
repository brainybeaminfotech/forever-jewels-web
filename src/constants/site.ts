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
  phone: "+1 917 302 9312",
  phoneHref: "tel:+19173029312",
  whatsapp: "19173029312",
  email: "social@foreverjewelsinc.com",
  address: "2 Tower Center Blvd, 10th Fl, East Brunswick, NJ 08816 USA",
  /** Same address split for multi-line display (contact page, structured data). */
  addressLines: ["2 Tower Center Blvd, 10th Fl", "East Brunswick, NJ 08816 USA"],
  city: "East Brunswick",
  state: "NJ",
  postalCode: "08816",
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
  whatsapp: `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    "Hello Forever Jewels, I'd like to know more about your collections."
  )}`,
  email: `mailto:${SITE.email}?subject=${encodeURIComponent("Enquiry from foreverjewels.com")}`,
  schedule: "/book-appointment",
  inquiry: "/contact",
} as const;
