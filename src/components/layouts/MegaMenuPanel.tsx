import Image from "next/image";
import Link from "next/link";
import { Diamond } from "lucide-react";
import { DiamondShapeIcon } from "@/components/common";
import type { MegaMenu, NavLinkIcon } from "@/types";

interface MegaMenuPanelProps {
  menu: MegaMenu;
  onNavigate: () => void;
}

function RingIcon({ className }: { className?: string }) {
  return (
    <svg
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="14.5" r="6" />
      <path d="M9.5 8.5L12 3l2.5 5.5-2.5 2.2z" />
    </svg>
  );
}

function LinkIcon({ icon }: { icon: NavLinkIcon }) {
  if (icon === "setting") return <RingIcon className="text-gold-600" />;
  return <Diamond size={20} strokeWidth={1} className="text-gold-600" />;
}

export function MegaMenuPanel({ menu, onNavigate }: MegaMenuPanelProps) {
  return (
    <div className="flex flex-wrap gap-x-14 gap-y-10 px-8 py-10 lg:flex-nowrap xl:px-12">
      {menu.shapes && menu.shapes.length > 0 && (
        <div className="w-full shrink-0 lg:w-auto lg:basis-80">
          <p className="font-display text-sm uppercase tracking-[0.15em] text-ink">{menu.shapesHeading}</p>
          <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-4">
            {menu.shapes.map((shape) => (
              <Link
                key={shape.label}
                href={shape.href}
                onClick={onNavigate}
                className="group flex items-center gap-3 text-sm text-warm-600 transition-colors hover:text-gold-600"
              >
                <DiamondShapeIcon
                  shape={shape.shape}
                  size={26}
                  className="shrink-0 text-warm-400 transition-colors group-hover:text-gold-600"
                />
                {shape.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {menu.columns.map((column) => (
        <div key={column.heading} className="min-w-40 shrink-0 lg:basis-48">
          <p className="font-display text-sm uppercase tracking-[0.15em] text-ink">{column.heading}</p>
          <div className="mt-5 flex flex-col gap-4">
            {column.links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={onNavigate}
                className="group flex items-center gap-3 text-sm text-warm-600 transition-colors hover:text-gold-600"
              >
                {link.icon && <LinkIcon icon={link.icon} />}
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}

      {menu.promo && (
        <Link
          href={menu.promo.href ?? "#"}
          onClick={onNavigate}
          className="group relative ml-auto hidden aspect-4/3 shrink-0 basis-72 overflow-hidden xl:block"
        >
          <Image
            src={menu.promo.image}
            alt={menu.promo.alt}
            fill
            sizes="(min-width: 1280px) 25vw, 0px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
      )}
    </div>
  );
}
