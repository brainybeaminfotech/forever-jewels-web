import type { HeroSlide } from "@/types";
import { IMAGES } from "@/lib/images";

/**
 * Slides support `type: "video"` (pointing at a file in /public/videos)
 * for whenever real Forever Jewels footage replaces these image placeholders.
 */
export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "hero-1",
    type: "image",
    src: IMAGES.hero[0]!,
    align: "left",
    eyebrow: "The Forever Jewels Edit",
    title: "Emotions, Crafted in Gold",
    subtitle: "Certified diamonds. Hand-finished settings. Made to be treasured for generations.",
    ctaPrimary: { label: "Explore Collections", href: "/collections" },
    ctaSecondary: { label: "Book a Consultation", href: "/book-appointment" },
  },
  {
    id: "hero-2",
    type: "image",
    src: IMAGES.hero[1]!,
    align: "right",
    eyebrow: "Signature Engagement",
    title: "A Promise, Set in Stone",
    subtitle: "GIA-certified center stones, chosen one by one for exceptional fire and clarity.",
    ctaPrimary: { label: "Shop Engagement Rings", href: "/engagement" },
    ctaSecondary: { label: "Learn About Diamonds", href: "/diamonds" },
  },
];
