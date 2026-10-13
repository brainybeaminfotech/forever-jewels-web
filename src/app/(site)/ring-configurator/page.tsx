import type { Metadata } from "next";
import { Gem } from "lucide-react";
import { Container } from "@/components/common";
import { PageHero } from "@/components/content";
import { Button } from "@/components/ui";
import { FadeIn } from "@/components/animations";
import { SITE } from "@/constants/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Ring Configurator",
  description: `Build your own ring with ${SITE.name} — coming soon. In the meantime our atelier takes bespoke commissions directly.`,
  path: "/ring-configurator",
});

export default function RingConfiguratorPage() {
  return (
    <>
      <PageHero
        eyebrow="Create Your Own"
        title="Ring Configurator"
        description="Design a ring from the centre stone up — shape, setting, band, and metal, priced as you build."
      />

      <Container className="py-24 text-center sm:py-32">
        <FadeIn direction="up">
          <span className="mx-auto flex h-16 w-16 items-center justify-center border border-warm-200 text-gold-600">
            <Gem size={26} />
          </span>

          <p className="mt-8 text-xs font-medium uppercase tracking-[0.35em] text-gold-600">Coming Soon</p>
          <h2 className="mx-auto mt-5 max-w-2xl text-balance font-display text-3xl leading-tight text-ink sm:text-4xl">
            We are building it properly before we launch it.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-balance text-sm leading-relaxed text-warm-600 sm:text-base">
            Until it is ready, our atelier still builds bespoke rings the way it always has — with an advisor, start to
            finish. Tell us what you have in mind and we will quote it.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button href="/contact">Start a Commission</Button>
            <Button href="/jewellery/rings" variant="outline">
              Browse Rings
            </Button>
          </div>
        </FadeIn>
      </Container>
    </>
  );
}
