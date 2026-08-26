"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Container } from "@/components/common";
import { Button } from "@/components/ui";
import { useCommerce } from "@/hooks/useCommerce";
import { formatPrice } from "@/utils/format";

export function CartClient() {
  const { cart, cartSubtotal, updateQuantity, removeFromCart } = useCommerce();
  const currency = cart[0]?.product.currency ?? "USD";

  if (cart.length === 0) {
    return (
      <Container className="py-24 text-center sm:py-32">
        <span className="mx-auto flex h-14 w-14 items-center justify-center border border-warm-200 text-warm-400">
          <ShoppingBag size={24} />
        </span>
        <p className="mt-8 font-display text-2xl text-ink sm:text-3xl">Your bag is empty</p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-warm-600">
          Once you add a piece it will appear here, saved on this device until you are ready.
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
      <div className="lg:grid lg:grid-cols-[1fr_22rem] lg:gap-12">
        <div className="min-w-0 divide-y divide-warm-200 border-y border-warm-200">
          {cart.map(({ product, quantity }) => (
            <div key={product.id} className="flex gap-5 py-6 sm:gap-8">
              <Link
                href={`/products/${product.slug}`}
                className="relative h-28 w-24 shrink-0 overflow-hidden bg-warm-100 sm:h-36 sm:w-32"
              >
                <Image src={product.image} alt={product.name} fill sizes="128px" className="object-cover" />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.15em] text-warm-500">{product.category}</p>
                    <Link
                      href={`/products/${product.slug}`}
                      className="mt-1.5 block font-display text-lg text-ink hover:text-gold-600 sm:text-xl"
                    >
                      {product.name}
                    </Link>
                    {product.metal && <p className="mt-1 text-sm text-warm-600">{product.metal}</p>}
                    {product.sku && <p className="mt-1 text-xs text-warm-500">SKU: {product.sku}</p>}
                  </div>
                  <p className="shrink-0 text-sm font-medium text-ink sm:text-base">
                    {formatPrice(product.price * quantity, product.currency)}
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between gap-4 pt-4">
                  <div className="flex items-center border border-warm-200">
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      aria-label={`Decrease quantity of ${product.name}`}
                      className="flex h-9 w-9 items-center justify-center text-ink hover:text-gold-600"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      aria-label={`Increase quantity of ${product.name}`}
                      className="flex h-9 w-9 items-center justify-center text-ink hover:text-gold-600"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(product.id)}
                    className="flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-warm-500 transition-colors hover:text-red-600"
                  >
                    <Trash2 size={14} />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="mt-10 lg:mt-0">
          <div className="border border-warm-200 bg-warm-50 p-8 lg:sticky lg:top-44">
            <p className="font-display text-xl text-ink">Order Summary</p>

            <dl className="mt-6 space-y-3 border-b border-warm-200 pb-6 text-sm">
              <div className="flex justify-between">
                <dt className="text-warm-600">Subtotal</dt>
                <dd className="text-ink">{formatPrice(cartSubtotal, currency)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-warm-600">Shipping</dt>
                <dd className="text-ink">Free — insured</dd>
              </div>
            </dl>

            <div className="mt-6 flex items-baseline justify-between">
              <span className="text-sm uppercase tracking-[0.15em] text-warm-600">Total</span>
              <span className="text-xl font-medium text-ink">{formatPrice(cartSubtotal, currency)}</span>
            </div>
            <p className="mt-2 text-xs text-warm-500">Taxes and duties calculated at checkout.</p>

            <Button href="/checkout" className="mt-8" fullWidth size="lg">
              Proceed to Checkout
            </Button>
            <Link
              href="/jewellery/rings"
              className="mt-4 block text-center text-xs uppercase tracking-[0.2em] text-warm-500 underline-offset-4 hover:text-gold-600 hover:underline"
            >
              Continue Shopping
            </Link>
          </div>
        </aside>
      </div>
    </Container>
  );
}
