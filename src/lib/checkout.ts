/**
 * Checkout input shared by the checkout form and `POST /api/checkout`, so the browser and
 * the server accept exactly the same shape. The server re-validates everything here —
 * never trust the client's copy.
 */

export interface CheckoutCustomer {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  /** ISO 3166-1 alpha-2, one of `SHIPPING_COUNTRIES`. */
  country: string;
}

export interface CheckoutItem {
  slug: string;
  quantity: number;
}

export interface CheckoutRequest {
  customer: CheckoutCustomer;
  items: CheckoutItem[];
}

// shortcut: hand-picked list, update it once the business confirms where it ships.
export const SHIPPING_COUNTRIES = [
  "US", "CA", "GB", "IE", "AU", "NZ", "FR", "DE", "IT", "ES", "PT", "NL", "BE", "LU", "CH", "AT",
  "DK", "SE", "NO", "FI", "PL", "AE", "SA", "QA", "IL", "SG", "HK", "JP", "KR", "IN", "ZA", "MX",
] as const;

/** Countries whose addresses aren't deliverable without a state/province. */
export const STATE_REQUIRED_COUNTRIES: readonly string[] = ["US", "CA", "AU"];

export const MAX_QUANTITY_PER_ITEM = 10;
const MAX_LINES = 50;
const MAX_FIELD_LENGTH = 200;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SLUG_RE = /^[a-z0-9][a-z0-9-]*$/i;

/** sessionStorage key for the form, so a customer who backs out of payment keeps their details. */
export const CHECKOUT_DETAILS_KEY = "forever-jewels-checkout";
/** localStorage key holding the last Stripe session whose bag was already cleared. */
export const LAST_ORDER_KEY = "forever-jewels-last-order";

export const EMPTY_CUSTOMER: CheckoutCustomer = {
  email: "",
  phone: "",
  firstName: "",
  lastName: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "US",
};

type ParseResult = { ok: true; value: CheckoutRequest } | { ok: false; error: string };

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/** Cleans and validates an untrusted checkout body; on failure returns a message safe to show the customer. */
export function parseCheckoutRequest(body: unknown): ParseResult {
  const input = (body ?? {}) as { customer?: Record<string, unknown>; items?: unknown };
  const raw = input.customer ?? {};
  const customer: CheckoutCustomer = {
    email: text(raw.email).toLowerCase(),
    phone: text(raw.phone),
    firstName: text(raw.firstName),
    lastName: text(raw.lastName),
    line1: text(raw.line1),
    line2: text(raw.line2),
    city: text(raw.city),
    state: text(raw.state),
    postalCode: text(raw.postalCode),
    country: text(raw.country).toUpperCase(),
  };

  const required: [keyof CheckoutCustomer, string][] = [
    ["email", "Email"],
    ["phone", "Phone"],
    ["firstName", "First name"],
    ["lastName", "Last name"],
    ["line1", "Address"],
    ["city", "City"],
    ["postalCode", "Postal code"],
  ];
  if (STATE_REQUIRED_COUNTRIES.includes(customer.country)) required.push(["state", "State / Province"]);
  for (const [key, label] of required) {
    if (!customer[key]) return { ok: false, error: `${label} is required.` };
  }
  if (Object.values(customer).some((value) => value.length > MAX_FIELD_LENGTH)) {
    return { ok: false, error: "One of the fields is too long." };
  }
  if (!EMAIL_RE.test(customer.email)) return { ok: false, error: "Please enter a valid email address." };
  if (!(SHIPPING_COUNTRIES as readonly string[]).includes(customer.country)) {
    return { ok: false, error: "We don't ship to that country online yet. Please contact us." };
  }

  if (!Array.isArray(input.items) || input.items.length === 0) return { ok: false, error: "Your bag is empty." };
  if (input.items.length > MAX_LINES) return { ok: false, error: "Your bag has too many items." };

  // Merge repeated slugs so one piece can't slip past the per-item cap across several lines.
  const quantities = new Map<string, number>();
  for (const item of input.items as { slug?: unknown; quantity?: unknown }[]) {
    const slug = text(item?.slug);
    const quantity = item?.quantity;
    if (!SLUG_RE.test(slug) || slug.length > MAX_FIELD_LENGTH) return { ok: false, error: "Your bag contains an invalid item." };
    if (typeof quantity !== "number" || !Number.isInteger(quantity) || quantity < 1) {
      return { ok: false, error: "Your bag contains an invalid quantity." };
    }
    quantities.set(slug, (quantities.get(slug) ?? 0) + quantity);
  }
  for (const quantity of quantities.values()) {
    if (quantity > MAX_QUANTITY_PER_ITEM) {
      return {
        ok: false,
        error: `You can order up to ${MAX_QUANTITY_PER_ITEM} of any piece online. Please contact us for larger orders.`,
      };
    }
  }

  return { ok: true, value: { customer, items: [...quantities].map(([slug, quantity]) => ({ slug, quantity })) } };
}
