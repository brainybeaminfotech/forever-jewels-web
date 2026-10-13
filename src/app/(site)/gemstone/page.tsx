import type { Metadata } from "next";
import { StoneComingSoon } from "@/components/stones";
import { STONE_META } from "@/lib/stones";

export const metadata: Metadata = {
  title: STONE_META.gemstone.title,
  description: STONE_META.gemstone.description,
};

export default function GemstonePage() {
  return <StoneComingSoon category="gemstone" />;
}
