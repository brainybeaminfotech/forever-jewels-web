// Reads the vendor bulk export at data-sources/Stock.xlsx and regenerates
// src/data/diamond-catalog.ts — the loose-diamond inventory backing /diamonds.
// Re-run this whenever a fresh inventory export is dropped into data-sources/.
//
//   node scripts/build-diamond-catalog.mjs
//
// Rows with no disclosed rate (rate === 0, ~22% of this export, all from the SURAT
// company feed) are skipped — the catalog has no "price on request" concept, so a $0
// stone would just look broken on the site. Rows missing either image or video are
// skipped too, per explicit request — every stone in the catalog should have both.
//
// Video links on hosts that give an honest, distinguishable HTTP status (200 real / 404 dead)
// are live-checked (HEAD request, following redirects) and the stone dropped if its video is
// dead: view.gem360.in, diamonds360.in, and workshop.360view.link. Every other video host
// (d360.tech — the large majority — plus video.diamonds360.in and v360.diamonds) renders its
// viewer entirely client-side and returns an identical 200 for a real or made-up ID alike, so
// there's no server-side signal to check without executing their JS — and d360.tech's own
// media API explicitly blocks automated requests ("Automated scraping is blocked on this
// service"), so those hosts are left unvalidated rather than worked around.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as XLSX from "xlsx";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SOURCE_FILE = path.join(ROOT, "data-sources", "Stock.xlsx");
const OUT_FILE = path.join(ROOT, "src", "data", "diamond-catalog.ts");

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function titleCase(value) {
  return String(value)
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

function cleanStr(value) {
  if (value == null) return undefined;
  const s = String(value).trim();
  return s.length ? s : undefined;
}

// "NONE" is how the sheet spells out an absent fluorescence/treatment rather than leaving the cell blank.
function cleanEnum(value) {
  const s = cleanStr(value);
  return s && s.toUpperCase() !== "NONE" ? titleCase(s) : undefined;
}

// GIA-style color-grade codes ("D", "E/F", "S-T") sometimes land in the "fancy color"
// column instead of "color" — treat those as a plain grade rather than a fancy hue.
const COLOR_GRADE_RE = /^[D-Z](\s*[/-]\s*[D-Z])?$/i;

function colorFor(row) {
  const grade = cleanStr(row.color);
  if (grade) return grade.toUpperCase();

  const fancy = cleanStr(row["fancy color"]);
  if (!fancy) return undefined;
  if (COLOR_GRADE_RE.test(fancy)) return fancy.toUpperCase();

  const intensity = cleanStr(row["color intensity"]);
  if (intensity && !fancy.toUpperCase().includes(intensity.toUpperCase())) {
    return titleCase(`${intensity} ${fancy}`);
  }
  return titleCase(fancy);
}

function measurementsFor(row) {
  const l = row["measurement length"];
  const w = row["measurement width"];
  const d = row["measurement depth"];
  if (typeof l !== "number" || typeof w !== "number" || !l || !w) return undefined;
  return typeof d === "number" && d ? `${l}x${w}x${d}` : `${l}x${w}`;
}

const VALIDATABLE_VIDEO_HOSTS = new Set(["view.gem360.in", "diamonds360.in", "workshop.360view.link"]);

async function isReachable(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, { method: "HEAD", signal: controller.signal });
    clearTimeout(timeout);
    return res.ok;
  } catch {
    return false;
  }
}

/** Runs `fn` over `items` with at most `concurrency` in flight at once. */
async function mapWithConcurrency(items, concurrency, fn) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
  return results;
}

/** Drops stones whose video link 404s on a host known to give an honest status — see the file header for why other hosts are left as-is. */
async function dropDeadVideos(stones) {
  const candidates = stones.filter((s) => {
    try {
      return VALIDATABLE_VIDEO_HOSTS.has(new URL(s.video).host);
    } catch {
      return false;
    }
  });
  if (candidates.length === 0) return { stones, checked: 0, dropped: 0 };

  const reachable = await mapWithConcurrency(candidates, 10, (s) => isReachable(s.video));
  const deadIds = new Set(candidates.filter((_, i) => !reachable[i]).map((s) => s.id));

  return {
    stones: stones.filter((s) => !deadIds.has(s.id)),
    checked: candidates.length,
    dropped: deadIds.size,
  };
}

const workbook = XLSX.read(fs.readFileSync(SOURCE_FILE), { type: "buffer" });
const sheet = workbook.Sheets[workbook.SheetNames[0]];
/** @type {Record<string, unknown>[]} */
const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });

const stones = [];
let skippedNoRate = 0;
let skippedNoMedia = 0;

for (const row of rows) {
  const stock = row["stock #"] != null ? String(row["stock #"]).trim() : null;
  const shapeRaw = row.shape;
  const weight = typeof row.weight === "number" ? row.weight : null;
  const rate = typeof row.rate === "number" ? row.rate : 0;
  const image = cleanStr(row.image);
  const video = cleanStr(row.video);
  if (!stock || !shapeRaw || weight == null) continue;
  if (!rate) {
    skippedNoRate += 1;
    continue;
  }
  if (!image || !video) {
    skippedNoMedia += 1;
    continue;
  }

  const shape = titleCase(shapeRaw);
  const pricePerCarat = round2(rate);
  const price = round2(rate * weight);
  const availability = row.status === "available" ? "in-stock" : "unavailable";

  const stone = {
    id: stock,
    slug: `${slugify(shape)}-${slugify(String(weight))}ct-${slugify(stock)}`,
    category: "diamond",
    shape,
    caratWeight: weight,
    color: colorFor(row),
    clarity: cleanStr(row.clarity),
    polish: row.polish ? titleCase(row.polish) : undefined,
    symmetry: row.symmetry ? titleCase(row.symmetry) : undefined,
    culetSize: row.culet ? titleCase(String(row.culet)) : undefined,
    fluorescence: cleanEnum(row.fluorescence),
    measurementsMm: measurementsFor(row),
    depthPercent: typeof row["depth %"] === "number" && row["depth %"] ? row["depth %"] : undefined,
    tablePercent: typeof row["table %"] === "number" && row["table %"] ? row["table %"] : undefined,
    lab: cleanStr(row.lab),
    certificateNumber: cleanStr(row.report),
    growthType: row["growth type"] ? "lab-grown" : "natural",
    treatment: cleanEnum(row.treatment),
    availability,
    pricePerCarat,
    price,
    currency: "USD",
    image,
    video,
  };

  stones.push(stone);
}

stones.sort((a, b) => a.price - b.price);

console.log(
  `Parsed ${stones.length} diamonds from ${rows.length} rows (skipped ${skippedNoRate} with no disclosed rate, ${skippedNoMedia} missing image/video).`
);

const hostList = [...VALIDATABLE_VIDEO_HOSTS].join(", ");
console.log(`Checking video links on ${hostList}...`);
const { stones: liveStones, checked, dropped } = await dropDeadVideos(stones);
console.log(`Checked ${checked} link(s) on ${hostList}, dropped ${dropped} stone(s) with a dead video.`);

console.log(
  "By shape:",
  Object.entries(liveStones.reduce((acc, s) => ({ ...acc, [s.shape]: (acc[s.shape] ?? 0) + 1 }), {}))
);

const header = `// AUTO-GENERATED loose diamond inventory for /diamonds, built from the vendor export at
// data-sources/Stock.xlsx by scripts/build-diamond-catalog.mjs — re-run that script after
// dropping in a fresh export rather than hand-editing this file.

import type { StoneListItem } from "@/types";

// Parsed from a JSON string rather than a literal array — at over a thousand entries,
// TypeScript's structural checker chokes on a literal array this large ("union type too complex").
export const DIAMOND_CATALOG = JSON.parse(${JSON.stringify(JSON.stringify(liveStones))}) as StoneListItem[];
`;

fs.writeFileSync(OUT_FILE, header);
console.log(`Wrote ${liveStones.length} diamonds to ${path.relative(ROOT, OUT_FILE)}`);
