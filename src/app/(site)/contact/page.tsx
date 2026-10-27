import type { Metadata } from "next";
import { Clock, Mail, MapPin } from "lucide-react";
import { Container, JsonLd } from "@/components/common";
import { ContactForm, PageHero } from "@/components/content";
import { SocialIcon, type SocialName } from "@/components/ui";
import { FadeIn } from "@/components/animations";
import { CONTACT_ACTIONS, SITE, SOCIAL_LINKS } from "@/constants/site";
import { organizationJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us",
  description: `Talk to a ${SITE.name} client advisor about a commission, an order, or a repair — or book a private appointment at our New Jersey atelier.`,
  path: "/contact",
});

const details: Array<{
  id: string;
  Icon: typeof MapPin;
  label: string;
  value?: string;
  href?: string;
}> = [
  { id: "address", Icon: MapPin, label: "Based In", value: SITE.address },
  { id: "email", Icon: Mail, label: "Email Us", value: SITE.email, href: `mailto:${SITE.email}` },
  { id: "hours", Icon: Clock, label: "Opening Hours", value: SITE.hours },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <PageHero
        eyebrow="Contact Us"
        title="Talk to someone who works on the pieces."
        description="Our client advisors sit in the same building as the bench, so the answer you get about a commission comes from the people making it."
      />

      <Container className="py-16 sm:py-20 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <div>
            <FadeIn direction="up">
              <span className="text-xs font-medium uppercase tracking-[0.35em] text-gold-600 sm:text-sm">
                Get In Touch
              </span>
              <h2 className="mt-4 text-balance font-display text-3xl leading-tight text-ink sm:text-4xl">
                However you prefer to reach us
              </h2>
            </FadeIn>

            <dl className="mt-10 space-y-8">
              {details.map((detail, index) => (
                <FadeIn key={detail.id} direction="up" delay={index * 0.06} className="flex gap-4">
                  <span className="mt-0.5 shrink-0 text-gold-600">
                    <detail.Icon size={20} />
                  </span>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.2em] text-warm-500">{detail.label}</dt>
                    <dd className="mt-1.5 text-sm text-ink sm:text-base">
                      {detail.href ? (
                        <a href={detail.href} className="transition-colors hover:text-gold-600">
                          {detail.value}
                        </a>
                      ) : (
                        detail.value
                      )}
                    </dd>
                  </div>
                </FadeIn>
              ))}
            </dl>

            <FadeIn direction="up" className="mt-10 border-t border-warm-200 pt-8">
              <div className="flex items-center gap-3">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-warm-300 text-warm-500 transition-colors hover:border-gold-500 hover:text-gold-600"
                  >
                    <SocialIcon name={social.name as SocialName} />
                  </a>
                ))}
              </div>
            </FadeIn>
          </div>

          <ContactForm />
        </div>
      </Container>
    </>
  );
}
