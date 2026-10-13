import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/components/jewellery";
import { getProductDetailBySlug } from "@framework/product/get-product-details";
import { getProductsByCategoryFromApi } from "@framework/product/get-all-products";
import { JsonLd } from "@/components/common";
import { CATEGORY_META } from "@/lib/catalog";
import { breadcrumbJsonLd, pageMetadata, productJsonLd, SHARE_CARD_SIZE } from "@/lib/seo";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

/** Revalidate product detail every 5 minutes (ISR). */
export const revalidate = 300;

/**
 * Rendered on demand and then cached. The catalog holds hundreds of products across five
 * categories, so prerendering every detail page at build time would mean one API call per
 * product on every build for pages most visitors never open.
 */
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductDetailBySlug(slug, { currency: "USD", revalidate });
  if (!product) return {};
  return {
    ...pageMetadata({
      title: product.name,
      description: product.description ?? `${product.name} — ${product.metal ?? ""} ${product.gem ?? ""}`.trim(),
      path: `/products/${product.slug}`,
      // The API's photos are WebP served as octet-stream, which chat apps won't preview —
      // og.jpg/route.ts re-renders this product's photo as a JPEG card.
      image: { url: `/products/${product.slug}/og.jpg`, ...SHARE_CARD_SIZE, type: "image/jpeg", alt: product.name },
    }),
    other: {
      "product:price:amount": product.price.toFixed(2),
      "product:price:currency": product.currency,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductDetailBySlug(slug, { currency: "USD", revalidate });
  if (!product) notFound();

  // Related products come from the same category feed, so the detail page never falls
  // back to static mock products alongside live API data.
  const categoryProducts = product.jewelleryCategory
    ? await getProductsByCategoryFromApi(product.jewelleryCategory, { currency: "USD", revalidate })
    : [];
  const related = categoryProducts.filter((p) => p.id !== product.id).slice(0, 4);

  const path = `/products/${product.slug}`;
  const category = product.jewelleryCategory ? CATEGORY_META[product.jewelleryCategory] : undefined;
  const breadcrumb = [
    { name: "Home", path: "/" },
    ...(category ? [{ name: category.label, path: `/jewellery/${category.slug}` }] : []),
    { name: product.name, path },
  ];

  return (
    <>
      <JsonLd data={[productJsonLd(product, path), breadcrumbJsonLd(breadcrumb)]} />
      <ProductDetailClient product={product} related={related} />
    </>
  );
}
