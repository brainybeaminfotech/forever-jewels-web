"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react";
import { Container, Logo } from "@/components/common";
import {
  AmexIcon,
  Input,
  MastercardIcon,
  PaypalIcon,
  SocialIcon,
  VisaIcon,
  type SocialName,
} from "@/components/ui";
import { SITE, SOCIAL_LINKS } from "@/constants/site";
import { CATEGORIES } from "@/data/categories";
import { categoryHref } from "@/lib/catalog";

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Our Story", href: "/our-story" },
  { label: "Contact Us", href: "/contact" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
];

const whyUsLinks = [
  { label: "Certified Diamonds", href: "/diamonds" },
  { label: "Lifetime Warranty", href: "/education/warranty" },
  { label: "Conflict-Free Sourcing", href: "/education/conflict-free" },
  { label: "Free Resizing", href: "/education/resizing" },
  { label: "Price Match Guarantee", href: "/education/price-match" },
  { label: "Free Shipping & Returns", href: "/education/shipping" },
];

const paymentIcons = [
  { name: "Visa", Icon: VisaIcon },
  { name: "Mastercard", Icon: MastercardIcon },
  { name: "American Express", Icon: AmexIcon },
  { name: "PayPal", Icon: PaypalIcon },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-white">
      <Container size="wide">
        <div className="grid grid-cols-1 gap-12 py-16 sm:py-20 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <Logo className="items-start" imgClassName="brightness-0 invert" />
            <div className="mt-6 space-y-3 text-sm text-white/60">
              <p className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 text-gold-400" />
                {SITE.address}
              </p>
              <a href={SITE.phoneHref} className="flex items-center gap-2 hover:text-gold-400">
                <Phone size={16} className="shrink-0 text-gold-400" />
                {SITE.phone}
              </a>
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-2 hover:text-gold-400">
                <Mail size={16} className="shrink-0 text-gold-400" />
                {SITE.email}
              </a>
              <p className="flex items-center gap-2">
                <Clock size={16} className="shrink-0 text-gold-400" />
                {SITE.hours}
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-display text-lg text-white">Company</h4>
            <ul className="mt-5 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/60 transition-colors hover:text-gold-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="font-display text-lg text-white">Why Forever Jewels</h4>
            <ul className="mt-5 space-y-3">
              {whyUsLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/60 transition-colors hover:text-gold-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-display text-lg text-white">Collections</h4>
            <ul className="mt-5 space-y-3">
              {CATEGORIES.slice(0, 6).map((category) => (
                <li key={category.id}>
                  <Link
                    href={categoryHref(category.slug)}
                    className="text-sm text-white/60 transition-colors hover:text-gold-400"
                  >
                    {category.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-display text-lg text-white">Stay Updated</h4>
            <p className="mt-5 text-sm text-white/60">
              Insider news on new collections, styling edits, and exclusive offers.
            </p>
            <form className="mt-5 flex items-center gap-2" onSubmit={(event) => event.preventDefault()}>
              <Input type="email" required placeholder="Enter your email" variant="light" />
              <button
                type="submit"
                aria-label="Subscribe"
                className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/30 text-white transition-colors hover:border-gold-400 hover:text-gold-400"
              >
                <ArrowRight size={16} />
              </button>
            </form>
            <div className="mt-8 flex gap-4">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-gold-400 hover:text-gold-400"
                >
                  <SocialIcon name={social.name as SocialName} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container size="wide">
          <div className="flex flex-col items-center justify-between gap-4 py-6 text-xs text-white/50 sm:flex-row">
            <p>
              &copy; {year} {SITE.name}. Since {SITE.founded}. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/privacy" className="hover:text-gold-400">Privacy Policy</Link>
              <span className="text-white/20">|</span>
              <Link href="/terms" className="hover:text-gold-400">Terms &amp; Conditions</Link>
              <span className="text-white/20">|</span>
              <Link href="/sitemap" className="hover:text-gold-400">Sitemap</Link>
            </div>
            <div className="flex items-center gap-2.5">
              {paymentIcons.map(({ name, Icon }) => (
                <span key={name} title={name} className="flex h-7 items-center overflow-hidden rounded-md ring-1 ring-white/15">
                  <Icon className="h-full w-auto" />
                </span>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
