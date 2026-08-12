import { JEWELLERY_CATALOG } from "@/data/jewellery-catalog";
import type { JewelleryCategorySlug, Product } from "@/types";

export interface CategoryMeta {
  slug: JewelleryCategorySlug;
  label: string;
  title: string;
  description: string;
  sizeLabel?: string;
}

export const JEWELLERY_CATEGORIES: JewelleryCategorySlug[] = ["rings", "earrings", "necklaces", "bracelets", "pendants"];

export const CATEGORY_META: Record<JewelleryCategorySlug, CategoryMeta> = {
  rings: {
    slug: "rings",
    label: "Rings",
    title: "Fine Rings",
    description: "Solitaires, halos, and stacking bands hand-finished in our atelier — each one built around a certified center stone chosen for exceptional fire.",
    sizeLabel: "Ring Size",
  },
  earrings: {
    slug: "earrings",
    label: "Earrings",
    title: "Fine Earrings",
    description: "From everyday studs to statement drops — earrings designed to catch the light from every angle.",
  },
  necklaces: {
    slug: "necklaces",
    label: "Necklaces",
    title: "Fine Necklaces",
    description: "Layerable chains and singular pendants, in fine gold, made for effortless everyday elegance.",
    sizeLabel: "Chain Length",
  },
  bracelets: {
    slug: "bracelets",
    label: "Bracelets",
    title: "Fine Bracelets",
    description: "Tennis lines, bangles, and cuffs finished by hand — comfortable enough to wear every day.",
    sizeLabel: "Bracelet Size",
  },
  pendants: {
    slug: "pendants",
    label: "Pendants",
    title: "Fine Pendants",
    description: "Signature drops designed to be the center of attention, each one ready to layer onto a chain of your choice.",
    sizeLabel: "Chain Length",
  },
};

export function isJewelleryCategory(value: string): value is JewelleryCategorySlug {
  return (JEWELLERY_CATEGORIES as string[]).includes(value);
}

export function getProductsByCategory(category: JewelleryCategorySlug): Product[] {
  return JEWELLERY_CATALOG.filter((p) => p.jewelleryCategory === category);
}

export function getProductBySlug(slug: string): Product | undefined {
  return JEWELLERY_CATALOG.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return JEWELLERY_CATALOG.find((p) => p.id === id);
}

export function getRelatedProducts(product: Product, count = 4): Product[] {
  const found = (product.relatedIds ?? []).map(getProductById).filter((p): p is Product => Boolean(p));
  if (found.length >= count) return found.slice(0, count);
  const sameCategory = product.jewelleryCategory
    ? getProductsByCategory(product.jewelleryCategory).filter((p) => p.id !== product.id && !found.includes(p))
    : [];
  return [...found, ...sameCategory].slice(0, count);
}

export function getCompleteTheLookProducts(product: Product, count = 3): Product[] {
  return (product.completeTheLookIds ?? []).map(getProductById).filter((p): p is Product => Boolean(p)).slice(0, count);
}

/** A representative real product photo for a jewellery category — used for category tiles. */
export function getCategoryImage(category: JewelleryCategorySlug): string | undefined {
  const [first] = getProductsByCategory(category);
  return first?.image;
}

/**
 * A diverse "New Arrivals" spread: guarantees at least one product from every jewellery
 * category (ring, earring, necklace, bracelet, pendant) before filling remaining slots
 * with the next-newest piece per category, so the section never skews to a single type.
 */
export function getNewArrivals(count = 8): Product[] {
  const byCategory = new Map<JewelleryCategorySlug, Product[]>();
  for (const cat of JEWELLERY_CATEGORIES) byCategory.set(cat, sortProducts(getProductsByCategory(cat), "newest"));

  const picks: Product[] = [];
  for (const cat of JEWELLERY_CATEGORIES) {
    const first = byCategory.get(cat)?.[0];
    if (first) picks.push(first);
  }
  for (let round = 1; picks.length < count; round++) {
    const before = picks.length;
    for (const cat of JEWELLERY_CATEGORIES) {
      if (picks.length >= count) break;
      const next = byCategory.get(cat)?.[round];
      if (next) picks.push(next);
    }
    if (picks.length === before) break;
  }
  return picks.slice(0, count);
}

// ---------------------------------------------------------------------------
// Filters
// ---------------------------------------------------------------------------

export interface ListingFilters {
  collection: string[];
  metal: string[];
  goldPurity: string[];
  diamondType: string[];
  gemstone: string[];
  shape: string[];
  style: string[];
  occasion: string[];
  gender: string[];
  size: string[];
  availability: string[];
  certification: string[];
  priceMin: number | null;
  priceMax: number | null;
  readyToShip: boolean;
  customizable: boolean;
  featured: boolean;
}

export const EMPTY_FILTERS: ListingFilters = {
  collection: [],
  metal: [],
  goldPurity: [],
  diamondType: [],
  gemstone: [],
  shape: [],
  style: [],
  occasion: [],
  gender: [],
  size: [],
  availability: [],
  certification: [],
  priceMin: null,
  priceMax: null,
  readyToShip: false,
  customizable: false,
  featured: false,
};

const MULTI_KEYS = ["collection", "metal", "goldPurity", "diamondType", "gemstone", "shape", "style", "occasion", "gender", "size", "availability", "certification"] as const;

export function countActiveFilters(f: ListingFilters): number {
  let n = 0;
  for (const key of MULTI_KEYS) n += f[key].length;
  if (f.priceMin !== null || f.priceMax !== null) n += 1;
  if (f.readyToShip) n += 1;
  if (f.customizable) n += 1;
  if (f.featured) n += 1;
  return n;
}

export function applyFilters(products: Product[], f: ListingFilters): Product[] {
  return products.filter((p) => {
    if (f.collection.length && !(p.collectionSlug && f.collection.includes(p.collectionSlug))) return false;
    if (f.metal.length && !p.metalOptions?.some((m) => f.metal.includes(m.id))) return false;
    if (f.goldPurity.length && !(p.goldPurity && f.goldPurity.includes(p.goldPurity))) return false;
    if (f.diamondType.length && !(p.diamondType && f.diamondType.includes(p.diamondType))) return false;
    if (f.gemstone.length && !(p.gemstoneType && f.gemstone.includes(p.gemstoneType))) return false;
    if (f.shape.length && !(p.shape && f.shape.includes(p.shape))) return false;
    if (f.style.length && !(p.style && f.style.includes(p.style))) return false;
    if (f.occasion.length && !p.occasion?.some((o) => f.occasion.includes(o))) return false;
    if (f.gender.length && !(p.gender && f.gender.includes(p.gender))) return false;
    if (f.size.length && !p.sizes?.some((s) => f.size.includes(s))) return false;
    if (f.availability.length && !(p.availability && f.availability.includes(p.availability))) return false;
    if (f.certification.length && !(p.certification && f.certification.includes(p.certification))) return false;
    if (f.priceMin !== null && (p.priceMax ?? p.price) < f.priceMin) return false;
    if (f.priceMax !== null && (p.priceMin ?? p.price) > f.priceMax) return false;
    if (f.readyToShip && !p.readyToShip) return false;
    if (f.customizable && !p.customizable) return false;
    if (f.featured && !(p.isNew || p.isBestseller)) return false;
    return true;
  });
}

// ---------------------------------------------------------------------------
// Sorting
// ---------------------------------------------------------------------------

export type SortKey = "featured" | "newest" | "bestselling" | "price-asc" | "price-desc" | "rating" | "popular";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "bestselling", label: "Best Selling" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Customer Rating" },
  { value: "popular", label: "Most Popular" },
];

export function sortProducts(products: Product[], sort: SortKey): Product[] {
  const arr = [...products];
  switch (sort) {
    case "newest":
      return arr.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
    case "bestselling":
      return arr.sort((a, b) => Number(b.isBestseller) - Number(a.isBestseller) || b.reviewCount - a.reviewCount);
    case "price-asc":
      return arr.sort((a, b) => a.price - b.price);
    case "price-desc":
      return arr.sort((a, b) => b.price - a.price);
    case "rating":
      return arr.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    case "popular":
      return arr.sort((a, b) => b.reviewCount - a.reviewCount);
    case "featured":
    default:
      return arr.sort((a, b) => Number(b.isNew) - Number(a.isNew) || Number(b.isBestseller) - Number(a.isBestseller) || b.rating - a.rating);
  }
}

// ---------------------------------------------------------------------------
// Facets — option lists (with live counts) derived from the category's products
// ---------------------------------------------------------------------------

export type FacetKey = (typeof MULTI_KEYS)[number] | "price" | "readyToShip" | "customizable" | "featured";

export interface FacetOption {
  value: string;
  label: string;
  count: number;
  swatch?: string;
}

export interface Facet {
  key: FacetKey;
  label: string;
  type: "checkbox" | "swatch" | "price" | "toggle";
  options?: FacetOption[];
  min?: number;
  max?: number;
}

function tally(products: Product[], getValues: (p: Product) => string[] | undefined, labelFor?: (v: string) => string, swatchFor?: (v: string) => string | undefined): FacetOption[] {
  const counts = new Map<string, number>();
  for (const p of products) {
    for (const v of getValues(p) ?? []) counts.set(v, (counts.get(v) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count, label: labelFor ? labelFor(value) : value, swatch: swatchFor?.(value) }))
    .sort((a, b) => b.count - a.count);
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function buildFacets(products: Product[], category: JewelleryCategorySlug): Facet[] {
  const meta = CATEGORY_META[category];
  const prices = products.map((p) => p.priceMin ?? p.price);
  const maxPrices = products.map((p) => p.priceMax ?? p.price);

  const facets: Facet[] = [
    { key: "featured", label: "New & Bestselling", type: "toggle" },
    {
      key: "price",
      label: "Price Range",
      type: "price",
      min: Math.min(...prices),
      max: Math.max(...maxPrices),
    },
    {
      key: "collection",
      label: "Collection",
      type: "checkbox",
      options: tally(products, (p) => (p.collectionSlug ? [p.collectionSlug] : undefined), (v) => v.split("-").map(capitalize).join(" ")),
    },
    {
      key: "metal",
      label: "Metal Type",
      type: "swatch",
      options: tally(
        products,
        (p) => p.metalOptions?.map((m) => m.id),
        (v) => p_metalLabel(products, v),
        (v) => p_metalSwatch(products, v)
      ),
    },
    {
      key: "goldPurity",
      label: "Gold Purity",
      type: "checkbox",
      options: tally(products, (p) => (p.goldPurity ? [p.goldPurity] : undefined)),
    },
    {
      key: "diamondType",
      label: "Diamond Type",
      type: "checkbox",
      options: tally(products, (p) => (p.diamondType ? [p.diamondType] : undefined), (v) => (v === "lab-grown" ? "Lab-Grown" : "Natural")),
    },
    {
      key: "gemstone",
      label: "Gemstone",
      type: "checkbox",
      options: tally(products, (p) => (p.gemstoneType ? [p.gemstoneType] : undefined)),
    },
    {
      key: "shape",
      label: "Shape",
      type: "checkbox",
      options: tally(products, (p) => (p.shape ? [p.shape] : undefined), capitalize),
    },
    {
      key: "style",
      label: "Style",
      type: "checkbox",
      options: tally(products, (p) => (p.style ? [p.style] : undefined)),
    },
    {
      key: "occasion",
      label: "Occasion",
      type: "checkbox",
      options: tally(products, (p) => p.occasion),
    },
    {
      key: "gender",
      label: "Gender",
      type: "checkbox",
      options: tally(products, (p) => (p.gender ? [p.gender] : undefined), capitalize),
    },
    ...(meta.sizeLabel
      ? [
          {
            key: "size" as const,
            label: meta.sizeLabel,
            type: "checkbox" as const,
            options: tally(products, (p) => p.sizes).sort((a, b) => a.value.localeCompare(b.value, undefined, { numeric: true })),
          },
        ]
      : []),
    {
      key: "certification",
      label: "Certification",
      type: "checkbox",
      options: tally(products, (p) => (p.certification ? [p.certification] : undefined)),
    },
    {
      key: "availability",
      label: "Availability",
      type: "checkbox",
      options: tally(products, (p) => (p.availability ? [p.availability] : undefined), (v) => v.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())),
    },
    { key: "readyToShip", label: "Ready to Ship", type: "toggle" },
    { key: "customizable", label: "Customizable", type: "toggle" },
  ];

  return facets.filter((f) => (f.type !== "checkbox" && f.type !== "swatch" ? true : (f.options?.length ?? 0) > 0));
}

function p_metalLabel(products: Product[], id: string): string {
  for (const p of products) {
    const m = p.metalOptions?.find((m) => m.id === id);
    if (m) return m.label;
  }
  return id;
}
function p_metalSwatch(products: Product[], id: string): string | undefined {
  for (const p of products) {
    const m = p.metalOptions?.find((m) => m.id === id);
    if (m) return m.swatch;
  }
  return undefined;
}
