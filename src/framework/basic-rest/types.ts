/**
 * DTOs for the tcctech REST API, written against real responses from
 * `user/product/list` and `user/companyinfo` on the forever-jewels DB.
 */

export interface ApiProductImage {
  id: number;
  /** Path relative to `web_setting.image_base_url`, e.g. `TCC_TECH/products/RG145-E/RG145-E-YG-1.webp`. */
  image_path: string;
  /** 1 = still image, 4 = video (mp4). */
  image_type: number;
  metal_tone_short_code: string | null;
}

export interface ApiProductCategory {
  id: number;
  id_category: number;
  category_name: string;
  sub_category_name: string | null;
}

/** Product metal option — carries the karat and per-metal pricing. */
export interface ApiProductMetalOption {
  id: number;
  gold_karat: number | null;
  metal_tone: unknown[];
}

export interface ApiProduct {
  id: number;
  name: string;
  slug: string;
  sku: string | null;
  sort_description: string | null;
  created_date: string | null;
  retail_price: number | null;
  compare_price: number | null;
  is_trending: string | null;
  product_categories: ApiProductCategory[] | null;
  product_images: ApiProductImage[] | null;
  pmo: ApiProductMetalOption[] | null;
}

export interface ApiPagination {
  per_page_rows: number;
  current_page: number;
  total_pages: number;
  total_items: number;
}

/** Standard envelope: `{ code, status, message, data }`. */
export interface ApiEnvelope<T> {
  code: number;
  status: string;
  message: string;
  data: T;
}

export interface ApiProductListData {
  pagination: ApiPagination;
  productList: ApiProduct[];
}

export interface ApiCompanyInfoData {
  web_setting?: {
    /** Base URL every `image_path` is resolved against. */
    image_base_url?: string | null;
  } | null;
}

/* ------------------------------------------------------------------ */
/* user/product/details                                                */
/* ------------------------------------------------------------------ */

/**
 * The detail endpoint's product object differs from the list endpoint's in ways that are
 * easy to miss: `PMO`/`PDO` are UPPERCASE here (lowercase in the list), there is no
 * `retail_price` (price lives in `PMO[].Price` as a formatted string), image tone is
 * `metal_tone_sort_code` (not `..._short_code`), and `category_name` is capitalised.
 */
export interface ApiDetailImage {
  id: number;
  image_path: string;
  image_type: number;
  metal_tone_sort_code: string | null;
}

/** Price/metal option. `Price` and the `after_discount_*` fields are formatted, e.g. "1,150.00". */
export interface ApiDetailPmo {
  id: number;
  Price: string | null;
  after_discount_product_price: string | null;
  metal_weight: number | null;
  band_metal_weight: number | null;
  side_dia_count: number | null;
  side_dia_weight: number | null;
  delivery_days: string | null;
  id_size: number | null;
  id_m_tone: number | null;
}

/** One stone row — centre and side stones both appear here. */
export interface ApiDetailPdo {
  stone: string | null;
  mm_size: string | null;
  weight: number | null;
  count: number | null;
  diamond_shape: string | null;
  diamond_color: string | null;
  diamond_clarity: string | null;
  total_diamond_weight: number | null;
}

export interface ApiProductDetail {
  id: number;
  name: string;
  slug: string;
  sku: string | null;
  sort_description: string | null;
  long_description: string | null;
  total_diamond_weight: number | null;
  rating: number | null;
  rating_user_count: string | number | null;
  is_customization: string | null;
  style_no: string | null;
  certificate: string | null;
  gender: string | null;
  shipping_day: string | number | null;
  meta_title: string | null;
  meta_description: string | null;
  product_categories: ApiProductCategory[] | null;
  product_images: ApiDetailImage[] | null;
  PMO: ApiDetailPmo[] | null;
  PDO: ApiDetailPdo[] | null;
}

export interface ApiSizeOption {
  id: number;
  size: string | null;
  is_default: boolean;
}

export interface ApiKaratOption {
  id: number;
  name: number | string | null;
}

export interface ApiProductDetailData {
  products: ApiProductDetail | null;
  size?: ApiSizeOption[] | null;
  metal_karat?: ApiKaratOption[] | null;
  metals?: Array<{ id: number; name: string | null }> | null;
}
