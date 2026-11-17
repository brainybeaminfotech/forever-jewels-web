import type { Metadata } from "next";
import { CheckoutClient } from "@/components/commerce";
import { PageHero } from "@/components/content";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your order securely.",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ canceled?: string }> }) {
  const { canceled } = await searchParams;

  return (
    <>
      <PageHero eyebrow="Secure Checkout" title="Checkout" breadcrumb={[{ label: "Your Bag", href: "/cart" }]} />
      <CheckoutClient canceled={canceled === "1"} />
    </>
  );
}
