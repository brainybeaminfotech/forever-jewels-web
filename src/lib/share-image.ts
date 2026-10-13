import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { SHARE_CARD_SIZE } from "@/lib/seo";

/**
 * Link-preview cards for pages that have their own photo (product, education article).
 *
 * The source photos can't be used as og:image directly: product shots are `.webp` served by S3
 * as `application/octet-stream` (WhatsApp and Facebook drop the preview for both reasons), and
 * several article images are multi-MB PNGs (WhatsApp skips heavy images). These cards are
 * always a 1200×630 JPEG of ~50–150 KB.
 *
 * Paths are literal `process.cwd()` joins on purpose — Next's output tracing follows that
 * pattern and bundles the files into the server function.
 */

const { width: WIDTH, height: HEIGHT } = SHARE_CARD_SIZE;
const PLATE_PADDING = { x: 20, y: 14 };
const PLATE_INSET = 32;

/** The logo on a white plate, bottom-left, so the card reads as ours even with the title cut off. */
async function logoPlate() {
  const logo = await readFile(path.join(process.cwd(), "public/images/logo.png"));
  const { width = 266, height = 51 } = await sharp(logo).metadata();
  const plate = await sharp({
    create: {
      width: width + PLATE_PADDING.x * 2,
      height: height + PLATE_PADDING.y * 2,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 0.94 },
    },
  })
    .composite([{ input: logo, left: PLATE_PADDING.x, top: PLATE_PADDING.y }])
    .png()
    .toBuffer();
  return { plate, height: height + PLATE_PADDING.y * 2 };
}

/**
 * `contain` — studio packshots: the whole piece stays in frame, centred over a blurred
 * enlargement of the same photo so any aspect ratio fills the card without bars or seams.
 * `cover` — editorial photos: cropped to the card, keeping the most detailed region.
 */
export async function composeShareImage(photo: ArrayBuffer | Buffer, fit: "contain" | "cover"): Promise<Buffer> {
  const source = sharp(Buffer.from(photo as ArrayBuffer)).rotate();

  let base: Buffer;
  if (fit === "cover") {
    base = await source.resize(WIDTH, HEIGHT, { fit: "cover", position: "attention" }).toBuffer();
  } else {
    const [backdrop, subject] = await Promise.all([
      source.clone().resize(WIDTH, HEIGHT, { fit: "cover" }).blur(40).toBuffer(),
      source.clone().resize(WIDTH, HEIGHT, { fit: "inside" }).toBuffer(),
    ]);
    base = await sharp(backdrop).composite([{ input: subject, gravity: "centre" }]).toBuffer();
  }

  const { plate, height } = await logoPlate();
  return sharp(base)
    .composite([{ input: plate, left: PLATE_INSET, top: HEIGHT - height - PLATE_INSET }])
    .flatten({ background: "#ffffff" })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
}

/** The site-wide card (SITE.ogImage) — served when a page's own photo can't be fetched. */
export function defaultShareImage(): Promise<Buffer> {
  return readFile(path.join(process.cwd(), "public/images/og-forever-jewels.jpg"));
}

export function jpegResponse(body: Buffer): Response {
  return new Response(new Uint8Array(body), {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
