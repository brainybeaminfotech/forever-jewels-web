import type { Collection } from "@/types";
import { IMAGES } from "@/lib/images";

export const SIGNATURE_COLLECTIONS: Collection[] = [
  {
    id: "col-1",
    slug: "the-diamond-lattice",
    title: "The Diamond Lattice",
    subtitle: "Statement Bangles",
    description:
      "An openwork lattice of pavé diamonds wraps the wrist in continuous brilliance — bold enough for evening, refined enough for every day.",
    image: IMAGES.collections[0]!,
    ctaLabel: "Shop Bangles",
    href: "/jewellery/bracelets",
    piecesCount: 18,
  },
  {
    id: "col-2",
    slug: "the-pearl-accent",
    title: "The Pearl Accent",
    subtitle: "Modern Heirlooms",
    description:
      "A single freshwater pearl meets a bypass of pavé diamonds in rose gold — a modern take on a design passed down for generations.",
    image: IMAGES.collections[1]!,
    ctaLabel: "Shop Bracelets",
    href: "/jewellery/bracelets",
    piecesCount: 22,
  },
  {
    id: "col-3",
    slug: "modern-minimal",
    title: "Modern Minimal",
    subtitle: "Everyday Luxury",
    description:
      "A single brilliant-cut diamond, halo-set in gold and finished on a fine chain — clean lines designed for daily wear without ever compromising on brilliance.",
    image: IMAGES.collections[2]!,
    ctaLabel: "Shop Necklaces",
    href: "/jewellery/necklaces",
    piecesCount: 41,
  },
  {
    id: "col-4",
    slug: "celestial-charms",
    title: "Celestial Charms",
    subtitle: "Playful Fine Jewelry",
    description:
      "Pavé-set star pendants in polished gold — a lighter, whimsical layer for stacking necklaces or wearing on their own.",
    image: IMAGES.collections[3]!,
    ctaLabel: "Shop Pendants",
    href: "/jewellery/pendants",
    piecesCount: 15,
  },
];
