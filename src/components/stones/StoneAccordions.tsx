import { Accordion } from "@/components/ui";
import { FilterSection } from "@/components/jewellery";
import { FAQS } from "@/data/faq";
import { buildStoneSpecs } from "@/lib/stones";
import type { StoneListItem } from "@/types";

interface StoneAccordionsProps {
  stone: StoneListItem;
}

const SHIPPING_COPY =
  "Every stone ships fully insured within 1–3 business days, packaged securely with its full gemological report. We offer free 30-day returns on any stone in its original, unaltered condition.";

const WARRANTY_COPY =
  "Every certified stone is backed by our authenticity guarantee — the grading report shown here is independently issued by the laboratory listed, not by Forever Jewels, and can be verified directly with them at any time.";

export function StoneAccordions({ stone }: StoneAccordionsProps) {
  const specs = buildStoneSpecs(stone);

  return (
    <div className="mt-12 border-t border-warm-200 pt-6 lg:mt-16">
      {specs.length > 0 && (
        <FilterSection title="Stone Details">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {specs.map((spec) => (
              <div key={spec.label} className="flex items-center justify-between border-b border-warm-100 pb-2 text-sm">
                <dt className="text-warm-500">{spec.label}</dt>
                <dd className="text-ink">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </FilterSection>
      )}

      <FilterSection title="Shipping & Returns" defaultOpen={false}>
        <p className="text-sm text-warm-600">{SHIPPING_COPY}</p>
      </FilterSection>

      <FilterSection title="Authenticity & Grading" defaultOpen={false}>
        <p className="text-sm text-warm-600">{WARRANTY_COPY}</p>
      </FilterSection>

      <FilterSection title="Frequently Asked Questions" defaultOpen={false}>
        <Accordion items={FAQS} />
      </FilterSection>
    </div>
  );
}
