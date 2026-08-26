/**
 * Header + results-page search.
 *
 * Uses `user/product/list` with `search_text` rather than the dedicated
 * `user/product/serach/list` endpoint: both return the same matches, but the dedicated
 * search endpoint returns `image_path: null` on every row for this DB, which would leave
 * every result thumbnail blank. The list endpoint returns the full `product_images` array.
 */

import http, { isApiConfigured } from "@framework/utils/http";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import type { ApiEnvelope, ApiProductListData } from "@framework/types";
import type { Product } from "@/types";
import { getImageBaseUrl, normaliseProduct } from "./normalise-product";

/** Search results are full products, so the cards reuse the normal mapping. */
export type SearchHit = Pick<Product, "id" | "name" | "slug" | "category" | "price" | "image">;

export async function searchProducts(query: string, currency = "USD", limit = 8): Promise<SearchHit[]> {
  const searchText = query.trim();
  if (!searchText || !isApiConfigured()) return [];

  try {
    const [response, imageBaseUrl] = await Promise.all([
      http.get<ApiEnvelope<ApiProductListData>>(API_ENDPOINTS.PRODUCTLIST, {
        query: { currency, search_text: searchText, per_page_rows: limit },
        revalidate: 60,
      }),
      getImageBaseUrl(),
    ]);

    return (response?.data?.productList ?? [])
      .map((item) => normaliseProduct(item, imageBaseUrl, currency))
      .filter((product): product is Product => product !== null)
      .slice(0, limit)
      .map(({ id, name, slug, category, price, image }) => ({ id, name, slug, category, price, image }));
  } catch (error) {
    console.error(`[search] ${API_ENDPOINTS.PRODUCTLIST} (search_text) failed:`, error);
    return [];
  }
}
