import Image from "next/image";
import type { ReactNode } from "react";
import { Gem } from "lucide-react";
import { FadeIn } from "@/components/animations";
import { Container, Logo } from "@/components/common";

interface AuthLayoutProps {
  image: string;
  eyebrow: string;
  heading: string;
  quote: string;
  children: ReactNode;
}

export function AuthLayout({ image, eyebrow, heading, quote, children }: AuthLayoutProps) {
  return (
    <section className="bg-warm-50 pb-16 pt-34 sm:pb-20 sm:pt-38 lg:pb-24 lg:pt-65">
      <Container size="wide">
        <div className="grid overflow-hidden bg-white shadow-luxury-lg lg:grid-cols-2">
          {/* Image panel */}
          <div className="relative hidden min-h-160 lg:block">
            <Image src={image} alt="" fill priority sizes="50vw" className="object-cover" />
            <div className="absolute inset-0 bg-linear-to-t from-navy/95 via-navy/55 to-navy/25" />
            <div className="relative flex h-full flex-col justify-end p-12 xl:p-16">
              <FadeIn direction="up" className="max-w-md">
                <span className="mb-5 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.4em] text-gold-300">
                  <Gem size={14} />
                  {eyebrow}
                </span>
                <p className="text-balance font-display text-3xl leading-snug text-white xl:text-4xl">{heading}</p>
                <div className="mt-6 h-px w-14 bg-gold-400" />
                <p className="mt-6 text-balance text-sm leading-relaxed text-white/70">{quote}</p>
              </FadeIn>
            </div>
          </div>

          {/* Form panel */}
          <div className="flex flex-col justify-center px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20 xl:px-20">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-10 flex justify-center lg:hidden">
                <Logo />
              </div>
              {children}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
