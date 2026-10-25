"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import { HERO_SLIDES } from "@/data/hero";
import { Button } from "@/components/ui";
import { Container } from "@/components/common";

function SlideContent({ slide, isActive }: { slide: (typeof HERO_SLIDES)[number]; isActive: boolean }) {
  const align = slide.align ?? "center";

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
  };
  const item = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const } },
  };

  const horizontalJustify = align === "left" ? "justify-start" : align === "right" ? "justify-end" : "justify-center";
  const textAlign = align === "left" ? "text-left items-start" : align === "right" ? "text-right items-end" : "text-center items-center";
  const ctaAlign = align === "left" ? "justify-start" : align === "right" ? "justify-end" : "justify-center";
  const marginAlign = align === "center" ? "mx-auto" : "";

  return (
    <Container size="wide" className={`relative flex h-full items-center ${horizontalJustify}`}>
      <motion.div
        initial="hidden"
        animate={isActive ? "visible" : "hidden"}
        variants={container}
        className={`flex w-full max-w-xl flex-col ${textAlign}`}
      >
        <motion.span
          variants={item}
          className="mb-5 inline-block text-xs sm:text-sm font-medium uppercase tracking-[0.4em] text-gold-300"
        >
          {slide.eyebrow}
        </motion.span>
        <motion.h1
          variants={item}
          className="text-balance font-display text-4xl leading-[1.1] text-white sm:text-6xl lg:text-7xl"
        >
          {slide.title}
        </motion.h1>
        <motion.p
          variants={item}
          className={`mt-6 max-w-xl text-balance text-sm sm:text-base text-white/80 ${marginAlign}`}
        >
          {slide.subtitle}
        </motion.p>
        <motion.div variants={item} className={`mt-9 flex flex-wrap items-center gap-4 ${ctaAlign}`}>
          <Button href={slide.ctaPrimary.href} variant="secondary" size="lg">
            {slide.ctaPrimary.label}
          </Button>
          <Button href={slide.ctaSecondary.href} variant="outline-light" size="lg">
            {slide.ctaSecondary.label}
          </Button>
        </motion.div>
      </motion.div>
    </Container>
  );
}

function ScrollHint() {
  return (
    <motion.div
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      className="pointer-events-none absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/70"
    >
      <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
      <ChevronDown size={18} />
    </motion.div>
  );
}

export function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative h-dvh min-h-[600px] w-full overflow-hidden bg-navy">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={1200}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        loop
        pagination={{ clickable: true, el: ".hero-pagination" }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="h-full w-full"
      >
        {HERO_SLIDES.map((slide, index) => {
          const align = slide.align ?? "center";
          const sideGradient =
            align === "left"
              ? "bg-gradient-to-r from-navy/85 via-navy/40 to-transparent"
              : align === "right"
                ? "bg-gradient-to-l from-navy/85 via-navy/40 to-transparent"
                : "bg-gradient-to-t from-navy/80 via-navy/30 to-navy/50";

          return (
          <SwiperSlide key={slide.id} className="relative h-full w-full">
            <div className="absolute inset-0">
              <Image
                src={slide.src}
                alt={slide.title}
                fill
                priority={index === 0}
                sizes="100vw"
                // Banners are pre-compressed WebPs (≤250 KB) — served as-is so the hero
                // doesn't depend on Vercel's image-optimization quota (402s once it runs out).
                unoptimized
                className="object-cover"
              />
              <div className={`absolute inset-0 ${sideGradient}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-navy/10" />
            </div>
            <div className="relative z-10 h-full">
              <SlideContent slide={slide} isActive={activeIndex === index} />
            </div>
          </SwiperSlide>
          );
        })}
      </Swiper>

      <div className="hero-pagination absolute inset-x-0 bottom-14 z-20 flex justify-center gap-2 sm:bottom-16" />

      <ScrollHint />
    </section>
  );
}
