/**
 * Maps the API's product payload onto this site's `Product` type.
 *
 * Shared by the product-list and featured-product bindings — both endpoints return the
 * same product object — so the mapping lives in exactly one place.
 */

import http from "@framework/utils/http";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import type { ApiCompanyInfoData, ApiEnvelope, ApiProduct } from "@framework/types";
import type { GoldPurity, JewelleryCategorySlug, Product } from "@/types";

/* ------------------------------------------------------------------ */
/* image base URL                                                      */
/* ------------------------------------------------------------------ */

/**
 * `image_path` values are relative and must be resolved against the base URL the API
 * itself reports (`web_setting.image_base_url`) — the same source tcctechweb reads it
 * from. NEXT_PUBLIC_IMG_URL is only a fallback for when that call fails; hardcoding a
 * CDN host does not work, since each company's assets live in a different bucket.
 */
let imageBaseUrlCache: string | undefined;

export async function getImageBaseUrl(): Promise<string> {
  if (imageBaseUrlCache !== undefined) return imageBaseUrlCache;

  const envFallback = (process.env.NEXT_PUBLIC_IMG_URL ?? "").trim().replace(/\/+$/, "");
  try {
    const res = await http.get<ApiEnvelope<ApiCompanyInfoData>>(API_ENDPOINTS.COMPANY_INFORMATION, {
      // Company settings change rarely — cache for an hour.
      revalidate: 3600,
    });
    const fromApi = res?.data?.web_setting?.image_base_url?.trim().replace(/\/+$/, "");
    imageBaseUrlCache = fromApi || envFallback;
  } catch {
    imageBaseUrlCache = envFallback;
  }
  return imageBaseUrlCache;
}

/* ------------------------------------------------------------------ */
/* category mapping                                                    */
/* ------------------------------------------------------------------ */

/**
 * This site's category slugs → the API's `product_category` filter value.
 * These are NOT all simple plurals ("rings" → "ring", "pendants" → "pendant"), and a
 * wrong value silently returns zero products rather than an error, so keep them in sync
 * with `user/filter/list/category`.
 */
export const CATEGORY_API_SLUG: Record<JewelleryCategorySlug, string> = {
  rings: "ring",
  earrings: "earring",
  necklaces: "necklaces",
  bracelets: "bracelets",
  pendants: "pendant",
};

export const CATEGORY_LABEL: Record<JewelleryCategorySlug, string> = {
  rings: "Rings",
  earrings: "Earrings",
  necklaces: "Necklaces",
  bracelets: "Bracelets",
  pendants: "Pendants",
};

/**
 * API `category_name` → this site's slug. Takes lower-cased names because the list
 * endpoint returns "ring" while the detail endpoint returns "Ring".
 */
export function resolveCategoryFromNames(names: string[]): JewelleryCategorySlug | undefined {
  for (const [slug, apiSlug] of Object.entries(CATEGORY_API_SLUG) as [JewelleryCategorySlug, string][]) {
    if (names.includes(apiSlug)) return slug;
  }
  // Fall back to a keyword match so an unmapped sub-category still lands somewhere sensible.
  const joined = names.join(" ");
  if (/earring/.test(joined)) return "earrings";
  if (/pendant/.test(joined)) return "pendants";
  if (/necklace/.test(joined)) return "necklaces";
  if (/bracelet|bangle/.test(joined)) return "bracelets";
  if (/ring|band/.test(joined)) return "rings";
  return undefined;
}

function resolveCategory(apiProduct: ApiProduct): JewelleryCategorySlug | undefined {
  return resolveCategoryFromNames((apiProduct.product_categories ?? []).map((c) => (c.category_name ?? "").toLowerCase()));
}

/* ------------------------------------------------------------------ */
/* images                                                              */
/* ------------------------------------------------------------------ */

const IMAGE_TYPE_STILL = 1;
const IMAGE_TYPE_VIDEO = 4;

/**
 * Photos come back unordered, named `<sku>-<tone>-<n>.webp` plus a `-model` shot.
 * Sort by that trailing number so the packshot (`-1`) is the card's primary image and
 * the model shot sorts last, rather than whichever row the DB happened to return first.
 */
function imageSortKey(path: string): number {
  const match = /-(\d+)\.[a-z0-9]+$/i.exec(path);
  if (match?.[1]) return Number(match[1]);
  return Number.MAX_SAFE_INTEGER;
}

export const TONE_LABEL: Record<string, string> = {
  YG: "Yellow Gold",
  WG: "White Gold",
  RG: "Rose Gold",
};

/* ------------------------------------------------------------------ */
/* mapping                                                             */
/* ------------------------------------------------------------------ */

/**
 * Returns null for records that can't render as a card — no price or no photo.
 * Skipping is deliberate: a card with a missing image or "$0" looks broken.
 */
export function normaliseProduct(apiProduct: ApiProduct, imageBaseUrl: string, currency: string): Product | null {
  const price = apiProduct.retail_price;
  if (!apiProduct.name || price === null || price === undefined || price <= 0) return null;

  const allImages = apiProduct.product_images ?? [];
  const stills = allImages
    .filter((img) => img.image_type === IMAGE_TYPE_STILL && img.image_path)
    .sort((a, b) => imageSortKey(a.image_path) - imageSortKey(b.image_path));

  const toUrl = (path: string) => `${imageBaseUrl}/${path.replace(/^\/+/, "")}`;
  const images = stills.map((img) => toUrl(img.image_path));
  const primaryImage = images[0];
  if (!primaryImage) return null;

  const jewelleryCategory = resolveCategory(apiProduct);
  const karat = apiProduct.pmo?.find((m) => m.gold_karat)?.gold_karat ?? null;
  const tone = stills[0]?.metal_tone_short_code ?? null;

  const product: Product = {
    id: String(apiProduct.id),
    slug: apiProduct.slug,
    name: apiProduct.name,
    category: jewelleryCategory ? CATEGORY_LABEL[jewelleryCategory] : "Jewellery",
    categorySlug: jewelleryCategory ?? "rings",
    price,
    currency,
    image: primaryImage,
    // ProductCard doesn't display ratings, and the API carries none — don't invent them.
    rating: 0,
    reviewCount: 0,
  };

  if (images.length > 1 && images[1]) product.hoverImage = images[1];
  if (images.length > 0) product.images = images;
  if (jewelleryCategory) product.jewelleryCategory = jewelleryCategory;
  if (apiProduct.sku) product.sku = apiProduct.sku;
  if (apiProduct.created_date) product.createdAt = apiProduct.created_date;

  const compare = apiProduct.compare_price;
  if (compare !== null && compare !== undefined && compare > price) product.compareAtPrice = compare;

  const description = apiProduct.sort_description?.trim();
  if (description && description !== "null") product.description = description;

  if (karat) {
    const purity = `${karat}K`;
    if (purity === "14K" || purity === "18K" || purity === "22K") product.goldPurity = purity as GoldPurity;
    product.metal = tone && TONE_LABEL[tone] ? `${purity} ${TONE_LABEL[tone]}` : purity;
  }

  const video = allImages.find((img) => img.image_type === IMAGE_TYPE_VIDEO && img.image_path);
  if (video) {
    product.variantMedia = [
      {
        metal: tone === "WG" ? "white-gold" : tone === "RG" ? "rose-gold" : "yellow-gold",
        images,
        video: toUrl(video.image_path),
      },
    ];
  }

  return product;
}
