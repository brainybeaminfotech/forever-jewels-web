import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoneComingSoon } from "@/components/stones";
import { getStoneBySlug, getStonesByCategory, STONE_META } from "@/lib/stones";

interface DiamondStonePageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return getStonesByCategory("diamond").map((stone) => ({ id: stone.slug }));
}

export const metadata: Metadata = {
  title: STONE_META.diamond.title,
  description: STONE_META.diamond.description,
};

export default async function DiamondStonePage({ params }: DiamondStonePageProps) {
  const { id } = await params;
  const stone = getStoneBySlug(id);
  if (!stone || stone.category !== "diamond") notFound();
  return <StoneComingSoon category="diamond" />;
}
