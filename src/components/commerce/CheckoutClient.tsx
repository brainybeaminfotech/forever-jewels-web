"use client";

import { useEffect, useState, type ChangeEvent, type ComponentProps, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Lock, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { Container } from "@/components/common";
import { Button, Input } from "@/components/ui";
import { useCommerce } from "@/hooks/useCommerce";
import {
  CHECKOUT_DETAILS_KEY,
  EMPTY_CUSTOMER,
  SHIPPING_COUNTRIES,
  STATE_REQUIRED_COUNTRIES,
  type CheckoutCustomer,
} from "@/lib/checkout";
import { isRemoteImage } from "@/lib/images";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/utils/format";

const GENERIC_ERROR = "We couldn't start payment. Please check your connection and try again.";
const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
const COUNTRY_OPTIONS = SHIPPING_COUNTRIES.map((code) => ({ code, name: regionNames.of(code) ?? code }));
const labelClass = "text-xs font-medium uppercase tracking-[0.12em] text-warm-600";

function readSavedDetails(): CheckoutCustomer {
  if (typeof window === "undefined") return EMPTY_CUSTOMER;
  try {
    const raw = window.sessionStorage.getItem(CHECKOUT_DETAILS_KEY);
    return raw ? { ...EMPTY_CUSTOMER, ...(JSON.parse(raw) as Partial<CheckoutCustomer>) } : EMPTY_CUSTOMER;
  } catch {
    return EMPTY_CUSTOMER;
  }
}

function Field({ label, className, ...props }: Omit<ComponentProps<typeof Input>, "className"> & { label: string; className?: string }) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className={labelClass}>{label}</span>
      <Input {...props} />
    </label>
  );
}

function Section({ step, title, children }: { step: number; title: string; children: ReactNode }) {
  return (
    <section className="border-t border-warm-200 pt-8 first:border-t-0 first:pt-0">
      <h2 className="flex items-baseline gap-3 font-display text-xl text-ink sm:text-2xl">
        <span className="text-sm text-gold-600">{String(step).padStart(2, "0")}</span>
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function CheckoutClient({ canceled = false }: { canceled?: boolean }) {
  const { ready, cart, cartSubtotal } = useCommerce();
  // The form only renders once `ready` (after mount), so reading sessionStorage here can't cause a hydration mismatch.
  const [form, setForm] = useState<CheckoutCustomer>(readSavedDetails);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currency = cart[0]?.product.currency ?? "USD";
  const stateRequired = STATE_REQUIRED_COUNTRIES.includes(form.country);

  // Coming back from Stripe with the browser's Back button restores this page from the bfcache
  // with the button still in its "Redirecting…" state.
  useEffect(() => {
    const reset = (event: PageTransitionEvent) => {
      if (event.persisted) setSubmitting(false);
    };
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  const update =
    (key: keyof CheckoutCustomer) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: event.target.value }));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      window.sessionStorage.setItem(CHECKOUT_DETAILS_KEY, JSON.stringify(form));
    } catch {
      // storage unavailable — the customer just retypes their details if they come back
    }

    let message = GENERIC_ERROR;
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          items: cart.map(({ product, quantity }) => ({ slug: product.slug, quantity })),
        }),
      });
      const data = (await response.json().catch(() => ({}))) as { url?: string; error?: string };
      if (response.ok && data.url) {
        window.location.assign(data.url);
        return;
      }
      if (data.error) message = data.error;
    } catch {
      // network failure — keep the generic message
    }
    setError(message);
    setSubmitting(false);
  }

  if (!ready) return <div className="min-h-[40vh]" aria-busy="true" />;

  if (cart.length === 0) {
    return (
      <Container className="py-24 text-center sm:py-32">
        <span className="mx-auto flex h-14 w-14 items-center justify-center border border-warm-200 text-warm-400">
          <ShoppingBag size={24} />
        </span>
        <p className="mt-8 font-display text-2xl text-ink sm:text-3xl">Your bag is empty</p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-warm-600">
          Add a piece to your bag to check out.
        </p>
        <div className="mt-9 flex justify-center">
          <Button href="/jewellery/rings">Browse Jewellery</Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-16 sm:py-20">
      {canceled && (
        <p className="mb-10 border border-warm-200 bg-warm-50 px-5 py-4 text-sm text-warm-600">
          Payment was cancelled and nothing was charged. Your bag and details are still here.
        </p>
      )}

      <div className="lg:grid lg:grid-cols-[1fr_24rem] lg:gap-12">
        <form onSubmit={handleSubmit} className="min-w-0 space-y-10">
          <Section step={1} title="Contact">
            <div className="grid grid-cols-2 gap-x-4 gap-y-5">
              <Field
                label="Email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={update("email")}
                className="col-span-2 sm:col-span-1"
              />
              <Field
                label="Phone"
                type="tel"
                autoComplete="tel"
                required
                value={form.phone}
                onChange={update("phone")}
                className="col-span-2 sm:col-span-1"
              />
            </div>
          </Section>

          <Section step={2} title="Shipping Address">
            <div className="grid grid-cols-2 gap-x-4 gap-y-5">
              <Field
                label="First Name"
                autoComplete="given-name"
                required
                value={form.firstName}
                onChange={update("firstName")}
                className="col-span-2 sm:col-span-1"
              />
              <Field
                label="Last Name"
                autoComplete="family-name"
                required
                value={form.lastName}
                onChange={update("lastName")}
                className="col-span-2 sm:col-span-1"
              />
              <label className="col-span-2 flex flex-col gap-1.5">
                <span className={labelClass}>Country</span>
                <select
                  autoComplete="country"
                  required
                  value={form.country}
                  onChange={update("country")}
                  className="border-b border-warm-300 bg-transparent py-3 text-sm text-ink outline-none transition-colors duration-300 focus:border-gold-500"
                >
                  {COUNTRY_OPTIONS.map(({ code, name }) => (
                    <option key={code} value={code}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>
              <Field
                label="Address"
                autoComplete="address-line1"
                required
                value={form.line1}
                onChange={update("line1")}
                className="col-span-2"
              />
              <Field
                label="Apartment, Suite, etc. (optional)"
                autoComplete="address-line2"
                value={form.line2}
                onChange={update("line2")}
                className="col-span-2"
              />
              <Field
                label="City"
                autoComplete="address-level2"
                required
                value={form.city}
                onChange={update("city")}
                className="col-span-2 sm:col-span-1"
              />
              <Field
                label={stateRequired ? "State / Province" : "State / Province (optional)"}
                autoComplete="address-level1"
                required={stateRequired}
                value={form.state}
                onChange={update("state")}
              />
              <Field
                label="Postal Code"
                autoComplete="postal-code"
                required
                value={form.postalCode}
                onChange={update("postalCode")}
              />
            </div>
          </Section>

          <Section step={3} title="Delivery">
            <div className="flex items-start gap-4 border border-gold-500 bg-gold-50/40 px-5 py-4">
              <Truck size={18} className="mt-0.5 shrink-0 text-gold-600" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink">Complimentary insured shipping</p>
                <p className="mt-1 text-xs text-warm-600">Fully insured, signature required on delivery.</p>
              </div>
              <span className="text-sm text-ink">Free</span>
            </div>
          </Section>

          <Section step={4} title="Payment">
            <p className="flex items-start gap-3 text-sm leading-relaxed text-warm-600">
              <ShieldCheck size={18} className="mt-0.5 shrink-0 text-gold-600" />
              You&apos;ll enter your payment details on Stripe&apos;s secure checkout page. We never see or store
              your card number.
            </p>

            {error && (
              <p role="alert" className="mt-6 border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" fullWidth className="mt-8" disabled={submitting} icon={<Lock size={16} />} iconPosition="left">
              {submitting ? "Redirecting to Payment…" : "Continue to Payment"}
            </Button>
          </Section>
        </form>

        <aside className="mt-12 lg:mt-0">
          <div className="border border-warm-200 bg-warm-50 p-8 lg:sticky lg:top-44">
            <div className="flex items-baseline justify-between gap-4">
              <p className="font-display text-xl text-ink">Order Summary</p>
              <Link
                href="/cart"
                className="text-xs uppercase tracking-[0.15em] text-warm-500 underline-offset-4 hover:text-gold-600 hover:underline"
              >
                Edit Bag
              </Link>
            </div>

            <ul className="mt-6 divide-y divide-warm-200 border-y border-warm-200">
              {cart.map(({ product, quantity }) => (
                <li key={product.id} className="flex gap-4 py-4">
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-warm-100">
                    <Image
                      src={product.image}
                      unoptimized={isRemoteImage(product.image)}
                      alt={product.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-display text-base text-ink">{product.name}</p>
                      {product.metal && <p className="mt-0.5 truncate text-xs text-warm-600">{product.metal}</p>}
                      <p className="mt-0.5 text-xs text-warm-500">Qty {quantity}</p>
                    </div>
                    <p className="shrink-0 text-sm text-ink">{formatPrice(product.price * quantity, product.currency)}</p>
                  </div>
                </li>
              ))}
            </ul>

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
          </div>
        </aside>
      </div>
    </Container>
  );
}
