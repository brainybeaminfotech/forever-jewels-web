/**
 * REST endpoint paths, relative to `NEXT_PUBLIC_REST_API_ENDPOINT`.
 * Mirrors tcctechweb's `@framework/utils/api-endpoints` — keep the keys and the path
 * strings identical to that file so the two frontends stay interchangeable against the
 * same backend. Add entries here as endpoints are bound, rather than inlining URLs.
 */
export const API_ENDPOINTS = {
  // Company information and theme
  COMPANY_INFORMATION: "user/companyinfo",

  // Products
  PRODUCTLIST: "user/product/list",
  PRODUCT_DESCRIPTION: "user/product/details",
  HEADER_PRODUCT_SEARCH: "user/product/serach/list",
  FEATURED_PRODUCT: "user/product/featured/list",
} as const;
