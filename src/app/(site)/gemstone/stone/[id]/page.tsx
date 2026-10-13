import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoneComingSoon } from "@/components/stones";
import { getStoneBySlug, getStonesByCategory, STONE_META } from "@/lib/stones";

interface GemstoneStonePageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return getStonesByCategory("gemstone").map((stone) => ({ id: stone.slug }));
}

export const metadata: Metadata = {
  title: STONE_META.gemstone.title,
  description: STONE_META.gemstone.description,
};

export default async function GemstoneStonePage({ params }: GemstoneStonePageProps) {
  const { id } = await params;
  const stone = getStoneBySlug(id);
  if (!stone || stone.category !== "gemstone") notFound();
  return <StoneComingSoon category="gemstone" />;
}
