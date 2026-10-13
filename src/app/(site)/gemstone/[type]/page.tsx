import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoneComingSoon } from "@/components/stones";
import { GEMSTONE_TYPE_SLUGS, pluralizeGemType, resolveGemstoneTypeSlug, STONE_META } from "@/lib/stones";
import { pageMetadata } from "@/lib/seo";

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
  // Same "Coming Soon" page as /gemstone for now — canonical to the hub (see gemstone/stone/[id]).
  return pageMetadata({
    title: `Loose ${pluralizeGemType(gemstoneType)}`,
    description: `Coming soon — ${STONE_META.gemstone.description}`,
    path: "/gemstone",
  });
}

export default async function GemstoneTypePage({ params }: GemstoneTypePageProps) {
  const { type } = await params;
  if (!resolveGemstoneTypeSlug(type)) notFound();
  return <StoneComingSoon category="gemstone" />;
}
