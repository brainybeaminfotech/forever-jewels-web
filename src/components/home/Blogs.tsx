import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { BLOG_POSTS } from "@/data/blogs";
import { Container, SectionHeading } from "@/components/common";
import { StaggerContainer, StaggerItem } from "@/components/animations";
import { formatDate } from "@/utils/format";

export function Blogs() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <Container size="wide">
        <SectionHeading
          eyebrow="From The Journal"
          title="Diamond Education & Stories"
          description="Guides, care tips, and behind-the-scenes looks from our atelier."
        />

        <StaggerContainer className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {BLOG_POSTS.map((post) => (
            <StaggerItem key={post.id}>
              <Link href={`/blogs/${post.slug}`} className="group flex h-full flex-col">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 90vw, 24vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <span className="absolute left-4 top-4 bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink">
                    {post.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col pt-5">
                  <span className="flex items-center gap-1.5 text-xs text-warm-500">
                    <CalendarDays size={13} />
                    {formatDate(post.date)} · {post.readTime}
                  </span>
                  <h3 className="mt-3 font-display text-lg leading-snug text-ink transition-colors group-hover:text-gold-600">
                    {post.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-warm-600 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.2em] text-gold-600">
                    Read More
                    <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </section>
  );
}
