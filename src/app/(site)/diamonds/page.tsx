import type { Metadata } from "next";
import { StoneComingSoon } from "@/components/stones";
import { STONE_META } from "@/lib/stones";

export const metadata: Metadata = {
  title: STONE_META.diamond.title,
  description: STONE_META.diamond.description,
};

export default function DiamondsPage() {
  return <StoneComingSoon category="diamond" />;
}
