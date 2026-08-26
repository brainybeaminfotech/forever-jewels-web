import { Accordion } from "@/components/ui";
import { FAQS } from "@/data/faq";
import { ProductSection } from "./ProductSection";
import type { Product, ProductSpec } from "@/types";

interface ProductAccordionsProps {
  product: Product;
}

const SHIPPING_POINTS = [
  { term: "Dispatch", detail: "Ready-to-ship pieces leave within 1–3 business days; made-to-order follows the window shown above." },
  { term: "Delivery", detail: "Free, fully insured, and requiring an adult signature. Packaging is unbranded for security." },
  { term: "Returns", detail: "30 days on unworn, unaltered pieces in their original packaging with all certification." },
  { term: "Exclusions", detail: "Bespoke commissions, engraved pieces, and non-standard resizes cannot be returned." },
];

const WARRANTY_POINTS = [
  { term: "Covered for life", detail: "Manufacturing defects, prong re-tipping, stone tightening, and rhodium re-plating." },
  { term: "Complimentary", detail: "Cleaning, polishing, and inspection whenever you want it, plus one standard resizing." },
  { term: "Not covered", detail: "Ordinary wear, accidental damage, loss, or work carried out by another jeweller." },
];

/** Two-column definition rows used by Shipping and Warranty. */
function DetailList({ items }: { items: Array<{ term: string; detail: string }> }) {
  return (
    <dl className="grid gap-x-12 gap-y-6 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.term}>
          <dt className="text-xs font-medium uppercase tracking-[0.15em] text-ink">{item.term}</dt>
          <dd className="mt-2 text-sm leading-relaxed text-warm-600">{item.detail}</dd>
        </div>
      ))}
    </dl>
  );
}

function SpecTable({ items }: { items: ProductSpec[] }) {
  return (
    <dl className="mt-5 divide-y divide-warm-100 border-t border-warm-100">
      {items.map((spec) => (
        <div key={spec.label} className="flex items-baseline justify-between gap-6 py-3">
          <dt className="text-sm text-warm-500">{spec.label}</dt>
          <dd className="text-right text-sm text-ink">{spec.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ProductAccordions({ product }: ProductAccordionsProps) {
  // Grouped specs are preferred; `specs` is the flat fallback for catalog products that
  // predate grouping.
  const groups =
    product.specGroups && product.specGroups.length > 0
      ? product.specGroups
      : product.specs && product.specs.length > 0
        ? [{ title: "Product Details", items: product.specs }]
        : [];

  return (
    <div className="mt-16 border-t border-warm-200 lg:mt-24">
      {product.longDescription && product.longDescription.length > 0 && (
        <ProductSection title="Description">
          <div className="max-w-3xl space-y-5">
            {product.longDescription.map((paragraph, index) => (
              <p key={index} className="text-base leading-loose text-warm-600">
                {paragraph}
              </p>
            ))}
          </div>
        </ProductSection>
      )}

      {groups.length > 0 && (
        <ProductSection title="Specifications" description="Every measurement as recorded by our atelier.">
          <div className="grid gap-x-14 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
            {groups.map((group) => (
              <section key={group.title}>
                <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-gold-600">{group.title}</h3>
                <SpecTable items={group.items} />
              </section>
            ))}
          </div>
        </ProductSection>
      )}

      {product.careInstructions && product.careInstructions.length > 0 && (
        <ProductSection title="Care Instructions" defaultOpen={false}>
          <ul className="grid max-w-3xl gap-3 sm:grid-cols-2">
            {product.careInstructions.map((instruction) => (
              <li key={instruction} className="flex gap-3 text-sm leading-relaxed text-warm-600">
                <span aria-hidden className="mt-2 h-1 w-1 shrink-0 bg-gold-500" />
                {instruction}
              </li>
            ))}
          </ul>
        </ProductSection>
      )}

      <ProductSection title="Shipping & Returns" defaultOpen={false}>
        <DetailList items={SHIPPING_POINTS} />
      </ProductSection>

      <ProductSection title="Warranty" defaultOpen={false}>
        <DetailList items={WARRANTY_POINTS} />
      </ProductSection>

      <ProductSection title="Frequently Asked Questions" defaultOpen={false}>
        <div className="max-w-3xl">
          <Accordion items={FAQS} />
        </div>
      </ProductSection>
    </div>
  );
}
