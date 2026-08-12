import type { Testimonial } from "@/types";
import { IMAGES } from "@/lib/images";

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "rev-1",
    name: "Sophia Bennett",
    location: "New York, NY",
    rating: 5,
    review:
      "The custom design process felt like true collaboration. My engagement ring is exactly what I imagined — and the craftsmanship exceeded it.",
    image: IMAGES.testimonials[0]!,
    productPurchased: "Aurelia Solitaire Ring",
  },
  {
    id: "rev-2",
    name: "James Whitfield",
    location: "Chicago, IL",
    rating: 5,
    review:
      "From consultation to delivery, every step was handled with care. The team explained the 4Cs without any pressure and helped us stay on budget.",
    image: IMAGES.testimonials[1]!,
    productPurchased: "Halo Eternity Band",
  },
  {
    id: "rev-3",
    name: "Amara Chen",
    location: "San Francisco, CA",
    rating: 5,
    review:
      "The necklace arrived beautifully packaged and the diamond has incredible fire. It's become my everyday piece.",
    image: IMAGES.testimonials[2]!,
    productPurchased: "Opaline Pendant Necklace",
  },
  {
    id: "rev-4",
    name: "Daniel Ortiz",
    location: "Austin, TX",
    rating: 4.5,
    review:
      "Exceptional quality and honest guidance. They helped me choose a lab-grown diamond that looks every bit as brilliant as natural.",
    image: IMAGES.testimonials[3]!,
    productPurchased: "Signet Heirloom Ring",
  },
  {
    id: "rev-5",
    name: "Isabella Moreau",
    location: "Miami, FL",
    rating: 5,
    review:
      "Forever Jewels turned my grandmother's stone into a modern setting I'll wear forever. The result brought me to tears.",
    image: IMAGES.testimonials[4]!,
    productPurchased: "Bespoke Atelier Ring",
  },
  {
    id: "rev-6",
    name: "Michael Reyes",
    location: "Seattle, WA",
    rating: 5,
    review:
      "Communication was clear at every stage, and the ring resizing service after delivery was fast and free.",
    image: IMAGES.testimonials[5]!,
    productPurchased: "Verity Tennis Bracelet",
  },
];
