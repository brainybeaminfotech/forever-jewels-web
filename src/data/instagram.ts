import type { InstagramPost } from "@/types";
import { IMAGES } from "@/lib/images";

export const INSTAGRAM_POSTS: InstagramPost[] = IMAGES.instagram.map((image, index) => ({
  id: `insta-${index + 1}`,
  image,
  href: "https://instagram.com",
  likes: 180 + index * 37,
  caption: "Forever Jewels — emotions captured forever.",
}));
