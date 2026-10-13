import type { Metadata } from "next";
import { StoneComingSoon } from "@/components/stones";
import { STONE_META } from "@/lib/stones";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: STONE_META.diamond.title,
  description: `Coming soon — ${STONE_META.diamond.description}`,
  path: "/diamonds",
});

export default function DiamondsPage() {
  return <StoneComingSoon category="diamond" />;
}
