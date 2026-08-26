import type { Metadata } from "next";
import { CartClient } from "@/components/commerce";
import { PageHero } from "@/components/content";

export const metadata: Metadata = {
  title: "Your Bag",
  description: "Review the pieces in your bag before checkout.",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <>
      <PageHero eyebrow="Shopping Bag" title="Your Bag" />
      <CartClient />
    </>
  );
}
