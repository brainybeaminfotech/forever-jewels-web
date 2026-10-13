import type { StoneCategory } from "@/types";

export interface StoneComingSoonCopy {
  /** Category name — used for the eyebrow and the breadcrumb. */
  label: string;
  headline: string;
  description: string;
  /** A stone's journey to the showcase; everything before `currentStage` is complete. */
  stages: string[];
  currentStage: number;
  statusLine: string;
  guide: { label: string; href: string };
  expertLabel: string;
  closingLine: string;
}

export const STONE_COMING_SOON: Record<StoneCategory, StoneComingSoonCopy> = {
  diamond: {
    label: "Loose Diamonds",
    headline: "Still on the cutter’s wheel.",
    description:
      "Our collection of certified loose diamonds is being sourced, cut, polished and graded — one facet at a time. Brilliance can’t be rushed, but it’s almost ready to catch the light.",
    stages: ["Sourced", "Cut", "Polished", "Graded", "Revealed"],
    currentStage: 3,
    statusLine: "Now grading every stone for cut, colour, clarity and carat.",
    guide: { label: "Learn the 4Cs", href: "/education/4cs" },
    expertLabel: "Speak to a diamond expert",
    closingLine: "A diamond is cut only once — so we’re taking our time.",
  },
  gemstone: {
    label: "Loose Gemstones",
    headline: "Colour, coming to light.",
    description:
      "Sapphires, rubies, emeralds and more are being hand-selected, cut and certified for our loose gemstone collection. Every hue is being faceted to its fullest fire — and it’s nearly ready to shine.",
    stages: ["Sourced", "Cut", "Polished", "Certified", "Revealed"],
    currentStage: 3,
    statusLine: "Now certifying every stone with independent gemological laboratories.",
    guide: { label: "Gemstone Guide", href: "/education/gemstone-guide" },
    expertLabel: "Speak to a gemstone expert",
    closingLine: "The finest colour can’t be rushed — only revealed.",
  },
};
