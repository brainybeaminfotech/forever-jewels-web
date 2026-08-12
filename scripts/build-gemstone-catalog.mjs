// Generates a deterministic placeholder loose-gemstone inventory (no real bulk export
// exists yet — see the diamond pipeline in build-diamond-catalog.mjs for the real-data
// equivalent) and writes src/data/gemstone-catalog.ts, backing /gemstone.
//
//   node scripts/build-gemstone-catalog.mjs
//
// Swap this script out for a real vendor-export parser the same way build-diamond-catalog.mjs
// reads data-sources/LOOSE_DIAMOND_LIST.xlsx, once real gemstone inventory data exists —
// every consumer downstream (types, filters, UI) already treats gemstones and diamonds
// identically via the shared StoneListItem shape.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_FILE = path.join(ROOT, "src", "data", "gemstone-catalog.ts");

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function hash(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = (h * 33) ^ str.charCodeAt(i);
  return h >>> 0;
}

function pick(seed, salt, min, max) {
  const h = hash(seed + ":" + salt);
  return min + (h % (max - min + 1));
}

function pickFloat(seed, salt, min, max) {
  const h = hash(seed + ":" + salt);
  return min + ((h % 10000) / 10000) * (max - min);
}

function weighted(seed, salt, options) {
  // options: [{ value, weight }]
  const total = options.reduce((sum, o) => sum + o.weight, 0);
  const r = pick(seed, salt, 0, total - 1);
  let acc = 0;
  for (const o of options) {
    acc += o.weight;
    if (r < acc) return o.value;
  }
  return options[options.length - 1].value;
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

// ---------------------------------------------------------------------------
// Per-type reference data
// ---------------------------------------------------------------------------

const TYPES = [
  {
    type: "Sapphire",
    count: 55,
    shapes: [
      { value: "Oval", weight: 30 },
      { value: "Cushion", weight: 22 },
      { value: "Round", weight: 18 },
      { value: "Emerald", weight: 10 },
      { value: "Pear", weight: 10 },
      { value: "Cabochon", weight: 5 },
      { value: "Marquise", weight: 5 },
    ],
    colors: [
      { value: "Royal Blue", swatch: "#0f3d78", weight: 26 },
      { value: "Cornflower Blue", swatch: "#5f8bd6", weight: 16 },
      { value: "Pink", swatch: "#e6a3c0", weight: 12 },
      { value: "Yellow", swatch: "#f2d24b", weight: 10 },
      { value: "Padparadscha", swatch: "#f2a679", weight: 6 },
      { value: "Purple", swatch: "#8e6bbf", weight: 10 },
      { value: "Green", swatch: "#4f9270", weight: 8 },
      { value: "White", swatch: "#f1eee6", weight: 6 },
      { value: "Black", swatch: "#1b1b1b", weight: 6 },
    ],
    caratRange: [0.4, 12],
    pricePerCaratRange: [280, 14000],
    treatments: [{ value: "Heated", weight: 70 }, { value: "Unheated", weight: 30 }],
    origins: [
      { value: "Ceylon (Sri Lanka)", weight: 34 },
      { value: "Burma (Myanmar)", weight: 18 },
      { value: "Kashmir", weight: 6 },
      { value: "Madagascar", weight: 24 },
      { value: "Australia", weight: 18 },
    ],
    labs: [{ value: "GRS", weight: 30 }, { value: "GIA", weight: 30 }, { value: "AGL", weight: 20 }, { value: "IGI", weight: 20 }],
  },
  {
    type: "Ruby",
    count: 34,
    shapes: [
      { value: "Oval", weight: 34 },
      { value: "Cushion", weight: 24 },
      { value: "Round", weight: 16 },
      { value: "Pear", weight: 12 },
      { value: "Cabochon", weight: 8 },
      { value: "Emerald", weight: 6 },
    ],
    colors: [
      { value: "Pigeon Blood Red", swatch: "#a3162e", weight: 22 },
      { value: "Red", swatch: "#c22035", weight: 32 },
      { value: "Pinkish Red", swatch: "#d24564", weight: 24 },
      { value: "Purplish Red", swatch: "#9a3050", weight: 22 },
    ],
    caratRange: [0.3, 6],
    pricePerCaratRange: [420, 16000],
    treatments: [{ value: "Heated", weight: 75 }, { value: "Unheated", weight: 25 }],
    origins: [
      { value: "Burma (Myanmar)", weight: 30 },
      { value: "Mozambique", weight: 34 },
      { value: "Thailand", weight: 18 },
      { value: "Madagascar", weight: 18 },
    ],
    labs: [{ value: "GRS", weight: 34 }, { value: "GIA", weight: 26 }, { value: "AGL", weight: 20 }, { value: "IGI", weight: 20 }],
  },
  {
    type: "Emerald",
    count: 30,
    shapes: [
      { value: "Emerald", weight: 44 },
      { value: "Oval", weight: 26 },
      { value: "Cushion", weight: 14 },
      { value: "Pear", weight: 10 },
      { value: "Round", weight: 6 },
    ],
    colors: [
      { value: "Green", swatch: "#1f6b45", weight: 40 },
      { value: "Bluish Green", swatch: "#1d7a6b", weight: 30 },
      { value: "Yellowish Green", swatch: "#4a8a3f", weight: 30 },
    ],
    caratRange: [0.3, 8],
    pricePerCaratRange: [360, 11000],
    treatments: [
      { value: "Minor Oil", weight: 34 },
      { value: "Moderate Oil", weight: 34 },
      { value: "No Oil", weight: 14 },
      { value: "Insignificant Oil", weight: 18 },
    ],
    origins: [
      { value: "Colombia", weight: 44 },
      { value: "Zambia", weight: 34 },
      { value: "Brazil", weight: 22 },
    ],
    labs: [{ value: "AGL", weight: 26 }, { value: "GRS", weight: 24 }, { value: "GIA", weight: 30 }, { value: "IGI", weight: 20 }],
  },
  {
    type: "Pearl",
    count: 26,
    shapes: [
      { value: "Round", weight: 40 },
      { value: "Button", weight: 20 },
      { value: "Drop", weight: 20 },
      { value: "Baroque", weight: 12 },
      { value: "Oval", weight: 8 },
    ],
    colors: [
      { value: "White", swatch: "#f4f1ea", weight: 26 },
      { value: "Cream", swatch: "#ecdcb8", weight: 20 },
      { value: "Golden", swatch: "#d3a53d", weight: 18 },
      { value: "Silver", swatch: "#cdd0d4", weight: 14 },
      { value: "Pink", swatch: "#e9c2cf", weight: 12 },
      { value: "Black (Tahitian)", swatch: "#2b2b30", weight: 10 },
    ],
    caratRange: [0.6, 20],
    pricePerCaratRange: [18, 900],
    treatments: [{ value: "Untreated", weight: 60 }, { value: "Dyed", weight: 20 }, { value: "Bleached", weight: 20 }],
    origins: [
      { value: "Akoya (Japan)", weight: 30 },
      { value: "South Sea (Australia)", weight: 24 },
      { value: "Tahiti (French Polynesia)", weight: 18 },
      { value: "Freshwater (China)", weight: 28 },
    ],
    labs: [{ value: "GIA", weight: 40 }, { value: "SSEF", weight: 20 }, { value: "AGL", weight: 20 }, { value: "IGI", weight: 20 }],
    noFaceting: true,
  },
  {
    type: "Topaz",
    count: 24,
    shapes: [
      { value: "Oval", weight: 26 },
      { value: "Emerald", weight: 22 },
      { value: "Cushion", weight: 18 },
      { value: "Round", weight: 16 },
      { value: "Pear", weight: 10 },
      { value: "Marquise", weight: 8 },
    ],
    colors: [
      { value: "Swiss Blue", swatch: "#3fa9c9", weight: 26 },
      { value: "London Blue", swatch: "#1c5a7a", weight: 26 },
      { value: "Sky Blue", swatch: "#a9d6e6", weight: 16 },
      { value: "Champagne", swatch: "#e8cfa0", weight: 16 },
      { value: "Pink", swatch: "#eab8cc", weight: 8 },
      { value: "White", swatch: "#f2f0ea", weight: 8 },
    ],
    caratRange: [0.8, 15],
    pricePerCaratRange: [14, 320],
    treatments: [{ value: "Irradiated", weight: 55 }, { value: "Untreated", weight: 45 }],
    origins: [
      { value: "Brazil", weight: 46 },
      { value: "Nigeria", weight: 28 },
      { value: "Sri Lanka", weight: 26 },
    ],
    labs: [{ value: "IGI", weight: 40 }, { value: "GIA", weight: 30 }, { value: "GRS", weight: 30 }],
  },
  {
    type: "Amethyst",
    count: 20,
    shapes: [
      { value: "Oval", weight: 26 },
      { value: "Cushion", weight: 22 },
      { value: "Emerald", weight: 18 },
      { value: "Round", weight: 18 },
      { value: "Pear", weight: 10 },
      { value: "Marquise", weight: 6 },
    ],
    colors: [
      { value: "Deep Purple", swatch: "#5b2a86", weight: 34 },
      { value: "Purple", swatch: "#7c4dab", weight: 34 },
      { value: "Lavender", swatch: "#b79cd6", weight: 32 },
    ],
    caratRange: [0.8, 20],
    pricePerCaratRange: [9, 140],
    treatments: [{ value: "Untreated", weight: 80 }, { value: "Heated", weight: 20 }],
    origins: [
      { value: "Brazil", weight: 44 },
      { value: "Uruguay", weight: 30 },
      { value: "Zambia", weight: 26 },
    ],
    labs: [{ value: "IGI", weight: 40 }, { value: "GIA", weight: 30 }, { value: "GRS", weight: 30 }],
  },
];

const CLARITY_TIERS = [
  { value: "Loupe Clean", weight: 14 },
  { value: "Eye Clean", weight: 40 },
  { value: "Slightly Included", weight: 34 },
  { value: "Included", weight: 12 },
];

const QUALITY_GRADES = [
  { value: "A", weight: 8 },
  { value: "AA", weight: 26 },
  { value: "AAA", weight: 34 },
  { value: "AAAA", weight: 22 },
  { value: "AAAAA", weight: 10 },
];

const TRANSPARENCY_FACETED = [
  { value: "Transparent", weight: 70 },
  { value: "Translucent", weight: 25 },
  { value: "Opaque", weight: 5 },
];

function certificateNumberFor(seed, lab) {
  const n = pick(seed, "cert", 1000000, 9999999);
  if (lab === "GRS") return `GRS${pick(seed, "certyear", 2021, 2026)}-${n}`;
  return String(n);
}

const stones = [];

for (const cfg of TYPES) {
  for (let i = 0; i < cfg.count; i++) {
    const seed = `${cfg.type}-${i}`;
    const shape = weighted(seed, "shape", cfg.shapes);
    const color = weighted(seed, "color", cfg.colors);
    const caratWeight = round2(pickFloat(seed, "carat", cfg.caratRange[0], cfg.caratRange[1]));
    const pricePerCarat = round2(pickFloat(seed, "ppc", cfg.pricePerCaratRange[0], cfg.pricePerCaratRange[1]));
    const price = round2(pricePerCarat * caratWeight);
    const treatment = weighted(seed, "treatment", cfg.treatments);
    const origin = weighted(seed, "origin", cfg.origins);
    const lab = weighted(seed, "lab", cfg.labs);
    const qualityGrade = weighted(seed, "quality", QUALITY_GRADES);
    const clarity = cfg.noFaceting ? undefined : weighted(seed, "clarity", CLARITY_TIERS);
    const transparency = cfg.noFaceting ? "Opaque" : weighted(seed, "transparency", TRANSPARENCY_FACETED);
    const singlePair = pick(seed, "pair", 0, 99) < 12 ? "pair" : "single";
    const availability = pick(seed, "avail", 0, 99) < 6 ? "unavailable" : "in-stock";
    const id = `gs-${slugify(cfg.type)}-${String(i + 1).padStart(3, "0")}`;

    stones.push({
      id,
      slug: `${slugify(cfg.type)}-${slugify(shape)}-${slugify(String(caratWeight))}ct-${id}`,
      category: "gemstone",
      gemstoneType: cfg.type,
      shape,
      caratWeight,
      colorLabel: color.value,
      colorSwatch: color.swatch,
      ...(clarity ? { clarity } : {}),
      transparency,
      lab,
      certificateNumber: certificateNumberFor(seed, lab),
      treatment,
      origin,
      qualityGrade,
      singlePair,
      availability,
      pricePerCarat,
      price,
      currency: "USD",
    });
  }
}

stones.sort((a, b) => a.price - b.price);

console.log(`Generated ${stones.length} placeholder gemstones.`);
console.log(
  "By type:",
  Object.entries(stones.reduce((acc, s) => ({ ...acc, [s.gemstoneType]: (acc[s.gemstoneType] ?? 0) + 1 }), {}))
);

const header = `// AUTO-GENERATED placeholder loose-gemstone inventory for /gemstone, built by
// scripts/build-gemstone-catalog.mjs. No real bulk export exists yet (unlike diamonds —
// see build-diamond-catalog.mjs) — this is deterministic seeded sample data standing in
// until a real vendor export is available. Swap the generator for a real parser the same
// way the diamond one reads data-sources/LOOSE_DIAMOND_LIST.xlsx; every downstream
// consumer already treats gemstones and diamonds identically via StoneListItem.

import type { StoneListItem } from "@/types";

// Parsed from a JSON string rather than a literal array — keeps this consistent with
// build-diamond-catalog.mjs so it stays safe once this generator is swapped for a real,
// much larger bulk export (a literal array of thousands of entries trips up TypeScript's
// structural checker with a "union type too complex" error).
export const GEMSTONE_CATALOG = JSON.parse(${JSON.stringify(JSON.stringify(stones))}) as StoneListItem[];
`;

fs.writeFileSync(OUT_FILE, header);
console.log(`Wrote ${stones.length} gemstones to ${path.relative(ROOT, OUT_FILE)}`);
