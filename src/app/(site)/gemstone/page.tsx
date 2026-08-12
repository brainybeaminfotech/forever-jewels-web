import type { Metadata } from "next";
import { StoneListingClient } from "@/components/stones";
import { getStonesByCategory, STONE_META } from "@/lib/stones";

export const metadata: Metadata = {
  title: STONE_META.gemstone.title,
  description: STONE_META.gemstone.description,
};

export default function GemstonePage() {
  const stones = getStonesByCategory("gemstone");
  return <StoneListingClient stones={stones} category="gemstone" />;
}
