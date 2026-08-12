import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoneListingClient } from "@/components/stones";
import {
  DIAMOND_GROWTH_SLUGS,
  DIAMOND_SHAPE_SLUGS,
  getStonesByCategory,
  resolveDiamondFilterSlug,
  STONE_META,
  type StoneFilters,
} from "@/lib/stones";

interface DiamondFilterPageProps {
  params: Promise<{ filter: string }>;
}

export function generateStaticParams() {
  return [...DIAMOND_SHAPE_SLUGS, ...DIAMOND_GROWTH_SLUGS, "loose"].map((filter) => ({ filter }));
}

function pageTitleFor(resolution: NonNullable<ReturnType<typeof resolveDiamondFilterSlug>>) {
  if (resolution.kind === "shape") return `${resolution.value} Diamonds`;
  if (resolution.kind === "growthType") return `${resolution.value === "lab-grown" ? "Lab-Grown" : "Natural"} Diamonds`;
  return undefined;
}

export async function generateMetadata({ params }: DiamondFilterPageProps): Promise<Metadata> {
  const { filter } = await params;
  const resolution = resolveDiamondFilterSlug(filter);
  if (!resolution) return {};
  return {
    title: pageTitleFor(resolution) ?? STONE_META.diamond.title,
    description: STONE_META.diamond.description,
  };
}

export default async function DiamondFilterPage({ params }: DiamondFilterPageProps) {
  const { filter } = await params;
  const resolution = resolveDiamondFilterSlug(filter);
  if (!resolution) notFound();

  const stones = getStonesByCategory("diamond");
  const initialFilters: Partial<StoneFilters> =
    resolution.kind === "shape" ? { shape: [resolution.value] } : resolution.kind === "growthType" ? { growthType: [resolution.value] } : {};

  return <StoneListingClient stones={stones} category="diamond" initialFilters={initialFilters} pageTitle={pageTitleFor(resolution)} />;
}
