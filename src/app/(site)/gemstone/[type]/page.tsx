import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoneComingSoon } from "@/components/stones";
import { GEMSTONE_TYPE_SLUGS, pluralizeGemType, resolveGemstoneTypeSlug, STONE_META } from "@/lib/stones";

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
  if (!resolveGemstoneTypeSlug(type)) notFound();
  return <StoneComingSoon category="gemstone" />;
}
