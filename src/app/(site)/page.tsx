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

export const metadata: Metadata = {
  title: "Fine Certified Diamond Jewelry",
  description:
    "Discover Forever Jewels — hand-finished engagement rings, wedding bands, and custom fine jewelry crafted with certified diamonds.",
};

export default function HomePage() {
  return (
    <>
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
