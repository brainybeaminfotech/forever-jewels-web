import type { ProductCategory } from "@/types";
import { IMAGES } from "@/lib/images";
import { getProductsByCategory } from "@/lib/catalog";

export const CATEGORIES: ProductCategory[] = [
  {
    id: "cat-1",
    slug: "engagement-rings",
    title: "Engagement Rings",
    description: "Timeless solitaires and halo settings for your forever moment.",
    image: IMAGES.categories.engagementRings,
    productCount: getProductsByCategory("rings").length,
  },
  {
    id: "cat-2",
    slug: "wedding-rings",
    title: "Wedding Rings",
    description: "Bands crafted to be worn every day, for every day after.",
    image: IMAGES.categories.weddingRings,
    productCount: getProductsByCategory("rings").length,
  },
  {
    id: "cat-3",
    slug: "earrings",
    title: "Earrings",
    description: "From delicate studs to statement drops, in diamond and gold.",
    image: IMAGES.categories.earrings,
    productCount: getProductsByCategory("earrings").length,
  },
  {
    id: "cat-4",
    slug: "necklaces",
    title: "Necklaces",
    description: "Layerable chains and pendants for effortless elegance.",
    image: IMAGES.categories.necklaces,
    productCount: getProductsByCategory("necklaces").length,
  },
  {
    id: "cat-5",
    slug: "bracelets",
    title: "Bracelets",
    description: "Tennis, bangle, and chain bracelets in fine metals.",
    image: IMAGES.categories.bracelets,
    productCount: getProductsByCategory("bracelets").length,
  },
  {
    id: "cat-6",
    slug: "pendants",
    title: "Pendants",
    description: "Signature pieces designed to be the center of attention.",
    image: IMAGES.categories.pendants,
    productCount: getProductsByCategory("pendants").length,
  },
  {
    id: "cat-7",
    slug: "custom-jewellery",
    title: "Custom Jewellery",
    description: "Work with our designers to create a one-of-one heirloom.",
    image: IMAGES.categories.customJewellery,
    productCount: 0,
  },
];
