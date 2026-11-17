import Stripe from "stripe";

let client: Stripe | undefined;

/**
 * Server-side Stripe client, or `null` while `STRIPE_SECRET_KEY` is unset. The key has no
 * `NEXT_PUBLIC_` prefix, so it never reaches the browser bundle. A restricted key (`rk_…`)
 * with write access to Checkout Sessions and read access to PaymentIntents and Products is
 * enough for this site.
 */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  return (client ??= new Stripe(key));
}
