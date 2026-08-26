/**
 * Binding for `GET user/product/featured/list?currency=USD`.
 *
 * Note: this feed is driven by products flagged as featured in the admin. If nothing is
 * flagged, the API returns `data: []` — a successful but empty response, not an error.
 */

import http, { isApiConfigured } from "@framework/utils/http";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import type { ApiEnvelope, ApiProduct } from "@framework/types";
import type { JewelleryCategorySlug, Product } from "@/types";
import { getImageBaseUrl, normaliseProduct } from "./normalise-product";

export interface FeaturedProductsOptions {
  currency?: string;
  revalidate?: number;
}

/** Never throws — returns `[]` when the API is unconfigured or the request fails. */
export async function getFeaturedProducts({
  currency = "USD",
  revalidate = 300,
}: FeaturedProductsOptions = {}): Promise<Product[]> {
  if (!isApiConfigured()) return [];

  try {
    const [response, imageBaseUrl] = await Promise.all([
      http.get<ApiEnvelope<ApiProduct[]>>(API_ENDPOINTS.FEATURED_PRODUCT, { query: { currency }, revalidate }),
      getImageBaseUrl(),
    ]);

    return (response?.data ?? [])
      .map((item) => normaliseProduct(item, imageBaseUrl, currency))
      .filter((p): p is Product => p !== null);
  } catch (error) {
    console.error(`[featured-products] ${API_ENDPOINTS.FEATURED_PRODUCT} failed:`, error);
    return [];
  }
}

/** Featured products narrowed to one jewellery category. */
export async function getFeaturedProductsByCategory(
  category: JewelleryCategorySlug,
  options?: FeaturedProductsOptions,
): Promise<Product[]> {
  const products = await getFeaturedProducts(options);
  return products.filter((p) => p.jewelleryCategory === category);
}
