import { DIAMOND_CATALOG } from "@/data/diamond-catalog";
import { GEMSTONE_CATALOG } from "@/data/gemstone-catalog";
import { formatPrice } from "@/utils/format";
import type { StoneCategory, StoneListItem } from "@/types";

export interface StoneCategoryMeta {
  slug: StoneCategory;
  label: string;
  title: string;
  description: string;
}

export const STONE_META: Record<StoneCategory, StoneCategoryMeta> = {
  diamond: {
    slug: "diamond",
    label: "Diamonds",
    title: "Loose Diamonds",
    description:
      "Certified loose diamonds, natural and lab-grown, hand-selected for exceptional fire and brilliance — the starting point for a custom setting or a piece all your own.",
  },
  gemstone: {
    slug: "gemstone",
    label: "Gemstones",
    title: "Loose Gemstones",
    description:
      "Certified sapphires, rubies, emeralds, pearls and more, sourced from the world's finest deposits and graded by independent gemological laboratories.",
  },
};

export function getStonesByCategory(category: StoneCategory): StoneListItem[] {
  return category === "diamond" ? DIAMOND_CATALOG : GEMSTONE_CATALOG;
}

export function getStoneBySlug(slug: string): StoneListItem | undefined {
  return [...DIAMOND_CATALOG, ...GEMSTONE_CATALOG].find((s) => s.slug === slug);
}

export function getStoneById(id: string): StoneListItem | undefined {
  return [...DIAMOND_CATALOG, ...GEMSTONE_CATALOG].find((s) => s.id === id);
}

export function getRelatedStones(stone: StoneListItem, count = 4): StoneListItem[] {
  const pool = getStonesByCategory(stone.category).filter((s) => s.id !== stone.id);
  const sameGroup = pool.filter((s) =>
    stone.category === "gemstone" ? s.gemstoneType === stone.gemstoneType : s.shape === stone.shape
  );
  const rest = pool.filter((s) => !sameGroup.includes(s));
  const byPriceCloseness = (list: StoneListItem[]) =>
    [...list].sort((a, b) => Math.abs(a.price - stone.price) - Math.abs(b.price - stone.price));
  return [...byPriceCloseness(sameGroup), ...byPriceCloseness(rest)].slice(0, count);
}

// ---------------------------------------------------------------------------
// Route → pre-applied filter resolution (for /diamonds/[filter] and /gemstone/[type])
// ---------------------------------------------------------------------------

export const DIAMOND_SHAPE_SLUGS = [
  "round",
  "princess",
  "cushion",
  "emerald",
  "oval",
  "radiant",
  "asscher",
  "marquise",
  "heart",
  "pear",
] as const;

export const DIAMOND_GROWTH_SLUGS = ["natural", "lab-grown"] as const;

export type DiamondFilterResolution =
  | { kind: "shape"; value: string }
  | { kind: "growthType"; value: "natural" | "lab-grown" }
  | { kind: "none" };

export function resolveDiamondFilterSlug(slug: string): DiamondFilterResolution | null {
  if (slug === "loose") return { kind: "none" };
  if ((DIAMOND_SHAPE_SLUGS as readonly string[]).includes(slug)) {
    return { kind: "shape", value: slug.charAt(0).toUpperCase() + slug.slice(1) };
  }
  if ((DIAMOND_GROWTH_SLUGS as readonly string[]).includes(slug)) {
    return { kind: "growthType", value: slug as "natural" | "lab-grown" };
  }
  return null;
}

export const GEMSTONE_TYPE_SLUGS = ["ruby", "sapphire", "emerald", "pearl", "topaz", "amethyst"] as const;

export function resolveGemstoneTypeSlug(slug: string): string | null {
  if (!(GEMSTONE_TYPE_SLUGS as readonly string[]).includes(slug)) return null;
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

/** Simple English pluralizer, good enough for the six gem type names we show (Ruby → Rubies, Topaz → Topazes, Sapphire → Sapphires, …). */
export function pluralizeGemType(name: string): string {
  if (/[^aeiou]y$/i.test(name)) return `${name.slice(0, -1)}ies`;
  if (/(s|x|z|ch|sh)$/i.test(name)) return `${name}es`;
  return `${name}s`;
}

// ---------------------------------------------------------------------------
// Filters
// ---------------------------------------------------------------------------

export type SinglePairFilter = "any" | "single" | "pair";

export interface StoneFilters {
  shape: string[];
  color: string[];
  clarity: string[];
  lab: string[];
  growthType: string[];
  gemstoneType: string[];
  treatment: string[];
  origin: string[];
  transparency: string[];
  polish: string[];
  symmetry: string[];
  culetSize: string[];
  singlePair: SinglePairFilter;
  caratMin: number | null;
  caratMax: number | null;
  priceMin: number | null;
  priceMax: number | null;
  qualityGradeMin: number | null;
  qualityGradeMax: number | null;
  lengthMin: number | null;
  lengthMax: number | null;
  widthMin: number | null;
  widthMax: number | null;
  lwMin: number | null;
  lwMax: number | null;
}

export const EMPTY_STONE_FILTERS: StoneFilters = {
  shape: [],
  color: [],
  clarity: [],
  lab: [],
  growthType: [],
  gemstoneType: [],
  treatment: [],
  origin: [],
  transparency: [],
  polish: [],
  symmetry: [],
  culetSize: [],
  singlePair: "any",
  caratMin: null,
  caratMax: null,
  priceMin: null,
  priceMax: null,
  qualityGradeMin: null,
  qualityGradeMax: null,
  lengthMin: null,
  lengthMax: null,
  widthMin: null,
  widthMax: null,
  lwMin: null,
  lwMax: null,
};

export const STONE_MULTI_KEYS = [
  "shape",
  "color",
  "clarity",
  "lab",
  "growthType",
  "gemstoneType",
  "treatment",
  "origin",
  "transparency",
  "polish",
  "symmetry",
  "culetSize",
] as const;

export type StoneMultiKey = (typeof STONE_MULTI_KEYS)[number];

export const QUALITY_GRADE_ORDER = ["A", "AA", "AAA", "AAAA", "AAAAA"] as const;
export const QUALITY_GRADE_NOTE: Record<(typeof QUALITY_GRADE_ORDER)[number], string> = {
  A: "Good",
  AA: "Very Good",
  AAA: "Fine",
  AAAA: "Exceptional",
  AAAAA: "Museum Grade",
};

function colorOf(stone: StoneListItem): string | undefined {
  return stone.category === "gemstone" ? stone.colorLabel : stone.color;
}

/** Parses a "L x W x D" measurement string (e.g. "4.03x4.06x2.45") into numeric length/width/ratio. */
export function parseStoneDimensions(measurementsMm?: string): { length: number; width: number; ratio: number } | null {
  if (!measurementsMm) return null;
  const [length, width] = measurementsMm.split(/[x×]/i).map((p) => parseFloat(p.trim()));
  if (!length || !width || Number.isNaN(length) || Number.isNaN(width)) return null;
  return { length, width, ratio: Math.round((length / width) * 100) / 100 };
}

export function countActiveStoneFilters(f: StoneFilters): number {
  let n = 0;
  for (const key of STONE_MULTI_KEYS) n += f[key].length;
  if (f.caratMin !== null || f.caratMax !== null) n += 1;
  if (f.priceMin !== null || f.priceMax !== null) n += 1;
  if (f.qualityGradeMin !== null || f.qualityGradeMax !== null) n += 1;
  if (f.lengthMin !== null || f.lengthMax !== null) n += 1;
  if (f.widthMin !== null || f.widthMax !== null) n += 1;
  if (f.lwMin !== null || f.lwMax !== null) n += 1;
  if (f.singlePair !== "any") n += 1;
  return n;
}

export function applyStoneFilters(stones: StoneListItem[], f: StoneFilters): StoneListItem[] {
  return stones.filter((s) => {
    if (f.shape.length && !f.shape.includes(s.shape)) return false;
    if (f.color.length && !(colorOf(s) && f.color.includes(colorOf(s)!))) return false;
    if (f.clarity.length && !(s.clarity && f.clarity.includes(s.clarity))) return false;
    if (f.lab.length && !(s.lab && f.lab.includes(s.lab))) return false;
    if (f.growthType.length && !(s.growthType && f.growthType.includes(s.growthType))) return false;
    if (f.gemstoneType.length && !(s.gemstoneType && f.gemstoneType.includes(s.gemstoneType))) return false;
    if (f.treatment.length && !(s.treatment && f.treatment.includes(s.treatment))) return false;
    if (f.origin.length && !(s.origin && f.origin.includes(s.origin))) return false;
    if (f.transparency.length && !(s.transparency && f.transparency.includes(s.transparency))) return false;
    if (f.polish.length && !(s.polish && f.polish.includes(s.polish))) return false;
    if (f.symmetry.length && !(s.symmetry && f.symmetry.includes(s.symmetry))) return false;
    if (f.culetSize.length && !(s.culetSize && f.culetSize.includes(s.culetSize))) return false;
    if (f.singlePair !== "any" && s.singlePair !== f.singlePair) return false;
    if (f.caratMin !== null && s.caratWeight < f.caratMin) return false;
    if (f.caratMax !== null && s.caratWeight > f.caratMax) return false;
    if (f.priceMin !== null && s.price < f.priceMin) return false;
    if (f.priceMax !== null && s.price > f.priceMax) return false;
    if (f.qualityGradeMin !== null || f.qualityGradeMax !== null) {
      const index = s.qualityGrade ? QUALITY_GRADE_ORDER.indexOf(s.qualityGrade) + 1 : null;
      if (index === null) return false;
      if (f.qualityGradeMin !== null && index < f.qualityGradeMin) return false;
      if (f.qualityGradeMax !== null && index > f.qualityGradeMax) return false;
    }
    if (f.lengthMin !== null || f.lengthMax !== null || f.widthMin !== null || f.widthMax !== null || f.lwMin !== null || f.lwMax !== null) {
      const dims = parseStoneDimensions(s.measurementsMm);
      if (!dims) return false;
      if (f.lengthMin !== null && dims.length < f.lengthMin) return false;
      if (f.lengthMax !== null && dims.length > f.lengthMax) return false;
      if (f.widthMin !== null && dims.width < f.widthMin) return false;
      if (f.widthMax !== null && dims.width > f.widthMax) return false;
      if (f.lwMin !== null && dims.ratio < f.lwMin) return false;
      if (f.lwMax !== null && dims.ratio > f.lwMax) return false;
    }
    return true;
  });
}

// ---------------------------------------------------------------------------
// View mode
// ---------------------------------------------------------------------------

export type StoneView = "grid" | "list";

// ---------------------------------------------------------------------------
// Sorting
// ---------------------------------------------------------------------------

export type StoneSortKey = "featured" | "price-asc" | "price-desc" | "carat-asc" | "carat-desc" | "best-value";

export const STONE_SORT_OPTIONS: { value: StoneSortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "carat-asc", label: "Carat: Low to High" },
  { value: "carat-desc", label: "Carat: High to Low" },
  { value: "best-value", label: "Best Value ($/ct)" },
];

export function sortStones(stones: StoneListItem[], sort: StoneSortKey): StoneListItem[] {
  const arr = [...stones];
  switch (sort) {
    case "price-asc":
      return arr.sort((a, b) => a.price - b.price);
    case "price-desc":
      return arr.sort((a, b) => b.price - a.price);
    case "carat-asc":
      return arr.sort((a, b) => a.caratWeight - b.caratWeight);
    case "carat-desc":
      return arr.sort((a, b) => b.caratWeight - a.caratWeight);
    case "best-value":
      return arr.sort((a, b) => a.pricePerCarat - b.pricePerCarat);
    case "featured":
    default:
      return arr;
  }
}

// ---------------------------------------------------------------------------
// Facets
// ---------------------------------------------------------------------------

export type StoneFacetType = "shape-icon" | "swatch" | "checkbox" | "range" | "quality-range" | "single-pair";

export interface StoneFacetOption {
  value: string;
  label: string;
  count: number;
  swatch?: string;
  /** Real photo (preferred) or stand-in render for this option, shown instead of the abstract StoneShapeIcon outline. */
  thumbnail?: string;
}

export interface StoneFacet {
  key: StoneMultiKey | "carat" | "price" | "qualityGrade" | "singlePair" | "length" | "width" | "lw";
  label: string;
  type: StoneFacetType;
  options?: StoneFacetOption[];
  min?: number;
  max?: number;
}

export const GEM_TYPE_SWATCH: Record<string, string> = {
  Ruby: "#a3162e",
  Sapphire: "#0f3d78",
  Emerald: "#1f6b45",
  Pearl: "#ecdcb8",
  Topaz: "#3fa9c9",
  Amethyst: "#7c4dab",
};

/**
 * Stand-in render per shape, used only when no stone of that shape has real photography
 * (currently: every gemstone, plus any diamond shape our catalog happens to lack a photo for).
 * Sourced from the existing `public/shapes` render pack rather than the abstract line-art
 * StoneShapeIcon, so filter icons read as real stones rather than outline glyphs.
 */
export const SHAPE_ICON_IMAGE: Record<string, string> = {
  cushion: "/shapes/cushion.png",
  emerald: "/shapes/emerald.png",
  heart: "/shapes/heart.png",
  marquise: "/shapes/marquise.png",
  oval: "/shapes/oval.png",
  pear: "/shapes/pear.png",
  princess: "/shapes/princess.png",
  asscher: "/shapes/asscher.png",
  radiant: "/shapes/radiant.png",
  trillion: "/shapes/trillion.png",
};

function tally(
  stones: StoneListItem[],
  getValue: (s: StoneListItem) => string | undefined,
  swatchFor?: (value: string, s: StoneListItem) => string | undefined
): StoneFacetOption[] {
  const counts = new Map<string, number>();
  const swatches = new Map<string, string>();
  for (const s of stones) {
    const v = getValue(s);
    if (!v) continue;
    counts.set(v, (counts.get(v) ?? 0) + 1);
    if (swatchFor && !swatches.has(v)) {
      const sw = swatchFor(v, s);
      if (sw) swatches.set(v, sw);
    }
  }
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count, label: value, swatch: swatches.get(value) }))
    .sort((a, b) => b.count - a.count);
}

/** First real stone photo found for each distinct value of `getValue` — e.g. one actual diamond photo per shape. */
function representativeImage(stones: StoneListItem[], getValue: (s: StoneListItem) => string | undefined): Map<string, string> {
  const images = new Map<string, string>();
  for (const s of stones) {
    const v = getValue(s);
    if (!v || images.has(v) || !s.image) continue;
    images.set(v, s.image);
  }
  return images;
}

function withThumbnails(options: StoneFacetOption[], images: Map<string, string>, iconMap?: Record<string, string>): StoneFacetOption[] {
  return options.map((o) => ({ ...o, thumbnail: images.get(o.value) ?? iconMap?.[o.value.toLowerCase()] }));
}

export interface StoneRangeConfig {
  min: number;
  max: number;
  step: number;
  valueMin: number;
  valueMax: number;
  formatValue: (v: number) => string;
}

/** Maps a "range"-type StoneFacet to the props its RangeSlider needs — keeps StoneFilterBar/StoneFilterPanelContent from hand-rolling one block per facet key. */
export function rangeFacetConfig(facet: StoneFacet, filters: StoneFilters): StoneRangeConfig | null {
  const min = facet.min ?? 0;
  const max = facet.max ?? 0;
  switch (facet.key) {
    case "carat":
      return { min, max, step: 0.01, valueMin: filters.caratMin ?? min, valueMax: filters.caratMax ?? max, formatValue: (v) => `${v.toFixed(2)}ct` };
    case "price":
      return { min, max, step: 10, valueMin: filters.priceMin ?? min, valueMax: filters.priceMax ?? max, formatValue: (v) => formatPrice(v, "USD") };
    case "length":
      return { min, max, step: 0.01, valueMin: filters.lengthMin ?? min, valueMax: filters.lengthMax ?? max, formatValue: (v) => `${v.toFixed(2)}mm` };
    case "width":
      return { min, max, step: 0.01, valueMin: filters.widthMin ?? min, valueMax: filters.widthMax ?? max, formatValue: (v) => `${v.toFixed(2)}mm` };
    case "lw":
      return { min, max, step: 0.01, valueMin: filters.lwMin ?? min, valueMax: filters.lwMax ?? max, formatValue: (v) => v.toFixed(2) };
    default:
      return null;
  }
}

/** Companion to rangeFacetConfig — applies a slider's (lo, hi) back onto the right StoneFilters fields for that facet key. */
export function applyRangeChange(facet: StoneFacet, filters: StoneFilters, lo: number, hi: number): StoneFilters {
  switch (facet.key) {
    case "carat":
      return { ...filters, caratMin: lo, caratMax: hi };
    case "price":
      return { ...filters, priceMin: lo, priceMax: hi };
    case "length":
      return { ...filters, lengthMin: lo, lengthMax: hi };
    case "width":
      return { ...filters, widthMin: lo, widthMax: hi };
    case "lw":
      return { ...filters, lwMin: lo, lwMax: hi };
    default:
      return filters;
  }
}

export function buildStoneFacets(stones: StoneListItem[], category: StoneCategory): StoneFacet[] {
  const carats = stones.map((s) => s.caratWeight);
  const prices = stones.map((s) => s.price);
  const shapeImages = representativeImage(stones, (s) => s.shape);
  const colorImages = representativeImage(stones, colorOf);

  const dims = stones.map((s) => parseStoneDimensions(s.measurementsMm)).filter((d): d is NonNullable<typeof d> => d !== null);
  const dimensionFacets: StoneFacet[] = dims.length
    ? [
        { key: "length", label: "Length (mm)", type: "range", min: Math.min(...dims.map((d) => d.length)), max: Math.max(...dims.map((d) => d.length)) },
        { key: "width", label: "Width (mm)", type: "range", min: Math.min(...dims.map((d) => d.width)), max: Math.max(...dims.map((d) => d.width)) },
        { key: "lw", label: "L/W Ratio", type: "range", min: Math.min(...dims.map((d) => d.ratio)), max: Math.max(...dims.map((d) => d.ratio)) },
      ]
    : [];

  const shared: StoneFacet[] = [
    { key: "shape", label: "Shape", type: "shape-icon", options: withThumbnails(tally(stones, (s) => s.shape), shapeImages, SHAPE_ICON_IMAGE) },
    { key: "carat", label: "Carat Weight", type: "range", min: Math.min(...carats), max: Math.max(...carats) },
    { key: "price", label: "Price Range", type: "range", min: Math.min(...prices), max: Math.max(...prices) },
    { key: "color", label: "Color", type: "swatch", options: withThumbnails(tally(stones, colorOf, (v, s) => s.colorSwatch), colorImages) },
    { key: "clarity", label: "Clarity", type: "checkbox", options: tally(stones, (s) => s.clarity) },
    { key: "lab", label: "Certificate", type: "checkbox", options: tally(stones, (s) => s.lab) },
  ];

  const facets: StoneFacet[] =
    category === "diamond"
      ? [
          shared[0]!,
          { key: "growthType", label: "Growth Type", type: "checkbox", options: tally(stones, (s) => (s.growthType === "lab-grown" ? "Lab-Grown" : s.growthType ? "Natural" : undefined)) },
          shared[1]!,
          shared[2]!,
          shared[3]!,
          ...dimensionFacets,
          shared[4]!,
          shared[5]!,
          { key: "polish", label: "Polish", type: "checkbox", options: tally(stones, (s) => s.polish) },
          { key: "symmetry", label: "Symmetry", type: "checkbox", options: tally(stones, (s) => s.symmetry) },
          { key: "culetSize", label: "Culet", type: "checkbox", options: tally(stones, (s) => s.culetSize) },
        ]
      : [
          { key: "gemstoneType", label: "Gem Type", type: "swatch", options: tally(stones, (s) => s.gemstoneType, (v) => GEM_TYPE_SWATCH[v]) },
          shared[0]!,
          shared[3]!,
          shared[1]!,
          shared[2]!,
          { key: "qualityGrade", label: "Quality Grade", type: "quality-range" },
          ...dimensionFacets,
          shared[4]!,
          { key: "transparency", label: "Transparency", type: "checkbox", options: tally(stones, (s) => s.transparency) },
          { key: "treatment", label: "Enhancement", type: "checkbox", options: tally(stones, (s) => s.treatment) },
          { key: "origin", label: "Origin", type: "checkbox", options: tally(stones, (s) => s.origin) },
          shared[5]!,
          { key: "singlePair", label: "Single / Pair", type: "single-pair" },
        ];

  return facets.filter((f) => (f.type === "checkbox" || f.type === "swatch" ? (f.options?.length ?? 0) > 0 : true));
}

// ---------------------------------------------------------------------------
// List-view row helpers
// ---------------------------------------------------------------------------

/** Compact label/value pairs for a StoneListRow — narrower and differently-labeled than buildStoneSpecs, which targets the detail page. */
export function buildStoneListColumns(stone: StoneListItem): { label: string; value: string }[] {
  const columns: { label: string; value: string }[] = [{ label: "Item#", value: stone.id }];
  columns.push({ label: "Weight", value: `${stone.caratWeight}ct` });
  if (stone.measurementsMm) columns.push({ label: "Dimensions", value: stone.measurementsMm });
  if (stone.qualityGrade) columns.push({ label: "Quality Grade", value: stone.qualityGrade });

  const color = stone.category === "gemstone" ? stone.colorLabel : stone.color;
  if (color) columns.push({ label: stone.category === "gemstone" ? "Color Intensity" : "Color", value: color });
  if (stone.clarity) columns.push({ label: stone.category === "gemstone" ? "Eye Clarity" : "Clarity", value: stone.clarity });
  if (stone.transparency) columns.push({ label: "Transparency", value: stone.transparency });
  if (stone.treatment) columns.push({ label: "Enhancement", value: stone.treatment });
  if (stone.origin) columns.push({ label: "Origin", value: stone.origin });
  if (stone.lab) columns.push({ label: "Certificate", value: stone.lab });

  return columns;
}

// ---------------------------------------------------------------------------
// Detail page helpers
// ---------------------------------------------------------------------------

export function buildStoneSpecs(stone: StoneListItem): { label: string; value: string }[] {
  const specs: { label: string; value: string }[] = [];
  if (stone.category === "gemstone" && stone.gemstoneType) specs.push({ label: "Gem Type", value: stone.gemstoneType });
  specs.push({ label: "Shape", value: stone.shape });
  specs.push({ label: "Carat Weight", value: `${stone.caratWeight}ct` });
  if (stone.category === "diamond") {
    if (stone.growthType) specs.push({ label: "Growth Type", value: stone.growthType === "lab-grown" ? "Lab-Grown" : "Natural" });
    if (stone.color) specs.push({ label: "Color", value: stone.color });
    if (stone.clarity) specs.push({ label: "Clarity", value: stone.clarity });
    if (stone.polish) specs.push({ label: "Polish", value: stone.polish });
    if (stone.symmetry) specs.push({ label: "Symmetry", value: stone.symmetry });
    if (stone.culetSize) specs.push({ label: "Culet", value: stone.culetSize });
  } else {
    if (stone.colorLabel) specs.push({ label: "Color", value: stone.colorLabel });
    if (stone.clarity) specs.push({ label: "Clarity", value: stone.clarity });
    if (stone.transparency) specs.push({ label: "Transparency", value: stone.transparency });
    if (stone.treatment) specs.push({ label: "Enhancement", value: stone.treatment });
    if (stone.origin) specs.push({ label: "Origin", value: stone.origin });
    if (stone.qualityGrade) specs.push({ label: "Quality Grade", value: `${stone.qualityGrade} (${QUALITY_GRADE_NOTE[stone.qualityGrade]})` });
    if (stone.singlePair) specs.push({ label: "Single / Pair", value: stone.singlePair === "pair" ? "Pair" : "Single" });
  }
  if (stone.measurementsMm) specs.push({ label: "Measurements (mm)", value: stone.measurementsMm });
  if (stone.depthPercent != null) specs.push({ label: "Depth %", value: `${stone.depthPercent}%` });
  if (stone.tablePercent != null) specs.push({ label: "Table %", value: `${stone.tablePercent}%` });
  if (stone.lab) specs.push({ label: "Laboratory", value: stone.lab });
  if (stone.certificateNumber) specs.push({ label: "Certificate #", value: stone.certificateNumber });
  return specs;
}

const LAB_VERIFY_URL: Record<string, string> = {
  GIA: "https://www.gia.edu/report-check",
  IGI: "https://www.igi.org/verify-your-report",
};

export function labVerifyUrl(lab?: string): string | undefined {
  return lab ? LAB_VERIFY_URL[lab] : undefined;
}
