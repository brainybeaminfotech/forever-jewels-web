import type { MetadataRoute } from "next";
import { SITE } from "@/constants/site";

/**
 * Personal/transactional routes are crawlable-but-not-indexable pages; blocking them here
 * keeps them out of the index without hiding the storefront.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/account", "/cart", "/wishlist", "/checkout", "/login", "/signup", "/api/"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
