import type { BlogPost } from "@/types";
import { IMAGES } from "@/lib/images";

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "blog-1",
    slug: "how-to-choose-a-diamond-shape",
    title: "How to Choose the Right Diamond Shape",
    excerpt:
      "From round brilliant to emerald cut, every shape tells a different story. Here's how to find the one that suits your style.",
    image: IMAGES.blog[0]!,
    category: "Diamond Education",
    date: "2026-06-02",
    readTime: "6 min read",
    author: "Forever Jewels Editorial",
  },
  {
    id: "blog-2",
    slug: "the-4cs-explained",
    title: "The 4Cs Explained: Cut, Color, Clarity, Carat",
    excerpt:
      "A jargon-free walkthrough of the grading standards that determine a diamond's value and brilliance.",
    image: IMAGES.blog[1]!,
    category: "Diamond Education",
    date: "2026-05-18",
    readTime: "8 min read",
    author: "Forever Jewels Editorial",
  },
  {
    id: "blog-3",
    slug: "caring-for-fine-jewelry",
    title: "Caring for Your Fine Jewelry at Home",
    excerpt:
      "Simple habits that keep your rings, chains, and earrings looking as brilliant as the day you got them.",
    image: IMAGES.blog[2]!,
    category: "Jewelry Care",
    date: "2026-04-27",
    readTime: "5 min read",
    author: "Forever Jewels Editorial",
  },
  {
    id: "blog-4",
    slug: "custom-ring-design-process",
    title: "Inside Our Custom Ring Design Process",
    excerpt:
      "A behind-the-scenes look at how a sketch becomes a hand-finished heirloom in our atelier.",
    image: IMAGES.blog[3]!,
    category: "Craftsmanship",
    date: "2026-03-11",
    readTime: "7 min read",
    author: "Forever Jewels Editorial",
  },
];
