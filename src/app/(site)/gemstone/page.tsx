import type { Metadata } from "next";
import { StoneComingSoon } from "@/components/stones";
import { STONE_META } from "@/lib/stones";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: STONE_META.gemstone.title,
  description: `Coming soon — ${STONE_META.gemstone.description}`,
  path: "/gemstone",
});

export default function GemstonePage() {
  return <StoneComingSoon category="gemstone" />;
}
