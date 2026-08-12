import type { Metadata } from "next";
import { StoneListingClient } from "@/components/stones";
import { getStonesByCategory, STONE_META } from "@/lib/stones";

export const metadata: Metadata = {
  title: STONE_META.diamond.title,
  description: STONE_META.diamond.description,
};

export default function DiamondsPage() {
  const stones = getStonesByCategory("diamond");
  return <StoneListingClient stones={stones} category="diamond" />;
}
