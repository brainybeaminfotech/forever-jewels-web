import type { DiamondShape } from "./nav";

export type ProductCategorySlug =
  | "engagement-rings"
  | "wedding-rings"
  | "earrings"
  | "necklaces"
  | "bracelets"
  | "pendants"
  | "custom-jewellery"
  | "rings";

export interface ProductCategory {
  id: string;
  slug: ProductCategorySlug;
  title: string;
  description: string;
  image: string;
  productCount: number;
}

/** The 5 categories served by the jewellery listing/detail templates. */
export type JewelleryCategorySlug = "rings" | "earrings" | "necklaces" | "bracelets" | "pendants";

export type ProductBadge = "new" | "bestseller" | "trending" | "limited" | "ready-to-ship" | "sale";

export type MetalOptionId = "yellow-gold" | "white-gold" | "rose-gold";

export interface MetalOption {
  id: MetalOptionId;
  label: string;
  swatch: string;
  priceDelta?: number;
}

export type GoldPurity = "14K" | "18K" | "22K";
export type DiamondType = "natural" | "lab-grown";
export type ProductAvailability = "in-stock" | "made-to-order" | "out-of-stock";
export type ProductGender = "women" | "men" | "unisex";

export interface ProductSpec {
  label: string;
  value: string;
}

/** Specs grouped under a heading, so the PDP can present them by subject. */
export interface ProductSpecGroup {
  title: string;
  items: ProductSpec[];
}

/** Full photography set (every angle + turntable video) for one metal tone of a product. */
export interface ProductMediaVariant {
  metal: MetalOptionId;
  images: string[];
  video?: string;
}

export interface ProductReview {
  id: string;
  author: string;
  location?: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  verified?: boolean;
  images?: string[];
  helpfulCount?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: ProductCategorySlug;
  price: number;
  compareAtPrice?: number;
  currency: string;
  image: string;
  hoverImage?: string;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isBestseller?: boolean;
  metal?: string;
  gem?: string;

  // --- Extended fields (all optional; listing/detail pages use these when present) ---
  sku?: string;
  createdAt?: string;
  jewelleryCategory?: JewelleryCategorySlug;
  collectionSlug?: string;
  images?: string[];
  description?: string;
  /** Full marketing copy from the API's `long_description`, shown as the PDP's lead section. */
  longDescription?: string[];
  highlights?: string[];
  badges?: ProductBadge[];
  metalOptions?: MetalOption[];
  goldPurity?: GoldPurity;
  diamondType?: DiamondType;
  gemstoneType?: string;
  shape?: DiamondShape;
  style?: string;
  occasion?: string[];
  gender?: ProductGender;
  sizeLabel?: string;
  sizes?: string[];
  caratWeight?: number;
  color?: string;
  clarity?: string;
  availability?: ProductAvailability;
  readyToShip?: boolean;
  customizable?: boolean;
  certification?: string;
  weightGrams?: number;
  priceMin?: number;
  priceMax?: number;
  specs?: ProductSpec[];
  /** Preferred over `specs` on the PDP when present; `specs` stays the flat fallback. */
  specGroups?: ProductSpecGroup[];
  careInstructions?: string[];
  reviewsList?: ProductReview[];
  relatedIds?: string[];
  completeTheLookIds?: string[];
  /** Real per-metal photography (all angles) + turntable video, keyed by metal option. */
  variantMedia?: ProductMediaVariant[];
}
