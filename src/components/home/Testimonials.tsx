"use client";

import Image from "next/image";
import { Quote } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { TESTIMONIALS } from "@/data/reviews";
import { Container, SectionHeading } from "@/components/common";
import { Rating } from "@/components/ui";

export function Testimonials() {
  return (
    <section className="bg-cream py-20 sm:py-28">
      <Container size="wide">
        <SectionHeading
          eyebrow="Client Stories"
          title="Loved By Forever Jewels Clients"
          description="Real words from the people who trusted us with their most meaningful moments."
        />

        <div className="mt-14">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={28}
            slidesPerView={1}
            autoplay={{ delay: 5500, disableOnInteraction: false }}
            loop
            pagination={{ clickable: true, el: ".testimonial-pagination" }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1200: { slidesPerView: 3 },
            }}
            className="pb-4"
          >
            {TESTIMONIALS.map((testimonial) => (
              <SwiperSlide key={testimonial.id} className="pb-2">
                <div className="flex min-h-85 flex-col bg-white p-8 shadow-luxury">
                  <Quote className="text-gold-300" size={32} />
                  <p className="mt-5 line-clamp-4 flex-1 text-balance text-sm sm:text-base leading-relaxed text-warm-700">
                    &ldquo;{testimonial.review}&rdquo;
                  </p>
                  <Rating value={testimonial.rating} className="mt-6" />
                  <div className="mt-4 flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                      {/* ~10 KB avatars — served as-is, not through the quota-limited optimizer. */}
                      <Image src={testimonial.image} alt={testimonial.name} fill sizes="48px" unoptimized className="object-cover" />
                    </div>
                    <div>
                      <p className="font-display text-base text-ink">{testimonial.name}</p>
                      <p className="text-xs text-warm-500">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="testimonial-pagination mt-8 flex justify-center gap-2" />
        </div>
      </Container>
    </section>
  );
}
