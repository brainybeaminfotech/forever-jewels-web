import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoneDetailClient } from "@/components/stones";
import { getStoneBySlug, getStonesByCategory } from "@/lib/stones";

interface DiamondStonePageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return getStonesByCategory("diamond").map((stone) => ({ id: stone.slug }));
}

export async function generateMetadata({ params }: DiamondStonePageProps): Promise<Metadata> {
  const { id } = await params;
  const stone = getStoneBySlug(id);
  if (!stone || stone.category !== "diamond") return {};
  const title = `${stone.caratWeight}ct ${stone.shape} Diamond`;
  return {
    title,
    description: `Certified ${stone.caratWeight}ct ${stone.shape} diamond — ${[stone.color, stone.clarity].filter(Boolean).join(", ")}.`,
    ...(stone.image ? { openGraph: { images: [stone.image] } } : {}),
  };
}

export default async function DiamondStonePage({ params }: DiamondStonePageProps) {
  const { id } = await params;
  const stone = getStoneBySlug(id);
  if (!stone || stone.category !== "diamond") notFound();
  return <StoneDetailClient stone={stone} />;
}
