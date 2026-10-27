import type { Metadata } from "next";
import { SITE, SOCIAL_LINKS } from "@/constants/site";
import type { Product, ProductAvailability } from "@/types";

export interface ShareImage {
  /** Path (resolved against `metadataBase`) or absolute URL — must be a JPEG/PNG, not WebP. */
  url: string;
  width: number;
  height: number;
  alt: string;
  type?: string;
}

/** Branded 1200×630 card for any page without an image of its own. */
export const DEFAULT_SHARE_IMAGE: ShareImage = {
  url: SITE.ogImage,
  width: 1200,
  height: 630,
  type: "image/jpeg",
  alt: `${SITE.name} — ${SITE.tagline}`,
};

/** Size of the per-page cards rendered by `lib/share-image.ts`. */
export const SHARE_CARD_SIZE = { width: 1200, height: 630 } as const;

const DESCRIPTION_LIMIT = 160;

/** Search results and chat previews truncate around 155–160 characters — cut on a word instead. */
export function toMetaDescription(text: string): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= DESCRIPTION_LIMIT) return clean;
  const cut = clean.slice(0, DESCRIPTION_LIMIT - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,;:.–—-]+$/, "")}…`;
}

export function absoluteUrl(path: string): string {
  return new URL(path, SITE.url).toString();
}

interface PageMetadataOptions {
  /** Page title; the root layout's template appends " | Forever Jewels". */
  title: string;
  description: string;
  /** Canonical path (no host). Also used as og:url. */
  path: string;
  image?: ShareImage;
  type?: "website" | "article";
}

/**
 * Complete metadata for a public page. Next merges `openGraph`/`twitter` *shallowly* — a page
 * that sets any of `openGraph` replaces the root's whole object, and a page that sets none
 * inherits the home page's title and description into its link preview. So every public page
 * goes through here and gets the full set: canonical URL, og:* and twitter:* in one place.
 */
export function pageMetadata({ title, description, path, image = DEFAULT_SHARE_IMAGE, type = "website" }: PageMetadataOptions): Metadata {
  const fullTitle = `${title} | ${SITE.name}`;
  const summary = toMetaDescription(description);

  return {
    title,
    description: summary,
    alternates: { canonical: path },
    openGraph: {
      type,
      locale: "en_US",
      siteName: SITE.name,
      url: path,
      title: fullTitle,
      description: summary,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: summary,
      images: [{ url: image.url, alt: image.alt }],
    },
  };
}

/* ------------------------------------------------------------------ */
/* Structured data (schema.org JSON-LD) — render with <JsonLd />        */
/* ------------------------------------------------------------------ */

const PUBLISHER = {
  "@type": "Organization",
  name: SITE.name,
  url: SITE.url,
  logo: { "@type": "ImageObject", url: absoluteUrl("/icons/icon-512.png"), width: 512, height: 512 },
};

/** The business itself — a `JewelryStore` is a LocalBusiness, so this also feeds the local/maps panel. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    url: SITE.url,
    // Google requires a logo of at least 112×112 — the 51 px-tall wordmark is too small.
    logo: absoluteUrl("/icons/icon-512.png"),
    image: absoluteUrl(SITE.ogImage),
    description: SITE.description,
    slogan: SITE.tagline,
    email: SITE.email,
    foundingDate: String(SITE.founded),
    address: {
      "@type": "PostalAddress",
      addressRegion: SITE.state,
      addressCountry: SITE.countryCode,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [...SITE.openingHours.days],
        opens: SITE.openingHours.opens,
        closes: SITE.openingHours.closes,
      },
    ],
    sameAs: SOCIAL_LINKS.map((social) => social.href),
  };
}

/** Tells Google the site's name, so results show "Forever Jewels" rather than the bare domain. */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    name: SITE.name,
    url: SITE.url,
    inLanguage: "en-US",
    publisher: PUBLISHER,
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

const AVAILABILITY: Record<ProductAvailability, string> = {
  "in-stock": "https://schema.org/InStock",
  "made-to-order": "https://schema.org/MadeToOrder",
  "out-of-stock": "https://schema.org/OutOfStock",
};

/**
 * Product + Offer for the PDP (price, currency, availability → Google shopping/product
 * snippets). No `aggregateRating`: Google requires ratings in markup to be visible on the
 * page, and the API carries no real reviews to show.
 */
export function productJsonLd(product: Product, path: string) {
  const images = (product.images?.length ? product.images : [product.image]).filter(Boolean).slice(0, 6);
  const description = product.description ?? product.longDescription?.join(" ");

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: description ? toMetaDescription(description) : undefined,
    image: images.map((image) => absoluteUrl(image)),
    sku: product.sku,
    category: product.category,
    material: product.metal,
    brand: { "@type": "Brand", name: SITE.name },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(path),
      price: product.price.toFixed(2),
      priceCurrency: product.currency,
      availability: AVAILABILITY[product.availability ?? "in-stock"],
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: SITE.name },
    },
  };
}

export function articleJsonLd({ title, description, path, image }: { title: string; description: string; path: string; image: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: toMetaDescription(description),
    image: [absoluteUrl(image)],
    mainEntityOfPage: absoluteUrl(path),
    inLanguage: "en-US",
    author: { "@type": "Organization", name: SITE.name, url: SITE.url },
    publisher: PUBLISHER,
  };
}
