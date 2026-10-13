import { getProductDetailBySlug } from "@framework/product/get-product-details";
import { composeShareImage, defaultShareImage, jpegResponse } from "@/lib/share-image";

/**
 * Link-preview card for a product (`og:image` of /products/[slug]) — see lib/share-image.ts.
 * Rendered on first request, then cached for a day (same on-demand ISR as the product page).
 */
export const revalidate = 86400;

export function generateStaticParams() {
  return [];
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductDetailBySlug(slug, { currency: "USD", revalidate: 300 });
  if (!product) return new Response("Not found", { status: 404 });

  try {
    const photo = await fetch(product.image, { next: { revalidate } });
    if (!photo.ok) throw new Error(`Product photo returned ${photo.status}`);
    return jpegResponse(await composeShareImage(await photo.arrayBuffer(), "contain"));
  } catch {
    // A preview with the brand card beats no preview at all.
    return jpegResponse(await defaultShareImage());
  }
}
