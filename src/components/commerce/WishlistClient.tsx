"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import { Container } from "@/components/common";
import { Button } from "@/components/ui";
import { useCommerce } from "@/hooks/useCommerce";
import { formatPrice } from "@/utils/format";

export function WishlistClient() {
  const { wishlistItems, toggleWishlist, moveToCart } = useCommerce();

  if (wishlistItems.length === 0) {
    return (
      <Container className="py-24 text-center sm:py-32">
        <span className="mx-auto flex h-14 w-14 items-center justify-center border border-warm-200 text-warm-400">
          <Heart size={24} />
        </span>
        <p className="mt-8 font-display text-2xl text-ink sm:text-3xl">Nothing saved yet</p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-warm-600">
          Tap the heart on any piece to keep it here while you decide.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Button href="/jewellery/rings">Browse Jewellery</Button>
          <Button href="/diamonds" variant="outline">Browse Diamonds</Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-16 sm:py-20">
      <div className="grid gap-px bg-warm-200 sm:grid-cols-2 lg:grid-cols-3">
        {wishlistItems.map((product) => (
          <div key={product.id} className="flex flex-col bg-white">
            <Link href={`/products/${product.slug}`} className="relative aspect-square overflow-hidden bg-warm-100">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </Link>

            <div className="flex flex-1 flex-col p-6">
              <p className="text-xs uppercase tracking-[0.15em] text-warm-500">{product.category}</p>
              <Link
                href={`/products/${product.slug}`}
                className="mt-2 font-display text-lg text-ink hover:text-gold-600"
              >
                {product.name}
              </Link>
              <p className="mt-2 text-sm text-ink">{formatPrice(product.price, product.currency)}</p>

              <div className="mt-auto flex items-center gap-3 pt-6">
                <Button size="sm" onClick={() => moveToCart(product.id)} className="flex-1">
                  Move to Bag
                </Button>
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  aria-label={`Remove ${product.name} from wishlist`}
                  className="flex h-9 w-9 items-center justify-center border border-warm-200 text-warm-500 transition-colors hover:border-red-500 hover:text-red-600"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
