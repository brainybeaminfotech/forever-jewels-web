import type { Metadata } from "next";
import Image from "next/image";
import { isRemoteImage } from "@/lib/images";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { Container } from "@/components/common";
import { PageHero } from "@/components/content";
import { Button } from "@/components/ui";
import { searchProducts } from "@framework/product/get-search-products";
import { formatPrice } from "@/utils/format";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the Forever Jewels catalogue.",
  robots: { index: false, follow: true },
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const results = query.length >= 2 ? await searchProducts(query, "USD", 60) : [];

  return (
    <>
      <PageHero
        eyebrow="Search"
        title={query ? `Results for “${query}”` : "Search"}
        description={query ? `${results.length} ${results.length === 1 ? "piece" : "pieces"} found.` : undefined}
      />

      <Container className="py-16 sm:py-20">
        {query.length < 2 ? (
          <p className="text-center text-sm text-warm-600">Enter at least two characters to search.</p>
        ) : results.length === 0 ? (
          <div className="py-12 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center border border-warm-200 text-warm-400">
              <SearchX size={24} />
            </span>
            <p className="mt-8 font-display text-2xl text-ink">No pieces match “{query}”</p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-warm-600">
              Try a shorter or more general term — a metal, a stone, or a category.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Button href="/jewellery/rings">Browse Jewellery</Button>
              <Button href="/contact" variant="outline">Ask an Advisor</Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-px bg-warm-200 sm:grid-cols-2 lg:grid-cols-4">
            {results.map((hit) => (
              <Link key={hit.id} href={`/products/${hit.slug}`} className="group flex flex-col bg-white">
                <div className="relative aspect-square overflow-hidden bg-warm-100">
                  <Image
                    src={hit.image}
                    unoptimized={isRemoteImage(hit.image)}
                    alt={hit.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs uppercase tracking-[0.15em] text-warm-500">{hit.category}</p>
                  <p className="mt-2 font-display text-lg text-ink transition-colors group-hover:text-gold-600">
                    {hit.name}
                  </p>
                  <p className="mt-auto pt-4 text-sm text-ink">{formatPrice(hit.price, "USD")}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
