// Scans /public/product for the real studio photography + turntable videos the team
// dropped in (organized as <SKU>/<SKU>-<TONE>-<VIEW>.<ext> and <SKU>-<TONE>.mp4, tone in
// RG/WG/YG), and regenerates src/data/jewellery-catalog.ts from it. Re-run this whenever
// product photography is added, removed, or replaced under /public/product.
//
//   node scripts/build-jewellery-catalog.mjs
//
// Everything under /public/product that isn't a recognized <SKU>-<TONE>-<VIEW> image or
// <SKU>-<TONE> video is ignored, so stray folders (chain-builder assets, icon sets, a
// scraped competitor page, .zip/.rar archives, desktop.ini, etc.) are safely skipped.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PRODUCT_DIR = path.join(ROOT, "public", "product");
const OUT_FILE = path.join(ROOT, "src", "data", "jewellery-catalog.ts");

const TONE_TO_METAL = { YG: "yellow-gold", WG: "white-gold", RG: "rose-gold" };
const METAL_ORDER = ["yellow-gold", "white-gold", "rose-gold"];
const METAL_LABEL = { "yellow-gold": "Yellow Gold", "white-gold": "White Gold", "rose-gold": "Rose Gold" };
const METAL_SWATCH = { "yellow-gold": "#D6B45C", "white-gold": "#E4E1D8", "rose-gold": "#E3B7A0" };

// Display order for the detail-page gallery (shows every available view).
const VIEW_ORDER = ["FV", "BV", "MV", "PV", "RV", "TV", "T2V", "P2V"];
// Listing-card primary/hover shots are picked independently: cards use the angled
// profile shot rather than the straight-on front view, with the on-model shot as hover.
const CARD_PRIMARY_ORDER = ["PV", "FV", "BV", "RV", "TV", "T2V", "P2V", "MV"];
const CARD_HOVER_ORDER = ["MV", "FV", "PV", "BV", "RV", "TV", "T2V", "P2V"];

const CATEGORY_BY_CODE = {
  RN: "rings",
  BR: "bracelets",
  BN: "bracelets",
  ER: "earrings",
  PD: "pendants",
  OTH: "necklaces",
};

const IMAGE_RE = /^(ALR-[A-Z0-9]+(?:-[A-Z0-9]+)*)-(RG|WG|YG)-(FV|MV|PV|RV|TV|T2V|P2V|BV)(\s*-\s*Copy|\s*\(\d+\))?\.(png|jpg|jpeg)$/i;
const VIDEO_RE = /^(ALR-[A-Z0-9]+(?:-[A-Z0-9]+)*)-(RG|WG|YG)(\s*\(\d+\))?\.mp4$/i;

// ---------------------------------------------------------------------------
// 1. Walk /public/product and group recognized files by SKU (parsed from the
//    filename, not the folder name — several folders are misnamed or nested).
// ---------------------------------------------------------------------------

function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
}

const files = [];
walk(PRODUCT_DIR, files);

/** @type {Map<string, { tones: Record<string, { views: Record<string, string>, video?: string }> }>} */
const skuMap = new Map();

function getRec(sku) {
  const key = sku.toUpperCase();
  let rec = skuMap.get(key);
  if (!rec) {
    rec = { tones: {} };
    skuMap.set(key, rec);
  }
  return rec;
}

function toRelPublicPath(absPath) {
  return "/" + path.relative(path.join(ROOT, "public"), absPath).split(path.sep).join("/");
}

// Pass 1: canonical filenames only (no "- Copy" / " (2)" suffix) so they always win.
// Pass 2: suffixed duplicates fill in gaps only. Keeps output free of messy paths
// whenever a clean file already covers that sku/tone/view.
for (const preferCanonicalOnly of [true, false]) {
  for (const full of files) {
    const base = path.basename(full);
    let m = base.match(IMAGE_RE);
    if (m) {
      const [, sku, tone, view, dupeSuffix] = m;
      if (preferCanonicalOnly && dupeSuffix) continue;
      const rec = getRec(sku);
      const toneU = tone.toUpperCase();
      const viewU = view.toUpperCase();
      const toneRec = rec.tones[toneU] ?? (rec.tones[toneU] = { views: {} });
      if (!toneRec.views[viewU]) toneRec.views[viewU] = toRelPublicPath(full);
      continue;
    }
    m = base.match(VIDEO_RE);
    if (m) {
      const [, sku, tone, dupeSuffix] = m;
      if (preferCanonicalOnly && dupeSuffix) continue;
      const rec = getRec(sku);
      const toneU = tone.toUpperCase();
      const toneRec = rec.tones[toneU] ?? (rec.tones[toneU] = { views: {} });
      if (!toneRec.video) toneRec.video = toRelPublicPath(full);
    }
  }
}

// ---------------------------------------------------------------------------
// 2. Group SKUs by jewellery category, derived from the 2nd "-" segment.
// ---------------------------------------------------------------------------

const skusByCategory = { rings: [], bracelets: [], earrings: [], pendants: [], necklaces: [] };

for (const sku of skuMap.keys()) {
  const code = sku.split("-")[1];
  const category = CATEGORY_BY_CODE[code];
  if (!category) {
    console.warn(`Skipping unrecognized SKU prefix: ${sku}`);
    continue;
  }
  skusByCategory[category].push(sku);
}
for (const list of Object.values(skusByCategory)) list.sort();

console.log(
  "Products found:",
  Object.entries(skusByCategory).map(([c, l]) => `${c}=${l.length}`).join(" ")
);

// ---------------------------------------------------------------------------
// 3. Deterministic pseudo-random helpers (seeded by SKU, stable across re-runs).
// ---------------------------------------------------------------------------

function hash(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = (h * 33) ^ str.charCodeAt(i);
  return h >>> 0;
}

function pick(seed, salt, min, max) {
  const h = hash(seed + ":" + salt);
  return min + (h % (max - min + 1));
}

function roundTo(value, nearest) {
  return Math.round(value / nearest) * nearest;
}

// ---------------------------------------------------------------------------
// 4. Hand-curated names. Confirmed against the actual renders for earrings,
// necklaces, pendants and the first few bracelets/rings; the remaining ring
// names are drawn from a pool of plausible engagement/fashion styles since
// there's no product-copy source to pull exact names from.
// ---------------------------------------------------------------------------

const RING_NAMES = [
  "Classic Solitaire Ring",
  "Petite Solitaire Ring",
  "Halo Solitaire Ring",
  "Double Halo Ring",
  "Hidden Halo Ring",
  "Pavé Halo Ring",
  "Three-Stone Ring",
  "Toi et Moi Ring",
  "Cluster Ring",
  "Vintage Milgrain Ring",
  "Cathedral Solitaire Ring",
  "Bezel Solitaire Ring",
  "Twist Shank Ring",
  "Split Shank Ring",
  "Trellis Ring",
  "Tapered Baguette Ring",
  "Channel Set Band",
  "Eternity Band",
  "Stacking Band",
  "Signet Ring",
  "East-West Ring",
  "Marquise Halo Ring",
  "Knife-Edge Solitaire Ring",
  "Six-Prong Solitaire Ring",
];

const NAME_BY_SKU = {
  "ALR-BN-CR-331": "Diamond Tennis Bangle",
  "ALR-BR-CR-041": "Classic Diamond Tennis Bracelet",
  "ALR-BR-CR-1665": "Riviera Diamond Bracelet",
  "ALR-BR-CR-1692": "Diamond Line Bracelet",
  "ALR-BR-CR-1694": "Petite Diamond Tennis Bracelet",
  "ALR-BR-CR-291": "Milgrain Tennis Bracelet",
  "ALR-BR-CR-325": "Alternating Diamond Tennis Bracelet",
  "ALR-ER-CR-115-C": "Princess Halo Drop Earrings",
  "ALR-OTH-CR-38052": "Diamond Y-Drop Necklace",
  "ALR-PD-CR-1257": "Three-Stone Drop Pendant",
  "ALR-PD-CR-38137": "Two-Tone Infinity Heart Pendant",
  "ALR-PD-CR-38139": "Heart & Butterfly Pendant",
  "ALR-PD-CR-38166": "Diamond Cross Pendant",
};

function nameForSku(sku, category, indexInCategory) {
  if (NAME_BY_SKU[sku]) return NAME_BY_SKU[sku];
  if (category === "rings") return RING_NAMES[indexInCategory % RING_NAMES.length];
  return `${CATEGORY_LABEL[category]} Piece`;
}

const CATEGORY_LABEL = {
  rings: "Rings",
  bracelets: "Bracelets",
  earrings: "Earrings",
  pendants: "Pendants",
  necklaces: "Necklaces",
};

const PRICE_RANGE = {
  rings: [1450, 6800],
  bracelets: [2200, 6200],
  earrings: [980, 2400],
  pendants: [640, 1900],
  necklaces: [1400, 3200],
};

const WEIGHT_RANGE = {
  rings: [2.4, 6.5],
  bracelets: [8, 19],
  earrings: [2.8, 5.5],
  pendants: [1.8, 4.2],
  necklaces: [3.5, 7.5],
};

const HIGHLIGHTS = [
  "Handcrafted in our atelier",
  "Comes packaged in a signature Forever Jewels box",
  "Nickel-free and hypoallergenic setting",
  "Ethically sourced and conflict-free",
];

const CARE_INSTRUCTIONS = [
  "Use a mild soap and warm water solution for deeper cleaning; pat dry.",
  "Have prongs and clasps inspected annually by a jeweller.",
  "Take off before exercising or manual work to avoid impact damage.",
  "Avoid direct contact with perfume, lotion, and hairspray.",
];

const SIZE_LABEL = { rings: "Ring Size", bracelets: "Bracelet Size", necklaces: "Chain Length", pendants: "Chain Length" };
const SIZES = {
  rings: ["4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9"],
  bracelets: ["6.5\"", "7\"", "7.5\"", "8\""],
  necklaces: ["16\"", "18\"", "20\""],
  pendants: ["16\"", "18\"", "20\""],
};

// ---------------------------------------------------------------------------
// 5. Build the Product objects.
// ---------------------------------------------------------------------------

const TODAY = new Date("2026-07-20T00:00:00Z");

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function skuSuffix(sku) {
  return sku.split("-").slice(3).join("").toLowerCase();
}

function toneCodeForMetal(metal) {
  return Object.keys(TONE_TO_METAL).find((t) => TONE_TO_METAL[t] === metal);
}

function pickView(toneRec, order) {
  for (const v of order) {
    if (toneRec?.views[v]) return toneRec.views[v];
  }
  return undefined;
}

function buildVariantMedia(rec) {
  return METAL_ORDER.filter((metal) => Object.entries(TONE_TO_METAL).some(([tone, m]) => m === metal && rec.tones[tone]))
    .map((metal) => {
      const tone = Object.keys(TONE_TO_METAL).find((t) => TONE_TO_METAL[t] === metal);
      const toneRec = rec.tones[tone];
      const images = VIEW_ORDER.filter((v) => toneRec.views[v]).map((v) => toneRec.views[v]);
      return { metal, images, video: toneRec.video };
    });
}

const allProducts = [];

for (const category of Object.keys(skusByCategory)) {
  const skus = skusByCategory[category];
  skus.forEach((sku, indexInCategory) => {
    const rec = skuMap.get(sku);
    const variantMedia = buildVariantMedia(rec);
    if (variantMedia.length === 0) return;

    // Drop the brand prefix (e.g. "ALR") before seeding placeholder data, so a future
    // prefix rename doesn't reshuffle every product's price/rating/etc. again.
    const seedKey = sku.split("-").slice(1).join("-");

    const name = nameForSku(sku, category, indexInCategory);
    const suffix = skuSuffix(sku);
    const slug = `${slugify(name)}-${suffix}`;
    const id = `jc-${category}-${suffix}`;

    const defaultVariant = variantMedia[0];
    const defaultToneRec = rec.tones[toneCodeForMetal(defaultVariant.metal)];
    const image = pickView(defaultToneRec, CARD_PRIMARY_ORDER) ?? defaultVariant.images[0];
    const hoverImage = pickView(defaultToneRec, CARD_HOVER_ORDER) ?? defaultVariant.images[0];
    const images = variantMedia
      .map((v) => pickView(rec.tones[toneCodeForMetal(v.metal)], CARD_PRIMARY_ORDER) ?? v.images[0])
      .filter(Boolean);

    const metalOptions = variantMedia.map((v) => ({ id: v.metal, label: METAL_LABEL[v.metal], swatch: METAL_SWATCH[v.metal] }));

    const [priceMin, priceMax] = PRICE_RANGE[category];
    const price = roundTo(pick(seedKey, "price", priceMin, priceMax), 10);

    const [wMin, wMax] = WEIGHT_RANGE[category];
    const weightGrams = Math.round((wMin + (pick(seedKey, "weight", 0, 100) / 100) * (wMax - wMin)) * 10) / 10;

    const rating = Math.round((4.5 + (pick(seedKey, "rating", 0, 50) / 100)) * 10) / 10;
    const reviewCount = pick(seedKey, "reviews", 9, 186);

    const daysAgo = pick(seedKey, "createdAt", 1, 150);
    const createdAt = new Date(TODAY.getTime() - daysAgo * 86400000).toISOString().slice(0, 10);
    const isNew = daysAgo <= 21;
    const isBestseller = !isNew && pick(seedKey, "bestseller", 0, 99) < 18;

    const readyToShip = pick(seedKey, "ready", 0, 99) < 30;
    const availability = readyToShip ? "in-stock" : pick(seedKey, "avail", 0, 99) < 65 ? "made-to-order" : "in-stock";

    const caratWeight = category === "rings" || category === "pendants" || category === "earrings"
      ? Math.round((0.4 + (pick(seedKey, "carat", 0, 100) / 100) * 1.6) * 100) / 100
      : Math.round((1.2 + (pick(seedKey, "carat", 0, 100) / 100) * 4.5) * 100) / 100;

    const goldPurity = "18K";
    const diamondType = "lab-grown";
    const customizable = category === "rings" || category === "pendants" || category === "necklaces";

    const metalSummary = `${goldPurity} ${METAL_LABEL[defaultVariant.metal]}`;
    const gem = `${caratWeight}ct tw Lab-Grown Diamond`;

    const product = {
      id,
      slug,
      name,
      category: CATEGORY_LABEL[category],
      categorySlug: category === "necklaces" ? "necklaces" : category,
      jewelleryCategory: category,
      price,
      currency: "USD",
      image,
      hoverImage,
      images,
      rating,
      reviewCount,
      ...(isNew ? { isNew: true } : {}),
      ...(isBestseller ? { isBestseller: true } : {}),
      metal: metalSummary,
      gem,
      sku,
      createdAt,
      description: `The ${name} is finished in ${metalSummary.toLowerCase()} and set with ${gem.toLowerCase()}, handcrafted in our atelier and finished by hand.`,
      highlights: HIGHLIGHTS,
      badges: [],
      metalOptions,
      goldPurity,
      diamondType,
      caratWeight,
      availability,
      readyToShip,
      customizable,
      weightGrams,
      specs: [
        { label: "Metal", value: metalSummary },
        { label: "Gold Purity", value: goldPurity },
        { label: "Diamond Type", value: "Lab-Grown" },
        { label: "Carat Weight", value: `${caratWeight}ct` },
        { label: "Total Weight", value: `${weightGrams}g` },
      ],
      careInstructions: CARE_INSTRUCTIONS,
      ...(SIZE_LABEL[category] ? { sizeLabel: SIZE_LABEL[category], sizes: SIZES[category] } : {}),
      gender: "women",
      occasion: ["Anniversary", "Gifting"],
      variantMedia,
    };

    allProducts.push(product);
  });
}

// Related products: next few items in the same category, wrapping around.
const byCategory = new Map();
for (const p of allProducts) {
  const list = byCategory.get(p.jewelleryCategory) ?? [];
  list.push(p);
  byCategory.set(p.jewelleryCategory, list);
}
for (const list of byCategory.values()) {
  list.forEach((p, i) => {
    const related = [];
    for (let step = 1; step <= list.length - 1 && related.length < 4; step++) {
      related.push(list[(i + step) % list.length].id);
    }
    p.relatedIds = related;
  });
}

// ---------------------------------------------------------------------------
// 6. Emit src/data/jewellery-catalog.ts
// ---------------------------------------------------------------------------

const header = `// AUTO-GENERATED catalog data for the jewellery listing/detail pages.
// Generated from the real studio photography + turntable video sets in /public/product
// by scripts/build-jewellery-catalog.mjs — re-run that script after adding, removing, or
// replacing product photography rather than hand-editing this file.

import type { Product } from "@/types";

export const JEWELLERY_CATALOG: Product[] = ${JSON.stringify(allProducts, null, 2)};
`;

fs.writeFileSync(OUT_FILE, header);
console.log(`Wrote ${allProducts.length} products to ${path.relative(ROOT, OUT_FILE)}`);
