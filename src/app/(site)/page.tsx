import type { Metadata } from "next";
import {
  HeroSlider,
  ExploreProducts,
  NewArrivals,
  HandcraftedDiamonds,
  SignatureCollections,
  Testimonials,
  Blogs,
  FAQs,
  MarketingPopup,
} from "@/components/home";
import { JsonLd } from "@/components/common";
import { organizationJsonLd, pageMetadata, websiteJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Fine Certified Diamond Jewelry",
  description: "Discover Forever Jewels — hand-finished engagement rings, wedding bands, and custom fine jewelry crafted with certified diamonds.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      <HeroSlider />
      <ExploreProducts />
      <NewArrivals />
      <HandcraftedDiamonds />
      <SignatureCollections />
      <Testimonials />
      <Blogs />
      <FAQs />
      <MarketingPopup />
    </>
  );
}
