import { Accordion } from "@/components/ui";
import { FAQS } from "@/data/faq";
import { FilterSection } from "./FilterSection";
import type { Product } from "@/types";

interface ProductAccordionsProps {
  product: Product;
}

const SHIPPING_COPY =
  "Orders ship within 1–3 business days for ready-to-ship pieces, or per the estimated delivery window for made-to-order items. We offer free insured shipping on all orders, plus free 30-day returns on unworn, unaltered pieces in their original packaging.";

const WARRANTY_COPY =
  "Every piece is backed by our lifetime warranty, covering manufacturing defects, prong retipping, and rhodium replating. Complimentary cleaning and inspection is available at any Forever Jewels location for the life of the piece.";

export function ProductAccordions({ product }: ProductAccordionsProps) {
  return (
    <div className="mt-12 border-t border-warm-200 pt-6 lg:mt-16">
      {product.specs && product.specs.length > 0 && (
        <FilterSection title="Product Details">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {product.specs.map((spec) => (
              <div key={spec.label} className="flex items-center justify-between border-b border-warm-100 pb-2 text-sm">
                <dt className="text-warm-500">{spec.label}</dt>
                <dd className="text-ink">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </FilterSection>
      )}

      {product.careInstructions && product.careInstructions.length > 0 && (
        <FilterSection title="Care Instructions" defaultOpen={false}>
          <ul className="flex flex-col gap-2 text-sm text-warm-600">
            {product.careInstructions.map((c) => (
              <li key={c}>&bull; {c}</li>
            ))}
          </ul>
        </FilterSection>
      )}

      <FilterSection title="Shipping & Returns" defaultOpen={false}>
        <p className="text-sm text-warm-600">{SHIPPING_COPY}</p>
      </FilterSection>

      <FilterSection title="Warranty" defaultOpen={false}>
        <p className="text-sm text-warm-600">{WARRANTY_COPY}</p>
      </FilterSection>

      <FilterSection title="Frequently Asked Questions" defaultOpen={false}>
        <Accordion items={FAQS} />
      </FilterSection>
    </div>
  );
}
