import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoneComingSoon } from "@/components/stones";
import { getStoneBySlug, getStonesByCategory, STONE_META } from "@/lib/stones";
import { pageMetadata } from "@/lib/seo";

interface DiamondStonePageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return getStonesByCategory("diamond").map((stone) => ({ id: stone.slug }));
}

// Every diamond route renders the same "Coming Soon" page for now, so all of them declare
// /diamonds as canonical — otherwise Google sees hundreds of duplicate pages. Point these back
// at their own paths when the real listing/detail pages return.
export const metadata: Metadata = pageMetadata({
  title: STONE_META.diamond.title,
  description: `Coming soon — ${STONE_META.diamond.description}`,
  path: "/diamonds",
});

export default async function DiamondStonePage({ params }: DiamondStonePageProps) {
  const { id } = await params;
  const stone = getStoneBySlug(id);
  if (!stone || stone.category !== "diamond") notFound();
  return <StoneComingSoon category="diamond" />;
}
