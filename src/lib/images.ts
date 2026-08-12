/**
 * Central registry of imagery used across the site.
 * All images are stored locally in /public/images/.
 * Swap any path here to update the image everywhere it's referenced —
 * keeps real-asset replacement a one-file change.
 */

export const IMAGES = {
  hero: [
    "/banner1.webp",
    "/banner2.png",
  ],
  categories: {
    rings: "/category/ring.webp",
    engagementRings: "/category/ring.webp",
    weddingRings: "/category/ring.webp",
    earrings: "/category/earring.webp",
    necklaces: "/category/neckalce.webp",
    bracelets: "/category/bravelet.webp",
    pendants: "/category/pendent.jpg",
    customJewellery: "/images/cat-custom-jewellery.jpg",
  },
  products: [
    "/images/product-1.jpg",
    "/images/product-2.jpg",
    "/images/product-3.jpg",
    "/images/product-4.jpg",
    "/images/product-5.jpg",
    "/images/product-6.jpg",
    "/images/product-7.jpg",
    "/images/product-8.jpg",
  ],
  handcrafted: {
    primary: "/images/handcrafted-primary.webp",
    secondary: "/images/handcrafted-secondary.webp",
  },
  collections: [
    "/images/collection-1.webp",
    "/images/collection-2.webp",
    "/images/collection-3.webp",
    "/images/collection-4.webp",
  ],
  testimonials: [
    "/images/testimonial-1.jpg",
    "/images/testimonial-2.jpg",
    "/images/testimonial-3.jpg",
    "/images/testimonial-4.jpg",
    "/images/testimonial-5.jpg",
    "/images/testimonial-6.jpg",
  ],
  blog: [
    "/images/blog-1.jpg",
    "/images/blog-2.jpg",
    "/images/blog-3.jpg",
    "/images/blog-4.jpg",
  ],
  instagram: [
    "/images/instagram-1.webp",
    "/images/instagram-2.jpg",
    "/images/instagram-3.jpg",
    "/images/instagram-4.jpg",
    "/images/instagram-5.jpg",
    "/images/instagram-6.webp",
    "/images/instagram-7.jpg",
    "/images/instagram-8.jpg",
  ],
  og: "/images/og.jpg",
} as const;
