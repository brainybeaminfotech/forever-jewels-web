"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";
import { Mousewheel, Navigation } from "swiper/modules";
import "swiper/css";
import { INSTAGRAM_POSTS } from "@/data/instagram";
import { SOCIAL_LINKS } from "@/constants/site";
import { Container, SectionHeading } from "@/components/common";
import { Button, SocialIcon } from "@/components/ui";
import { cn } from "@/lib/utils";

const instagramHref = SOCIAL_LINKS.find((social) => social.name === "Instagram")?.href ?? "#";

export function InstagramGallery() {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const syncEdges = (swiper: SwiperClass) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  return (
    <section className="bg-white py-20 sm:py-28">
      <Container size="wide">
        <SectionHeading
          eyebrow="@foreverjewels"
          title="Follow Our World"
          description="Behind-the-scenes craftsmanship, styling edits, and real moments — shared daily on Instagram."
        />

        <div className="relative mt-14">
          <button
            ref={prevRef}
            type="button"
            aria-label="Previous posts"
            disabled={isBeginning}
            className="absolute -left-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-ink/15 bg-white text-ink shadow-luxury transition-colors duration-300 hover:border-navy hover:bg-navy hover:text-white disabled:pointer-events-none disabled:opacity-30 sm:flex lg:-left-5"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            ref={nextRef}
            type="button"
            aria-label="Next posts"
            disabled={isEnd}
            className="absolute -right-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-ink/15 bg-white text-ink shadow-luxury transition-colors duration-300 hover:border-navy hover:bg-navy hover:text-white disabled:pointer-events-none disabled:opacity-30 sm:flex lg:-right-5"
          >
            <ChevronRight size={18} />
          </button>

          <Swiper
            modules={[Navigation, Mousewheel]}
            grabCursor
            mousewheel={{ forceToAxis: true }}
            spaceBetween={16}
            slidesPerView={1.3}
            onSlideChange={syncEdges}
            onBeforeInit={(swiper) => {
              // @ts-expect-error swiper's typed params expect real elements, assigned post-mount
              swiper.params.navigation.prevEl = prevRef.current;
              // @ts-expect-error swiper's typed params expect real elements, assigned post-mount
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            onInit={syncEdges}
            navigation
            breakpoints={{
              480: { slidesPerView: 1.8, spaceBetween: 18 },
              640: { slidesPerView: 2.3, spaceBetween: 20 },
              900: { slidesPerView: 3.3, spaceBetween: 22 },
              1280: { slidesPerView: 4.2, spaceBetween: 24 },
            }}
          >
            {INSTAGRAM_POSTS.map((post) => (
              <SwiperSlide key={post.id}>
                <a
                  href={post.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block aspect-square w-full overflow-hidden bg-warm-100"
                >
                  <Image
                    src={post.image}
                    alt={post.caption}
                    fill
                    sizes="(max-width: 640px) 75vw, (max-width: 1280px) 32vw, 22vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-navy/80 via-navy/0 to-navy/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div
                    className={cn(
                      "absolute left-3 top-3 flex items-center gap-1.5 bg-white/90 px-2.5 py-1.5 backdrop-blur-sm transition-opacity duration-300",
                      "opacity-100 group-hover:opacity-0"
                    )}
                  >
                    <SocialIcon name="Instagram" size={13} className="text-ink" />
                    <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-ink">
                      Forever Jewels
                    </span>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 flex translate-y-3 items-center justify-between p-4 opacity-0 transition-all duration-400 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-white">
                      <Heart size={14} className="fill-white" />
                      {post.likes}
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/40 text-white transition-colors duration-300 group-hover:border-gold-300 group-hover:text-gold-300">
                      <ArrowUpRight size={14} />
                    </span>
                  </div>
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="mt-12 flex justify-center">
          <Button href={instagramHref} target="_blank" variant="outline" size="lg">
            Follow Forever Jewels
          </Button>
        </div>
      </Container>
    </section>
  );
}
