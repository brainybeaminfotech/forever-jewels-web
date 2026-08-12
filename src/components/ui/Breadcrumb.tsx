import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  light?: boolean;
}

export function Breadcrumb({ items, className, light = false }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex flex-wrap items-center gap-1.5 text-xs", className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className={cn(
                  "uppercase tracking-[0.1em] transition-colors",
                  light ? "text-white/70 hover:text-white" : "text-warm-500 hover:text-gold-600"
                )}
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current={isLast ? "page" : undefined}
                className={cn(
                  "uppercase tracking-[0.1em]",
                  light ? "text-white" : "text-ink",
                  isLast && "font-medium"
                )}
              >
                {item.label}
              </span>
            )}
            {!isLast && (
              <ChevronRight size={12} className={light ? "text-white/50" : "text-warm-400"} />
            )}
          </span>
        );
      })}
    </nav>
  );
}
