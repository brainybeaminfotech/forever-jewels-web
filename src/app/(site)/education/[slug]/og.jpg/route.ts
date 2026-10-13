import { readFile } from "node:fs/promises";
import path from "node:path";
import { EDUCATION_ARTICLES, getEducationArticle } from "@/data/education";
import { composeShareImage, defaultShareImage, jpegResponse } from "@/lib/share-image";

/**
 * Link-preview card for an education article (`og:image` of /education/[slug]). Articles are
 * static, so every card is rendered at build time — where `public/` is on disk — and served as
 * a static file afterwards.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return EDUCATION_ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getEducationArticle(slug);
  if (!article) return new Response("Not found", { status: 404 });

  try {
    const photo = await readFile(path.join(process.cwd(), "public", article.image));
    return jpegResponse(await composeShareImage(photo, "cover"));
  } catch {
    return jpegResponse(await defaultShareImage());
  }
}
