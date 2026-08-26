/**
 * Binding for `GET user/product/list` — the category listing feed.
 *
 * Mirrors tcctechweb's `@framework/product/get-all-products`, but fetched server-side so
 * the listing page renders with data already in place.
 */

import http, { isApiConfigured } from "@framework/utils/http";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import type { ApiEnvelope, ApiProductListData } from "@framework/types";
import type { JewelleryCategorySlug, Product } from "@/types";
import { CATEGORY_API_SLUG, getImageBaseUrl, normaliseProduct } from "./normalise-product";

/**
 * The listing page filters and sorts client-side over the whole category, so fetch it in
 * one request. The API caps a page at the number of matching rows, and the largest
 * category currently holds 255, so this comfortably returns everything in a single call.
 */
const PER_PAGE_ROWS = 500;

export interface ProductListOptions {
  currency?: string;
  revalidate?: number;
}

/**
 * Fetches every product in a category and maps it to `Product[]`.
 * Never throws — returns `[]` on failure so the page can render its empty state.
 */
export async function getProductsByCategoryFromApi(
  category: JewelleryCategorySlug,
  { currency = "USD", revalidate = 300 }: ProductListOptions = {},
): Promise<Product[]> {
  if (!isApiConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[product-list] NEXT_PUBLIC_REST_API_ENDPOINT is not set — no products will render.");
    }
    return [];
  }

  try {
    const [response, imageBaseUrl] = await Promise.all([
      http.get<ApiEnvelope<ApiProductListData>>(API_ENDPOINTS.PRODUCTLIST, {
        query: {
          currency,
          per_page_rows: PER_PAGE_ROWS,
          product_category: CATEGORY_API_SLUG[category],
        },
        revalidate,
      }),
      getImageBaseUrl(),
    ]);

    const list = response?.data?.productList ?? [];
    return list
      .map((item) => normaliseProduct(item, imageBaseUrl, currency))
      .filter((p): p is Product => p !== null);
  } catch (error) {
    console.error(`[product-list] ${API_ENDPOINTS.PRODUCTLIST} (${category}) failed:`, error);
    return [];
  }
}

/**
 * Newest products across every category, for the home page "New Arrivals" rail.
 * The endpoint defaults to `sort_by=id`, `order_by=DESC`, so the first page is already
 * newest-first without needing an explicit sort parameter.
 */
export async function getLatestProducts(limit = 8, { currency = "USD", revalidate = 300 }: ProductListOptions = {}): Promise<Product[]> {
  if (!isApiConfigured()) return [];

  try {
    const [response, imageBaseUrl] = await Promise.all([
      http.get<ApiEnvelope<ApiProductListData>>(API_ENDPOINTS.PRODUCTLIST, {
        query: { currency, per_page_rows: limit * 2 },
        revalidate,
      }),
      getImageBaseUrl(),
    ]);

    return (response?.data?.productList ?? [])
      .map((item) => normaliseProduct(item, imageBaseUrl, currency))
      .filter((product): product is Product => product !== null)
      .slice(0, limit);
  } catch (error) {
    console.error(`[product-list] latest products failed:`, error);
    return [];
  }
}
