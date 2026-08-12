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
  ogImage: "/images/og.jpg",
  phone: "+1 (800) 555-0182",
  phoneHref: "tel:+18005550182",
  whatsapp: "18005550182",
  email: "hello@foreverjewelsinc.com",
  address: "21 Fifth Avenue, New York, NY 10010",
  hours: "Mon – Sat: 10:00 AM – 7:00 PM",
  founded: 2008,
} as const;

export const SOCIAL_LINKS = [
  { name: "Instagram", href: "https://instagram.com" },
  { name: "Facebook", href: "https://facebook.com" },
  { name: "Pinterest", href: "https://pinterest.com" },
  { name: "YouTube", href: "https://youtube.com" },
  { name: "X", href: "https://x.com" },
] as const;

export const CONTACT_ACTIONS = {
  whatsapp: `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    "Hello Forever Jewels, I'd like to know more about your collections."
  )}`,
  email: `mailto:${SITE.email}?subject=${encodeURIComponent("Enquiry from foreverjewels.com")}`,
  schedule: "/book-appointment",
  inquiry: "/contact",
} as const;
