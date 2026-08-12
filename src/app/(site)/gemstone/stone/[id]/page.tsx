import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoneDetailClient } from "@/components/stones";
import { getStoneBySlug, getStonesByCategory } from "@/lib/stones";

interface GemstoneStonePageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return getStonesByCategory("gemstone").map((stone) => ({ id: stone.slug }));
}

export async function generateMetadata({ params }: GemstoneStonePageProps): Promise<Metadata> {
  const { id } = await params;
  const stone = getStoneBySlug(id);
  if (!stone || stone.category !== "gemstone") return {};
  const title = `${stone.caratWeight}ct ${stone.gemstoneType} ${stone.shape}`;
  return {
    title,
    description: `Certified ${stone.caratWeight}ct ${stone.gemstoneType} ${stone.shape} — ${[stone.colorLabel, stone.clarity].filter(Boolean).join(", ")}.`,
  };
}

export default async function GemstoneStonePage({ params }: GemstoneStonePageProps) {
  const { id } = await params;
  const stone = getStoneBySlug(id);
  if (!stone || stone.category !== "gemstone") notFound();
  return <StoneDetailClient stone={stone} />;
}
