"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import { ProductCard } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCarouselSectionProps {
  title: string;
  products: Product[];
}

export function ProductCarouselSection({ title, products }: ProductCarouselSectionProps) {
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  if (products.length === 0) return null;

  return (
    <div className="border-t border-warm-200 py-14">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl text-ink sm:text-3xl">{title}</h2>
        <div className="flex gap-2">
          <button
            ref={prevRef}
            type="button"
            aria-label="Previous"
            disabled={atStart}
            className={cn("flex h-9 w-9 items-center justify-center border border-warm-300 text-ink transition-colors", atStart ? "opacity-30" : "hover:border-gold-400")}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            ref={nextRef}
            type="button"
            aria-label="Next"
            disabled={atEnd}
            className={cn("flex h-9 w-9 items-center justify-center border border-warm-300 text-ink transition-colors", atEnd ? "opacity-30" : "hover:border-gold-400")}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={1.4}
        grabCursor
        breakpoints={{ 640: { slidesPerView: 2.3 }, 1024: { slidesPerView: 3.2 }, 1280: { slidesPerView: 4 } }}
        onBeforeInit={(swiper: SwiperClass) => {
          // @ts-expect-error - swiper types expect the elements at construction time
          swiper.params.navigation.prevEl = prevRef.current;
          // @ts-expect-error - swiper types expect the elements at construction time
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        onInit={(swiper: SwiperClass) => {
          setAtStart(swiper.isBeginning);
          setAtEnd(swiper.isEnd);
        }}
        onSlideChange={(swiper: SwiperClass) => {
          setAtStart(swiper.isBeginning);
          setAtEnd(swiper.isEnd);
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
