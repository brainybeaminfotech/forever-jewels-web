import type { Metadata } from "next";
import { WishlistClient } from "@/components/commerce";
import { PageHero } from "@/components/content";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "The pieces you have saved.",
  robots: { index: false, follow: true },
};

export default function WishlistPage() {
  return (
    <>
      <PageHero eyebrow="Saved Pieces" title="Wishlist" />
      <WishlistClient />
    </>
  );
}
