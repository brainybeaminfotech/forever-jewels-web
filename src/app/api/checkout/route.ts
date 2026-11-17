import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { getProductDetailBySlug } from "@framework/product/get-product-details";
import { parseCheckoutRequest } from "@/lib/checkout";
import { getStripe } from "@/lib/stripe";

/** Tags these sessions in the Stripe Dashboard so this checkout flow can be told apart from others. */
const INTEGRATION_IDENTIFIER = "forever_jewels_web_checkout_qhvtzmkd";

function newOrderNumber() {
  return `FJ-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
}

function fail(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

/**
 * Creates a Stripe Checkout Session for the bag and returns its hosted-page URL. Prices are
 * looked up from the product API by slug, never taken from the browser's cart.
 */
export async function POST(request: NextRequest) {
  const stripe = getStripe();
  if (!stripe) return fail("Online payment isn't available right now. Please contact us to complete your order.", 503);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail("Invalid request.", 400);
  }

  const parsed = parseCheckoutRequest(body);
  if (!parsed.ok) return fail(parsed.error, 400);
  const { customer, items } = parsed.value;

  const products = await Promise.all(items.map((item) => getProductDetailBySlug(item.slug)));
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  for (const [index, item] of items.entries()) {
    const product = products[index];
    if (!product || product.availability === "out-of-stock" || !(product.price > 0)) {
      return fail(
        "Some pieces in your bag are no longer available. Please remove them from your bag and try again.",
        409,
      );
    }
    const description = [product.metal, product.sku && `SKU ${product.sku}`].filter(Boolean).join(" · ");
    lineItems.push({
      quantity: item.quantity,
      price_data: {
        currency: product.currency.toLowerCase(),
        // shortcut: assumes a two-decimal currency (USD today); zero-decimal ones like JPY need no ×100.
        unit_amount: Math.round(product.price * 100),
        product_data: {
          name: product.name,
          ...(description && { description }),
          ...(product.image?.startsWith("https://") && { images: [product.image] }),
          metadata: { product_id: product.id, slug: product.slug },
        },
      },
    });
  }

  const orderNumber = newOrderNumber();
  const origin = request.nextUrl.origin;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      customer_email: customer.email,
      client_reference_id: orderNumber,
      metadata: { order_number: orderNumber },
      payment_intent_data: {
        description: `Order ${orderNumber}`,
        receipt_email: customer.email,
        metadata: { order_number: orderNumber },
        shipping: {
          name: `${customer.firstName} ${customer.lastName}`,
          phone: customer.phone,
          address: {
            line1: customer.line1,
            line2: customer.line2 || undefined,
            city: customer.city,
            state: customer.state || undefined,
            postal_code: customer.postalCode,
            country: customer.country,
          },
        },
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?canceled=1`,
      integration_identifier: INTEGRATION_IDENTIFIER,
    });
    if (!session.url) throw new Error("Stripe returned a session without a URL");
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[checkout] could not create Stripe session", error);
    return fail("We couldn't start payment. Please try again in a moment.", 502);
  }
}
