import type { Collection } from "@/types";
import { IMAGES } from "@/lib/images";

export const SIGNATURE_COLLECTIONS: Collection[] = [
  {
    id: "col-1",
    slug: "the-ruby-riviera",
    title: "The Ruby Riviera",
    subtitle: "Ruby Tennis Bracelets",
    description:
      "Oval-cut rubies, each held in polished gold prongs, circle the wrist in an unbroken line of deep red — vivid enough for evening, easy enough for every day.",
    image: IMAGES.collections[0]!,
    ctaLabel: "Shop Bracelets",
    href: "/jewellery/bracelets",
    piecesCount: 18,
  },
  {
    id: "col-2",
    slug: "the-ruby-halo",
    title: "The Ruby Halo",
    subtitle: "Ruby Rings",
    description:
      "An emerald-cut ruby, bezel-set in yellow gold and framed by a halo of brilliant diamonds — a vivid statement on a slim gold band, made to be worn every day.",
    image: IMAGES.collections[4]!,
    ctaLabel: "Shop Ruby Rings",
    href: "/jewellery/rings?subCategory=Ruby+Ring",
    piecesCount: 22,
  },
  {
    id: "col-3",
    slug: "the-emerald-drop",
    title: "The Emerald Drop",
    subtitle: "Emerald Pendants",
    description:
      "An emerald-cut emerald held in gold claws, crowned by a marquise diamond and a leaf of pavé diamonds — a vivid drop of green on a fine white-gold chain.",
    image: IMAGES.collections[2]!,
    ctaLabel: "Shop Necklaces",
    href: "/jewellery/necklaces",
    piecesCount: 41,
  },
  {
    id: "col-4",
    slug: "ruby-radiance",
    title: "Ruby Radiance",
    subtitle: "Ruby Pendants",
    description:
      "A deep-red ruby in a classic emerald cut, wrapped in a halo of brilliant diamonds and hung from a diamond-set bail — polished white gold from chain to claw.",
    image: IMAGES.collections[3]!,
    ctaLabel: "Shop Pendants",
    href: "/jewellery/pendants",
    piecesCount: 15,
  },
];
