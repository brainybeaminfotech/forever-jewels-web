import type { Metadata } from "next";
import Image from "next/image";
import { Gem } from "lucide-react";
import { FadeIn } from "@/components/animations";
import { Button } from "@/components/ui";
import { AutoRedirect, Logo } from "@/components/common";
import { IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you're looking for could not be found.",
};

export default function NotFound() {
  return (
    <section className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-navy px-6 py-20">
      <Image
        src={IMAGES.handcrafted.primary}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-linear-to-b from-navy via-navy/95 to-navy" />

      <div className="relative z-10 flex w-full max-w-xl flex-col items-center text-center">
        <FadeIn direction="up">
          <Logo theme="light" />
        </FadeIn>

        <FadeIn direction="up" delay={0.1} className="mt-10 flex items-center justify-center gap-3 sm:gap-5">
          <span className="font-display text-7xl text-white sm:text-8xl">4</span>
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold-400/50 sm:h-20 sm:w-20">
            <Gem size={30} className="text-gold-400 sm:size-9" />
          </span>
          <span className="font-display text-7xl text-white sm:text-8xl">4</span>
        </FadeIn>

        <FadeIn direction="up" delay={0.2}>
          <h1 className="mt-8 text-balance font-display text-2xl leading-snug text-white sm:text-3xl">
            This piece has slipped off its setting.
          </h1>
          <p className="mt-4 text-balance text-sm leading-relaxed text-white/60 sm:text-base">
            The page you&apos;re looking for may have been moved, renamed, or never set at all.
            Let&apos;s guide you back to something beautiful.
          </p>
        </FadeIn>

        <FadeIn direction="up" delay={0.3} className="mt-9 flex flex-col items-center gap-4">
          <Button href="/" variant="secondary" size="lg">
            Return Home
          </Button>
          <p className="text-xs text-white/40">You&apos;ll be redirected to the homepage shortly.</p>
        </FadeIn>
      </div>

      <AutoRedirect to="/" delay={6000} />
    </section>
  );
}
