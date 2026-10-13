import type { MetadataRoute } from "next";
import { SITE } from "@/constants/site";
import { JEWELLERY_CATEGORIES } from "@/lib/catalog";
import { EDUCATION_ARTICLES } from "@/data/education";
import { getProductsByCategoryFromApi } from "@framework/product/get-all-products";

/** Regenerate daily so newly published products enter the index without a redeploy. */
export const revalidate = 86400;

const url = (path: string) => `${SITE.url}${path}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = ([
    { url: url("/"), changeFrequency: "daily", priority: 1 },
    { url: url("/jewellery"), changeFrequency: "daily", priority: 0.9 },
    { url: url("/diamonds"), changeFrequency: "daily", priority: 0.9 },
    { url: url("/gemstone"), changeFrequency: "daily", priority: 0.9 },
    { url: url("/education"), changeFrequency: "weekly", priority: 0.7 },
    { url: url("/about"), changeFrequency: "monthly", priority: 0.6 },
    { url: url("/our-story"), changeFrequency: "monthly", priority: 0.5 },
    { url: url("/contact"), changeFrequency: "monthly", priority: 0.6 },
    { url: url("/careers"), changeFrequency: "weekly", priority: 0.4 },
    { url: url("/terms"), changeFrequency: "yearly", priority: 0.2 },
    { url: url("/privacy"), changeFrequency: "yearly", priority: 0.2 },
  ] satisfies MetadataRoute.Sitemap).map((entry) => ({ ...entry, lastModified: now }));

  const categoryPages: MetadataRoute.Sitemap = JEWELLERY_CATEGORIES.map((category) => ({
    url: url(`/jewellery/${category}`),
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const educationPages: MetadataRoute.Sitemap = EDUCATION_ARTICLES.map((article) => ({
    url: url(`/education/${article.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // Product URLs come from the live catalog. If the API is unreachable at build time the
  // sitemap still ships with everything else rather than failing the build.
  const productLists = await Promise.all(
    JEWELLERY_CATEGORIES.map((category) => getProductsByCategoryFromApi(category, { revalidate })),
  );
  const seen = new Set<string>();
  const productPages: MetadataRoute.Sitemap = [];
  for (const product of productLists.flat()) {
    if (seen.has(product.slug)) continue;
    seen.add(product.slug);
    productPages.push({
      url: url(`/products/${product.slug}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  // Individual stone URLs are left out while /diamonds and /gemstone are "Coming Soon" — every
  // one of them currently renders that same page and declares the hub as canonical, and a
  // sitemap should only list canonical URLs. Re-add them when the stone pages go live.
  return [...staticPages, ...categoryPages, ...educationPages, ...productPages];
}
