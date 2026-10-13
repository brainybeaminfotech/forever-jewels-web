import type { InstagramPost } from "@/types";
import { IMAGES } from "@/lib/images";
import { SOCIAL_LINKS } from "@/constants/site";

const INSTAGRAM_PROFILE = SOCIAL_LINKS.find((social) => social.name === "Instagram")?.href ?? "#";

export const INSTAGRAM_POSTS: InstagramPost[] = IMAGES.instagram.map((image, index) => ({
  id: `insta-${index + 1}`,
  image,
  href: INSTAGRAM_PROFILE,
  likes: 180 + index * 37,
  caption: "Forever Jewels — emotions captured forever.",
}));
