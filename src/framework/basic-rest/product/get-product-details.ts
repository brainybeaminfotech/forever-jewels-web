/**
 * Binding for `POST user/product/details?currency=USD`.
 *
 * Mirrors tcctechweb's `@framework/product/get-product-description`, but sends a plain
 * JSON `{ slug }` body — this backend rejects the encrypted `{ data: <hex> }` wrapper
 * with "Product not found!".
 */

import http, { isApiConfigured } from "@framework/utils/http";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import type {
  ApiDetailImage,
  ApiEnvelope,
  ApiProductDetail,
  ApiProductDetailData,
} from "@framework/types";
import type { GoldPurity, MetalOption, MetalOptionId, Product, ProductSpec } from "@/types";
import { CATEGORY_LABEL, getImageBaseUrl, resolveCategoryFromNames, TONE_LABEL } from "./normalise-product";

const IMAGE_TYPE_STILL = 1;
const IMAGE_TYPE_VIDEO = 4;

/** `PMO.Price` arrives formatted, e.g. "1,150.00". */
function parseMoney(value: string | number | null | undefined): number | undefined {
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
  if (typeof value !== "string") return undefined;
  const parsed = Number(value.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : undefined;
}

function imageSortKey(path: string): number {
  const match = /-(\d+)\.[a-z0-9]+$/i.exec(path);
  return match?.[1] ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

const TONE_TO_METAL_ID: Record<string, MetalOptionId> = {
  YG: "yellow-gold",
  WG: "white-gold",
  RG: "rose-gold",
};

const TONE_SWATCH: Record<MetalOptionId, string> = {
  "yellow-gold": "#d4af37",
  "white-gold": "#d9d9d6",
  "rose-gold": "#b76e79",
};

function stillsForTone(images: ApiDetailImage[], tone: string | null): ApiDetailImage[] {
  return images
    .filter((img) => img.image_type === IMAGE_TYPE_STILL && img.image_path && img.metal_tone_sort_code === tone)
    .sort((a, b) => imageSortKey(a.image_path) - imageSortKey(b.image_path));
}

/**
 * `long_description` arrives as HTML. Split it on block-level tags so paragraph breaks
 * survive, then strip the remaining markup — rendering it via dangerouslySetInnerHTML
 * would inject unsanitised backend HTML into the page.
 */
function htmlToParagraphs(html: string | null | undefined): string[] {
  if (!html) return [];
  return html
    .split(/<\/(?:p|div|li|h[1-6])>|<br\s*\/?>/i)
    .map((chunk) =>
      chunk
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&#39;|&rsquo;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter((text) => text.length > 0 && text !== "null");
}

export function normaliseProductDetail(
  data: ApiProductDetailData,
  imageBaseUrl: string,
  currency: string,
): Product | null {
  const detail: ApiProductDetail | null = data.products;
  if (!detail?.name || !detail.slug) return null;

  const allImages = detail.product_images ?? [];
  const toUrl = (path: string) => `${imageBaseUrl}/${path.replace(/^\/+/, "")}`;

  // Photography is grouped per metal tone; each tone becomes a gallery variant.
  const tones = [...new Set(allImages.map((img) => img.metal_tone_sort_code).filter((t): t is string => Boolean(t)))];
  const orderedStills = allImages
    .filter((img) => img.image_type === IMAGE_TYPE_STILL && img.image_path)
    .sort((a, b) => imageSortKey(a.image_path) - imageSortKey(b.image_path));

  const images = orderedStills.map((img) => toUrl(img.image_path));
  const primaryImage = images[0];
  if (!primaryImage) return null;

  const pmo = detail.PMO?.[0];
  const listPrice = parseMoney(pmo?.Price);
  const discounted = parseMoney(pmo?.after_discount_product_price);
  const price = discounted ?? listPrice;
  if (price === undefined || price <= 0) return null;

  const categoryNames = (detail.product_categories ?? []).map((c) => (c.category_name ?? "").toLowerCase());
  const jewelleryCategory = resolveCategoryFromNames(categoryNames);

  const karat = data.metal_karat?.[0]?.name;
  const purity = karat ? `${karat}K` : undefined;
  const primaryTone = orderedStills[0]?.metal_tone_sort_code ?? null;

  const product: Product = {
    id: String(detail.id),
    slug: detail.slug,
    name: detail.name,
    category: jewelleryCategory ? CATEGORY_LABEL[jewelleryCategory] : "Jewellery",
    categorySlug: jewelleryCategory ?? "rings",
    price,
    currency,
    image: primaryImage,
    images,
    rating: typeof detail.rating === "number" ? detail.rating : 0,
    reviewCount: Number(detail.rating_user_count ?? 0) || 0,
  };

  if (images.length > 1 && images[1]) product.hoverImage = images[1];
  if (jewelleryCategory) product.jewelleryCategory = jewelleryCategory;
  if (detail.sku) product.sku = detail.sku;

  // Only a genuine markdown counts as a compare-at price.
  if (listPrice !== undefined && discounted !== undefined && listPrice > discounted) {
    product.compareAtPrice = listPrice;
  }

  const longDescription = htmlToParagraphs(detail.long_description);
  if (longDescription.length > 0) product.longDescription = longDescription;

  const description = detail.sort_description?.trim() ?? longDescription[0];
  if (description && description !== "null") product.description = description;

  if (purity === "14K" || purity === "18K" || purity === "22K") product.goldPurity = purity as GoldPurity;
  if (purity) {
    product.metal = primaryTone && TONE_LABEL[primaryTone] ? `${purity} ${TONE_LABEL[primaryTone]}` : purity;
  }

  if (detail.is_customization === "1") product.customizable = true;
  if (detail.total_diamond_weight) product.caratWeight = detail.total_diamond_weight;

  // Ring/chain sizes offered for this product.
  const sizes = (data.size ?? []).map((s) => s.size).filter((s): s is string => Boolean(s));
  if (sizes.length > 0) product.sizes = sizes;

  // One metal option per tone that actually has photography.
  const metalOptions: MetalOption[] = tones
    .map((tone) => {
      const id = TONE_TO_METAL_ID[tone];
      if (!id) return null;
      return { id, label: TONE_LABEL[tone] ?? tone, swatch: TONE_SWATCH[id] } satisfies MetalOption;
    })
    .filter((m): m is MetalOption => m !== null);
  if (metalOptions.length > 0) product.metalOptions = metalOptions;

  // Per-tone galleries so switching metal swaps the photos, matching the existing
  // variantMedia contract ProductGallery already understands.
  const variantMedia = tones
    .map((tone) => {
      const id = TONE_TO_METAL_ID[tone];
      if (!id) return null;
      const toneStills = stillsForTone(allImages, tone).map((img) => toUrl(img.image_path));
      if (toneStills.length === 0) return null;
      const video = allImages.find(
        (img) => img.image_type === IMAGE_TYPE_VIDEO && img.metal_tone_sort_code === tone && img.image_path,
      );
      return { metal: id, images: toneStills, ...(video ? { video: toUrl(video.image_path) } : {}) };
    })
    .filter((v): v is NonNullable<typeof v> => v !== null);
  if (variantMedia.length > 0) product.variantMedia = variantMedia;

  // Centre stone drives the "gem" line; side stones are listed in the spec table.
  const stones = (detail.PDO ?? []).filter((s) => s.stone && (s.weight ?? 0) > 0);
  const centre = stones[0];
  if (centre?.stone) {
    product.gem = `${centre.weight}ct ${centre.stone}`;
    if (centre.diamond_color) product.color = centre.diamond_color;
    if (centre.diamond_clarity) product.clarity = centre.diamond_clarity;
  }

  // Specs are grouped by subject so the PDP can present them as three readable blocks
  // rather than one long undifferentiated list.
  const stoneItems: ProductSpec[] = [];
  const settingItems: ProductSpec[] = [];
  const pieceItems: ProductSpec[] = [];

  const describeStone = (stone: (typeof stones)[number]) =>
    [stone.count ? `${stone.count} ×` : null, stone.diamond_shape, stone.stone, stone.weight ? `${stone.weight} ct` : null]
      .filter(Boolean)
      .join(" ");

  // Labels must stay unique — the spec rows are keyed by label.
  stones.forEach((stone, index) => {
    const value = describeStone(stone);
    if (!value) return;
    const label = index === 0 ? "Centre Stone" : stones.length > 2 ? `Side Stone ${index}` : "Side Stones";
    stoneItems.push({ label, value });
    if (index === 0) {
      if (stone.mm_size) stoneItems.push({ label: "Measurements", value: `${stone.mm_size} mm` });
      if (stone.diamond_color) stoneItems.push({ label: "Colour", value: stone.diamond_color });
      if (stone.diamond_clarity) stoneItems.push({ label: "Clarity", value: stone.diamond_clarity });
    }
  });

  // Side-stone totals live on the metal option rather than the stone rows.
  if (pmo?.side_dia_count) {
    const weight = pmo.side_dia_weight ? ` · ${pmo.side_dia_weight} ct` : "";
    stoneItems.push({ label: "Side Stone Count", value: `${pmo.side_dia_count}${weight}` });
  }
  if (detail.total_diamond_weight) {
    stoneItems.push({ label: "Total Stone Weight", value: `${detail.total_diamond_weight} ct` });
  }

  if (product.metal) settingItems.push({ label: "Metal", value: product.metal });
  if (purity) settingItems.push({ label: "Purity", value: purity });
  if (primaryTone && TONE_LABEL[primaryTone]) settingItems.push({ label: "Tone", value: TONE_LABEL[primaryTone] });
  if (pmo?.metal_weight) settingItems.push({ label: "Metal Weight", value: `${pmo.metal_weight} g` });
  if (pmo?.band_metal_weight) settingItems.push({ label: "Band Weight", value: `${pmo.band_metal_weight} g` });

  if (detail.sku) pieceItems.push({ label: "SKU", value: detail.sku });
  if (detail.style_no) pieceItems.push({ label: "Style No.", value: detail.style_no });
  const subCategory = detail.product_categories?.[0]?.sub_category_name;
  if (subCategory) pieceItems.push({ label: "Collection", value: subCategory });
  if (sizes.length > 0) pieceItems.push({ label: sizes.length > 1 ? "Sizes" : "Size", value: sizes.join(", ") });
  if (detail.certificate) pieceItems.push({ label: "Certificate", value: detail.certificate });
  if (detail.is_customization === "1") pieceItems.push({ label: "Customisable", value: "Yes" });

  const specGroups = [
    { title: "The Stones", items: stoneItems },
    { title: "The Setting", items: settingItems },
    { title: "This Piece", items: pieceItems },
  ].filter((group) => group.items.length > 0);

  if (specGroups.length > 0) {
    product.specGroups = specGroups;
    // Flat list kept for consumers that predate grouping (e.g. CompareTray).
    product.specs = specGroups.flatMap((group) => group.items);
  }

  return product;
}

export interface ProductDetailOptions {
  currency?: string;
  revalidate?: number;
}

/** Returns null when the product isn't found or the request fails. */
export async function getProductDetailBySlug(
  slug: string,
  { currency = "USD", revalidate = 300 }: ProductDetailOptions = {},
): Promise<Product | null> {
  if (!isApiConfigured()) return null;

  try {
    const [response, imageBaseUrl] = await Promise.all([
      http.post<ApiEnvelope<ApiProductDetailData>>(
        API_ENDPOINTS.PRODUCT_DESCRIPTION,
        { slug },
        { query: { currency }, revalidate },
      ),
      getImageBaseUrl(),
    ]);

    if (!response?.data) return null;
    return normaliseProductDetail(response.data, imageBaseUrl, currency);
  } catch (error) {
    console.error(`[product-details] ${API_ENDPOINTS.PRODUCT_DESCRIPTION} (${slug}) failed:`, error);
    return null;
  }
}
