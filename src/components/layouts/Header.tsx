"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, ShoppingBag, UserRound, Menu, ChevronDown, MapPin, Phone, X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/utils/format";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useCommerce } from "@/hooks/useCommerce";
import { MAIN_NAVIGATION } from "@/data/navigation";
import { NEW_ARRIVALS } from "@/data/products";
import { SITE } from "@/constants/site";
import { Logo } from "@/components/common";
import { MobileMenu } from "./MobileMenu";
import { MegaMenuPanel } from "./MegaMenuPanel";

const CURRENCIES = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "CAD", symbol: "$" },
  { code: "AUD", symbol: "$" },
];

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const scrolled = useScrollPosition(60);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [currency, setCurrency] = useState(CURRENCIES[0]!);
  const { wishlist, cartCount } = useCommerce();
  const navRef = useRef<HTMLDivElement>(null);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useClickOutside(navRef, () => setActiveMenu(null));
  useClickOutside(desktopSearchRef, () => searchOpen && closeSearch());
  useClickOutside(mobileSearchRef, () => searchOpen && closeSearch());

  const query = searchQuery.trim().toLowerCase();
  const searchResults = useMemo(() => {
    if (!query) return [];
    return NEW_ARRIVALS.filter(
      (product) => product.name.toLowerCase().includes(query) || product.category.toLowerCase().includes(query)
    ).slice(0, 6);
  }, [query]);

  function closeSearch() {
    setSearchOpen(false);
    setSearchQuery("");
  }

  function renderSearchResults() {
    if (query === "") return null;
    return (
      <div className="max-h-[70vh] overflow-y-auto p-4">
        {searchResults.length > 0 ? (
          <div className="flex flex-col">
            {searchResults.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                onClick={closeSearch}
                className="group flex items-center gap-3 border-t border-warm-200 py-2.5 first:border-t-0 first:pt-0"
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden bg-warm-100">
                  <Image src={product.image} alt={product.name} fill sizes="48px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink group-hover:text-gold-600">{product.name}</p>
                  <p className="truncate text-xs text-warm-500">
                    {product.category} &middot; {formatPrice(product.price, product.currency)}
                  </p>
                </div>
                <ArrowUpRight size={14} className="shrink-0 text-warm-400 transition-colors group-hover:text-gold-600" />
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-warm-500">No results for &ldquo;{searchQuery.trim()}&rdquo;.</p>
        )}
      </div>
    );
  }

  function renderSearchDropdown(align: "left" | "right") {
    return (
      <AnimatePresence>
        {searchOpen && query !== "" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "absolute top-full z-50 mt-3 w-[90vw] max-w-sm border border-warm-200 bg-white text-ink shadow-luxury-lg sm:w-96",
              align === "left" ? "left-0" : "right-0"
            )}
          >
            {renderSearchResults()}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  function renderMobileSearchDropdown() {
    return (
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-full z-50 mt-3 w-[90vw] max-w-sm border border-warm-200 bg-white text-ink shadow-luxury-lg"
          >
            <div className="flex items-center gap-3 border-b border-warm-200 px-4 py-3">
              <Search size={18} className="shrink-0 text-warm-400" />
              <input
                autoFocus
                type="text"
                autoComplete="off"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search products…"
                className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-warm-400"
              />
              <button
                type="button"
                onClick={closeSearch}
                aria-label="Close search"
                className="shrink-0 text-warm-500 hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>
            {renderSearchResults()}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  const solid = !isHome || scrolled || activeMenu !== null || searchOpen;
  const textTone = solid ? "text-ink" : "text-white";

  function openMenu(label: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveMenu(label);
  }

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setActiveMenu(null), 150);
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-80 transition-colors duration-500",
          solid ? "bg-white shadow-luxury" : "bg-transparent"
        )}
      >
        {/* Utility bar */}
        <div className={cn("hidden border-b lg:block", solid ? "border-warm-200/70" : "border-white/20")}>
          <div className="mx-auto flex max-w-360 items-center justify-between px-8 py-2 text-xs xl:px-12">
            <div className={cn("flex items-center gap-6", textTone)}>
              <span className="flex items-center gap-1.5">
                <MapPin size={13} /> {SITE.address}
              </span>
              <a href={SITE.phoneHref} className="flex items-center gap-1.5 hover:text-gold-500">
                <Phone size={13} /> {SITE.phone}
              </a>
            </div>
            <div className={cn("flex items-center gap-6", textTone)}>
              <div className="group relative">
                <button type="button" className="flex items-center gap-1 hover:text-gold-500">
                  {currency.code} {currency.symbol}
                  <ChevronDown size={12} />
                </button>
                <div className="invisible absolute left-0 top-full z-50 mt-2 w-32 border border-warm-200 bg-white text-ink opacity-0 shadow-luxury transition-all duration-200 group-hover:visible group-hover:opacity-100">
                  {CURRENCIES.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => setCurrency(item)}
                      className={cn(
                        "flex w-full items-center justify-between px-3 py-2 text-left text-xs hover:bg-warm-100 hover:text-gold-600",
                        currency.code === item.code && "text-gold-600"
                      )}
                    >
                      <span>{item.code}</span>
                      <span>{item.symbol}</span>
                    </button>
                  ))}
                </div>
              </div>
              <Link href="/login" className="hover:text-gold-500">
                Login
              </Link>
              <Link href="/signup" className="hover:text-gold-500">
                Register
              </Link>
            </div>
          </div>
        </div>

        {/* Main row */}
        <div className="mx-auto grid max-w-360 grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 py-4 sm:px-8 lg:px-12 lg:py-5">
          <div className="flex items-center justify-start">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className={cn(textTone, "lg:hidden")}
            >
              <Menu size={24} />
            </button>

            <div ref={desktopSearchRef} className={cn("relative hidden items-center gap-2 lg:flex", textTone)}>
              <Search size={16} className="shrink-0" />
              <input
                type="text"
                autoComplete="off"
                value={searchQuery}
                onFocus={() => setSearchOpen(true)}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setSearchOpen(true);
                }}
                placeholder="Search"
                className="w-20 border-b border-transparent bg-transparent pb-0.5 text-xs uppercase tracking-[0.15em] outline-none placeholder:text-current placeholder:opacity-70 transition-[width,border-color] duration-300 focus:w-40 focus:border-current"
              />
              {searchQuery && (
                <button type="button" onClick={closeSearch} aria-label="Clear search" className="shrink-0 hover:text-gold-500">
                  <X size={14} />
                </button>
              )}
              {renderSearchDropdown("left")}
            </div>
          </div>

          <Logo theme={solid ? "dark" : "light"} />

          <div className="flex items-center justify-end gap-4 sm:gap-5">
            <div ref={mobileSearchRef} className="relative lg:hidden">
              <button
                type="button"
                onClick={() => (searchOpen ? closeSearch() : setSearchOpen(true))}
                aria-label="Toggle search"
                className={textTone}
              >
                <Search size={20} />
              </button>
              {renderMobileSearchDropdown()}
            </div>
            <Link href="/wishlist" aria-label="Wishlist" className={cn("relative hover:text-gold-500", textTone)}>
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-500 px-1 text-[10px] font-semibold text-ink">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link href="/cart" aria-label="Cart" className={cn("relative hover:text-gold-500", textTone)}>
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-500 px-1 text-[10px] font-semibold text-ink">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link href="/account" aria-label="Account" className={cn("hidden hover:text-gold-500 sm:inline-flex", textTone)}>
              <UserRound size={20} />
            </Link>
          </div>
        </div>

        {/* Desktop nav row */}
        <div ref={navRef} className={cn("hidden border-t lg:block", solid ? "border-warm-200/70" : "border-white/20")}>
          <nav className="mx-auto flex max-w-360 items-center justify-center gap-5 overflow-x-auto no-scrollbar px-8 py-3.5 xl:gap-9 xl:px-12">
            {MAIN_NAVIGATION.map((item) => {
              const hasMenu = Boolean(item.children || item.megaMenu);
              return (
                <div
                  key={item.label}
                  className="relative shrink-0"
                  onMouseEnter={() => hasMenu && openMenu(item.label)}
                  onMouseLeave={() => hasMenu && scheduleClose()}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1 whitespace-nowrap text-xs font-medium uppercase tracking-[0.15em] transition-colors duration-300 hover:text-gold-500",
                      textTone
                    )}
                  >
                    {item.label}
                    {hasMenu && <ChevronDown size={12} />}
                  </Link>
                </div>
              );
            })}
          </nav>

          <AnimatePresence>
            {activeMenu && (() => {
              const menuItem = MAIN_NAVIGATION.find((item) => item.label === activeMenu);
              if (!menuItem || !(menuItem.children || menuItem.megaMenu)) return null;
              return (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  onMouseEnter={() => openMenu(activeMenu)}
                  onMouseLeave={scheduleClose}
                  className="absolute inset-x-0 top-full"
                >
                  <div className="mx-auto max-w-360 px-8 xl:px-12">
                    <div className="border border-warm-200 bg-white shadow-luxury-lg">
                      {menuItem.megaMenu ? (
                        <MegaMenuPanel menu={menuItem.megaMenu} onNavigate={() => setActiveMenu(null)} />
                      ) : (
                        <div className="flex flex-wrap gap-x-12 gap-y-4 px-8 py-8 xl:px-12">
                          {menuItem.children?.map((child) => (
                            <Link key={child.label} href={child.href} className="group max-w-xs" onClick={() => setActiveMenu(null)}>
                              <p className="font-display text-lg text-ink group-hover:text-gold-600">{child.label}</p>
                              {child.description && (
                                <p className="mt-1 text-sm text-warm-500">{child.description}</p>
                              )}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </div>
      </motion.header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
