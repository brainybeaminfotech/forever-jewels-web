import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoneListingClient } from "@/components/stones";
import { GEMSTONE_TYPE_SLUGS, getStonesByCategory, pluralizeGemType, resolveGemstoneTypeSlug, STONE_META, type StoneFilters } from "@/lib/stones";

interface GemstoneTypePageProps {
  params: Promise<{ type: string }>;
}

export function generateStaticParams() {
  return GEMSTONE_TYPE_SLUGS.map((type) => ({ type }));
}

export async function generateMetadata({ params }: GemstoneTypePageProps): Promise<Metadata> {
  const { type } = await params;
  const gemstoneType = resolveGemstoneTypeSlug(type);
  if (!gemstoneType) return {};
  return { title: `Loose ${pluralizeGemType(gemstoneType)}`, description: STONE_META.gemstone.description };
}

export default async function GemstoneTypePage({ params }: GemstoneTypePageProps) {
  const { type } = await params;
  const gemstoneType = resolveGemstoneTypeSlug(type);
  if (!gemstoneType) notFound();

  const stones = getStonesByCategory("gemstone");
  const initialFilters: Partial<StoneFilters> = { gemstoneType: [gemstoneType] };

  return <StoneListingClient stones={stones} category="gemstone" initialFilters={initialFilters} pageTitle={`Loose ${pluralizeGemType(gemstoneType)}`} />;
}
