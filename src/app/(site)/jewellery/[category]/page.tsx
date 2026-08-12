import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingClient } from "@/components/jewellery";
import { CATEGORY_META, JEWELLERY_CATEGORIES, getProductsByCategory, isJewelleryCategory } from "@/lib/catalog";

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
  return {
    title: meta.title,
    description: meta.description,
  };
}

export default async function JewelleryCategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  if (!isJewelleryCategory(category)) notFound();

  const products = getProductsByCategory(category);

  return <ListingClient products={products} category={category} />;
}
