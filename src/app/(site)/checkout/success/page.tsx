import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CheckCircle2, Clock } from "lucide-react";
import type Stripe from "stripe";
import { Container } from "@/components/common";
import { ClearCartOnOrder } from "@/components/commerce";
import { PageHero } from "@/components/content";
import { Button } from "@/components/ui";
import { isRemoteImage } from "@/lib/images";
import { getStripe } from "@/lib/stripe";
import { formatDate, formatPrice } from "@/utils/format";

export const metadata: Metadata = {
  title: "Order Confirmation",
  robots: { index: false, follow: false },
};

const SESSION_ID_RE = /^cs_(test|live)_[A-Za-z0-9]+$/;

/**
 * Stripe redirects here after payment. Everything shown is read back from Stripe — not from
 * the browser's bag — so the page reflects what was actually charged.
 */
export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  const stripe = getStripe();
  if (!stripe || !sessionId || !SESSION_ID_RE.test(sessionId)) notFound();

  const session = await stripe.checkout.sessions
    .retrieve(sessionId, { expand: ["line_items.data.price.product", "payment_intent"] })
    .catch(() => null);
  if (!session) notFound();
  if (session.status === "open") redirect("/checkout");
  if (session.status !== "complete") redirect("/cart");

  // Bank-debit style methods complete the session before the money clears.
  const paid = session.payment_status !== "unpaid";
  const orderNumber = session.metadata?.order_number ?? session.client_reference_id ?? "";
  const email = session.customer_details?.email ?? session.customer_email ?? "";
  const currency = (session.currency ?? "usd").toUpperCase();
  const shipping = (session.payment_intent as Stripe.PaymentIntent | null)?.shipping;
  const items = session.line_items?.data ?? [];
  const money = (amountInCents: number | null | undefined) => formatPrice((amountInCents ?? 0) / 100, currency);

  return (
    <>
      <ClearCartOnOrder sessionId={session.id} />
      <PageHero
        eyebrow={paid ? "Order Confirmed" : "Order Received"}
        title="Thank You"
        description={
          paid
            ? `Your order is confirmed and a receipt is on its way to ${email}. We'll be in touch when your piece ships.`
            : `We've received your order. Your payment is still processing, and we'll email ${email} once it clears.`
        }
      />

      <Container className="py-16 sm:py-20">
        <div className="lg:grid lg:grid-cols-[1fr_22rem] lg:gap-12">
          <div className="min-w-0">
            <p className="flex items-center gap-3 text-sm text-warm-600">
              {paid ? (
                <CheckCircle2 size={18} className="shrink-0 text-gold-600" />
              ) : (
                <Clock size={18} className="shrink-0 text-gold-600" />
              )}
              <span>
                Order <span className="font-medium text-ink">{orderNumber}</span> · placed {formatDate(new Date(session.created * 1000).toISOString())}
              </span>
            </p>

            <ul className="mt-8 divide-y divide-warm-200 border-y border-warm-200">
              {items.map((item) => {
                const product = item.price?.product as Stripe.Product | undefined;
                const image = product?.images?.[0];
                const slug = product?.metadata?.slug;
                return (
                  <li key={item.id} className="flex gap-5 py-6 sm:gap-8">
                    <div className="relative h-28 w-24 shrink-0 overflow-hidden bg-warm-100 sm:h-36 sm:w-32">
                      {image && (
                        <Image
                          src={image}
                          unoptimized={isRemoteImage(image)}
                          alt={item.description ?? ""}
                          fill
                          sizes="128px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 items-start justify-between gap-4">
                      <div className="min-w-0">
                        {slug ? (
                          <Link href={`/products/${slug}`} className="font-display text-lg text-ink hover:text-gold-600 sm:text-xl">
                            {item.description}
                          </Link>
                        ) : (
                          <p className="font-display text-lg text-ink sm:text-xl">{item.description}</p>
                        )}
                        {product?.description && <p className="mt-1 text-sm text-warm-600">{product.description}</p>}
                        <p className="mt-1 text-xs text-warm-500">Qty {item.quantity}</p>
                      </div>
                      <p className="shrink-0 text-sm font-medium text-ink sm:text-base">{money(item.amount_total)}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <aside className="mt-10 lg:mt-0">
            <div className="border border-warm-200 bg-warm-50 p-8 lg:sticky lg:top-44">
              <p className="font-display text-xl text-ink">Order Summary</p>

              <dl className="mt-6 space-y-3 border-b border-warm-200 pb-6 text-sm">
                <div className="flex justify-between">
                  <dt className="text-warm-600">Subtotal</dt>
                  <dd className="text-ink">{money(session.amount_subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-warm-600">Shipping</dt>
                  <dd className="text-ink">
                    {session.total_details?.amount_shipping ? money(session.total_details.amount_shipping) : "Free — insured"}
                  </dd>
                </div>
                {!!session.total_details?.amount_tax && (
                  <div className="flex justify-between">
                    <dt className="text-warm-600">Tax</dt>
                    <dd className="text-ink">{money(session.total_details.amount_tax)}</dd>
                  </div>
                )}
              </dl>

              <div className="mt-6 flex items-baseline justify-between">
                <span className="text-sm uppercase tracking-[0.15em] text-warm-600">{paid ? "Paid" : "Total"}</span>
                <span className="text-xl font-medium text-ink">{money(session.amount_total)}</span>
              </div>

              {shipping?.address && (
                <div className="mt-8 border-t border-warm-200 pt-6 text-sm leading-relaxed text-warm-600">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-warm-600">Shipping To</p>
                  <p className="mt-2 text-ink">{shipping.name}</p>
                  <p>{shipping.address.line1}</p>
                  {shipping.address.line2 && <p>{shipping.address.line2}</p>}
                  <p>
                    {[shipping.address.city, shipping.address.state, shipping.address.postal_code].filter(Boolean).join(", ")}
                  </p>
                  <p>{shipping.address.country}</p>
                </div>
              )}

              <Button href="/jewellery/rings" className="mt-8" fullWidth size="lg">
                Continue Shopping
              </Button>
              <Link
                href="/contact"
                className="mt-4 block text-center text-xs uppercase tracking-[0.2em] text-warm-500 underline-offset-4 hover:text-gold-600 hover:underline"
              >
                Questions? Contact Us
              </Link>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
