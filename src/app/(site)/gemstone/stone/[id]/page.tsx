import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoneComingSoon } from "@/components/stones";
import { getStoneBySlug, getStonesByCategory, STONE_META } from "@/lib/stones";
import { pageMetadata } from "@/lib/seo";

interface GemstoneStonePageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return getStonesByCategory("gemstone").map((stone) => ({ id: stone.slug }));
}

// Every gemstone route renders the same "Coming Soon" page for now, so all of them declare
// /gemstone as canonical — otherwise Google sees hundreds of duplicate pages. Point these back
// at their own paths when the real listing/detail pages return.
export const metadata: Metadata = pageMetadata({
  title: STONE_META.gemstone.title,
  description: `Coming soon — ${STONE_META.gemstone.description}`,
  path: "/gemstone",
});

export default async function GemstoneStonePage({ params }: GemstoneStonePageProps) {
  const { id } = await params;
  const stone = getStoneBySlug(id);
  if (!stone || stone.category !== "gemstone") notFound();
  return <StoneComingSoon category="gemstone" />;
}
