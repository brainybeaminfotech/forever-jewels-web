// Generates the site's favicon set and default link-preview ("share") image from code,
// so they stay on-brand and can be regenerated after a brand change:
//
//   node scripts/generate-brand-assets.mjs
//
// Outputs
//   src/app/favicon.ico          16/32/48 px (PNG-in-ICO) — Next serves it at /favicon.ico
//   src/app/icon.svg             scalable tab icon for modern browsers
//   src/app/apple-icon.png       180 px iOS home-screen icon
//   public/icons/icon-*.png      192/512 px + maskable 512 px, referenced by src/app/manifest.ts
//   public/images/og-forever-jewels.jpg
//                                1200×630 default share image (WhatsApp, Facebook, X, LinkedIn…)
//
// The mark is the round-brilliant diamond that forms the "O" in the FOREVER logo, redrawn as
// vectors (the logo PNG is only 51 px tall — far too small to scale up). Text in the share image
// is set in Playfair (scripts/assets/Playfair-Regular.ttf, SIL Open Font License) and Geist
// (bundled with next/og). The share image is a JPEG kept well under 300 KB: WhatsApp silently
// drops previews whose image is too heavy, and doesn't render WebP previews reliably.

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const require = createRequire(import.meta.url);
const { ImageResponse } = require("next/og");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const out = (...segments) => path.join(ROOT, ...segments);

const NAVY = "#07243d";
const GOLD = "#c8a96a";
const GOLD_LIGHT = "#dbbf85";

/* ------------------------------------------------------------------ */
/* Diamond mark                                                         */
/* ------------------------------------------------------------------ */

/** Point at radius `r` and angle `deg` (clockwise from 12 o'clock) around the origin. */
function pt(r, deg) {
  const a = (deg * Math.PI) / 180;
  return `${+(r * Math.sin(a)).toFixed(2)} ${+(-r * Math.cos(a)).toFixed(2)}`;
}

/**
 * Face-up round brilliant, girdle radius 100 around the origin: two overlapping squares give
 * the table octagon + star facets; `detail` adds the upper-girdle facets out to the girdle.
 * With `fill`, the girdle becomes a solid disc and the facet lines are cut into it — the
 * filled form is what stays legible at favicon sizes.
 */
function brilliantMark({ stroke, strokeWidth, detail, fill }) {
  const STAR = 72;
  const polygon = (points) => `M${points.join("L")}Z`;
  const paths = [polygon([0, 90, 180, 270].map((d) => pt(STAR, d))), polygon([45, 135, 225, 315].map((d) => pt(STAR, d)))];

  if (detail) {
    const zigzag = [];
    for (let k = 0; k < 8; k++) zigzag.push(pt(STAR, 45 * k), pt(100, 45 * k + 22.5));
    paths.push(polygon(zigzag));
    for (let k = 0; k < 8; k++) paths.push(`M${pt(STAR, 45 * k)}L${pt(100, 45 * k)}`);
  }

  const disc = fill ? `<circle r="100" fill="${fill}"/>` : "";
  return `${disc}<g fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round" stroke-linecap="round">
    ${fill ? "" : '<circle r="100"/>'}
    ${paths.map((d) => `<path d="${d}"/>`).join("\n    ")}
  </g>`;
}

/** Navy tile with a gold diamond disc; `padding` is in mark units (girdle radius = 100). */
function iconSvg({ size, padding, detail, strokeWidth }) {
  const half = 100 + padding;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${-half} ${-half} ${half * 2} ${half * 2}">
  <rect x="${-half}" y="${-half}" width="${half * 2}" height="${half * 2}" fill="${NAVY}"/>
  ${brilliantMark({ stroke: NAVY, strokeWidth, detail, fill: GOLD })}
</svg>
`;
}

const png = (svg) => sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();

/** PNG-compressed ICO container (supported by every browser since IE Vista-era). */
function toIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  const directory = Buffer.alloc(16 * images.length);
  let offset = header.length + directory.length;
  images.forEach(({ size, data }, index) => {
    const o = index * 16;
    directory.writeUInt8(size >= 256 ? 0 : size, o);
    directory.writeUInt8(size >= 256 ? 0 : size, o + 1);
    directory.writeUInt8(0, o + 2);
    directory.writeUInt8(0, o + 3);
    directory.writeUInt16LE(1, o + 4);
    directory.writeUInt16LE(32, o + 6);
    directory.writeUInt32LE(data.length, o + 8);
    directory.writeUInt32LE(offset, o + 12);
    offset += data.length;
  });

  return Buffer.concat([header, directory, ...images.map((image) => image.data)]);
}

async function writeIcons() {
  // Small sizes drop the girdle facets and thicken the lines so the mark survives at 16 px.
  const small = (size) => iconSvg({ size, padding: 8, detail: false, strokeWidth: 15 });
  const large = (size) => iconSvg({ size, padding: 22, detail: true, strokeWidth: 5 });

  const ico = toIco(await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await png(small(size)) }))));
  fs.writeFileSync(out("src/app/favicon.ico"), ico);

  fs.writeFileSync(out("src/app/icon.svg"), iconSvg({ size: 32, padding: 8, detail: false, strokeWidth: 13 }));
  fs.writeFileSync(out("src/app/apple-icon.png"), await png(large(180)));

  fs.mkdirSync(out("public/icons"), { recursive: true });
  fs.writeFileSync(out("public/icons/icon-192.png"), await png(large(192)));
  fs.writeFileSync(out("public/icons/icon-512.png"), await png(large(512)));
  // Maskable icons get cropped to a circle/squircle by Android — keep the mark inside the
  // central 80% safe zone.
  fs.writeFileSync(out("public/icons/icon-maskable-512.png"), await png(iconSvg({ size: 512, padding: 70, detail: true, strokeWidth: 5 })));
}

/* ------------------------------------------------------------------ */
/* Default share image                                                 */
/* ------------------------------------------------------------------ */

const dataUri = (buffer, mime) => `data:${mime};base64,${buffer.toString("base64")}`;

/** The FOREVER logo recoloured for a navy background: blue lettering → white, gold diamond kept. */
async function lightLogo(width) {
  const { data, info } = await sharp(out("public/images/logo.png")).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 2] > data[i] + 40) data[i] = data[i + 1] = data[i + 2] = 255;
  }
  return sharp(data, { raw: info }).resize({ width, kernel: "lanczos3" }).png().toBuffer();
}

async function writeShareImage() {
  const WIDTH = 1200;
  const HEIGHT = 630;
  const PANEL = 580;

  const [logo, photo] = await Promise.all([
    lightLogo(330),
    // Home-page hero (two hands, two engagement rings) — cropped to the hands.
    sharp(out("public/banner1.webp"))
      .extract({ left: 860, top: 0, width: 1180, height: 1200 })
      .resize(WIDTH - PANEL, HEIGHT, { fit: "cover", position: "centre" })
      .jpeg({ quality: 90 })
      .toBuffer(),
  ]);
  const logoMeta = await sharp(logo).metadata();
  const watermark = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-104 -104 208 208">${brilliantMark({ stroke: GOLD, strokeWidth: 1.4, detail: true })}</svg>`
  );

  const corner = (position) => ({
    position: "absolute",
    width: 26,
    height: 26,
    borderColor: GOLD,
    ...position,
  });

  const response = new ImageResponse(
    {
      type: "div",
      props: {
        style: { display: "flex", width: "100%", height: "100%", position: "relative", backgroundColor: NAVY, fontFamily: "Geist" },
        children: [
          {
            type: "img",
            props: { src: dataUri(watermark, "image/svg+xml"), width: 420, height: 420, style: { position: "absolute", left: 300, top: 290, opacity: 0.08 } },
          },
          {
            type: "div",
            props: {
              style: { display: "flex", flexDirection: "column", justifyContent: "space-between", width: PANEL, height: "100%", padding: "64px 56px 56px 64px" },
              children: [
                { type: "img", props: { src: dataUri(logo, "image/png"), width: logoMeta.width, height: logoMeta.height } },
                {
                  type: "div",
                  props: {
                    style: { display: "flex", flexDirection: "column" },
                    children: [
                      {
                        type: "div",
                        props: { style: { fontSize: 17, letterSpacing: 5, color: GOLD_LIGHT, textTransform: "uppercase" }, children: "Certified Diamond Jewellery" },
                      },
                      {
                        type: "div",
                        props: {
                          style: { display: "flex", flexDirection: "column", marginTop: 22, fontFamily: "Playfair", fontSize: 68, lineHeight: 1.08, color: "#ffffff" },
                          children: [
                            { type: "div", props: { children: "Emotions," } },
                            {
                              type: "div",
                              props: { style: { display: "flex" }, children: ["Crafted in ", { type: "span", props: { style: { color: GOLD }, children: "Gold" } }] },
                            },
                          ],
                        },
                      },
                      {
                        type: "div",
                        props: {
                          style: { display: "flex", alignItems: "center", marginTop: 30 },
                          children: [
                            { type: "div", props: { style: { width: 56, height: 1, backgroundColor: GOLD } } },
                            { type: "div", props: { style: { width: 9, height: 9, margin: "0 12px", border: `1px solid ${GOLD}`, transform: "rotate(45deg)" } } },
                            { type: "div", props: { style: { width: 56, height: 1, backgroundColor: GOLD } } },
                          ],
                        },
                      },
                      {
                        type: "div",
                        props: { style: { marginTop: 26, fontSize: 19, color: "rgba(255,255,255,0.72)" }, children: "Engagement rings · Wedding bands · Fine jewellery" },
                      },
                    ],
                  },
                },
                {
                  type: "div",
                  props: { style: { fontSize: 17, letterSpacing: 3, color: "rgba(219,191,133,0.85)" }, children: "www.foreverjewelsinc.com" },
                },
              ],
            },
          },
          {
            type: "div",
            props: {
              style: { display: "flex", position: "relative", width: WIDTH - PANEL, height: "100%" },
              children: [
                { type: "img", props: { src: dataUri(photo, "image/jpeg"), width: WIDTH - PANEL, height: HEIGHT, style: { objectFit: "cover" } } },
                {
                  type: "div",
                  props: { style: { position: "absolute", left: 0, top: 0, width: 90, height: "100%", backgroundImage: `linear-gradient(90deg, ${NAVY}, rgba(7,36,61,0))` } },
                },
              ],
            },
          },
          // Thin inset frame + gold corner marks, echoing the site's "gift invitation" cards.
          { type: "div", props: { style: { position: "absolute", left: 16, top: 16, right: 16, bottom: 16, border: "1px solid rgba(255,255,255,0.14)" } } },
          { type: "div", props: { style: { ...corner({ left: 26, top: 26 }), borderLeftWidth: 1, borderTopWidth: 1 } } },
          { type: "div", props: { style: { ...corner({ right: 26, top: 26 }), borderRightWidth: 1, borderTopWidth: 1 } } },
          { type: "div", props: { style: { ...corner({ left: 26, bottom: 26 }), borderLeftWidth: 1, borderBottomWidth: 1 } } },
          { type: "div", props: { style: { ...corner({ right: 26, bottom: 26 }), borderRightWidth: 1, borderBottomWidth: 1 } } },
        ],
      },
    },
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        { name: "Playfair", data: fs.readFileSync(path.join(__dirname, "assets/Playfair-Regular.ttf")), weight: 400, style: "normal" },
        { name: "Geist", data: fs.readFileSync(require.resolve("next/dist/compiled/@vercel/og/Geist-Regular.ttf")), weight: 400, style: "normal" },
      ],
    }
  );

  const rendered = Buffer.from(await response.arrayBuffer());
  const jpeg = await sharp(rendered).flatten({ background: NAVY }).jpeg({ quality: 84, mozjpeg: true }).toBuffer();
  fs.writeFileSync(out("public/images/og-forever-jewels.jpg"), jpeg);
  return jpeg.length;
}

await writeIcons();
const shareBytes = await writeShareImage();
console.log(`Brand assets written (share image ${(shareBytes / 1024).toFixed(0)} KB).`);
