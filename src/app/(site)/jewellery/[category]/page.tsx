import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingClient } from "@/components/jewellery";
import { CATEGORY_META, JEWELLERY_CATEGORIES, isJewelleryCategory } from "@/lib/catalog";
import { getProductsByCategoryFromApi } from "@framework/product/get-all-products";
import { JsonLd } from "@/components/common";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

/** Revalidate the featured-product feed every 5 minutes (ISR). */
export const revalidate = 300;

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return JEWELLERY_CATEGORIES.map((category) => ({ category }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  if (!isJewelleryCategory(category)) return {};
  const meta = CATEGORY_META[category];
  return pageMetadata({ title: meta.title, description: meta.description, path: `/jewellery/${category}` });
}

export default async function JewelleryCategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  if (!isJewelleryCategory(category)) notFound();

  // Live API data only — no static-catalog fallback, so the grid always reflects the DB.
  const products = await getProductsByCategoryFromApi(category, { currency: "USD", revalidate });

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: CATEGORY_META[category].label, path: `/jewellery/${category}` },
        ])}
      />
      <ListingClient products={products} category={category} />
    </>
  );
}
