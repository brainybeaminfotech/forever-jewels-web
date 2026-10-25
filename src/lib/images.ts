/**
 * Central registry of imagery used across the site.
 * All images are stored locally in /public/images/.
 * Swap any path here to update the image everywhere it's referenced —
 * keeps real-asset replacement a one-file change.
 */

export const IMAGES = {
  hero: [
    "/banner1.webp",
    "/banner2.webp",
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
    primary: "/images/handcrafted-primary.png",
    secondary: "/images/handcrafted-secondary.png",
  },
  collections: [
    "/images/collection-1.png",
    "/images/collection-2.png",
    "/images/collection-3.png",
    "/images/collection-4.png",
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
} as const;

/**
 * True for absolute (API/S3) image URLs. Pass as `unoptimized` on `next/image` for
 * product photos: they're already small `.webp` files, and routing every catalog photo
 * × every `srcSet` width through Vercel's `/_next/image` optimizer exhausts the plan's
 * image-optimization quota — after which it answers 402
 * (`OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED`) and product tiles render blank in
 * production while localhost still works. Local `/public` assets stay optimized.
 */
export function isRemoteImage(src: string | null | undefined): boolean {
  return typeof src === "string" && /^https?:\/\//i.test(src);
}
