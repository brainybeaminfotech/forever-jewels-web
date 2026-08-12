import { MessageCircleQuestion } from "lucide-react";
import { FAQS } from "@/data/faq";
import { Container } from "@/components/common";
import { Accordion, Button } from "@/components/ui";
import { FadeIn } from "@/components/animations";

export function FAQs() {
  return (
    <section className="bg-cream py-20 sm:py-28">
      <Container size="wide">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
          <FadeIn direction="up" className="lg:col-span-4">
            <MessageCircleQuestion className="text-gold-500" size={28} />
            <span className="mt-5 block text-xs sm:text-sm font-medium uppercase tracking-[0.35em] text-gold-600">
              Good To Know
            </span>
            <h2 className="mt-4 text-balance font-display text-3xl leading-tight text-ink sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-5 max-w-sm text-balance text-sm sm:text-base leading-relaxed text-warm-600">
              Can&apos;t find what you&apos;re looking for? Our jewelry consultants are here to help,
              every step of the way.
            </p>
            <Button href="/contact" variant="primary" size="md" className="mt-8">
              Contact Us
            </Button>
          </FadeIn>

          <FadeIn direction="up" delay={0.1} className="lg:col-span-8">
            <Accordion items={FAQS} />
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}
