"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/types";

interface CartLine {
  product: Product;
  quantity: number;
}

interface CommerceState {
  wishlist: string[];
  /**
   * Product snapshots for wishlisted items, keyed by id. Products now come from the API,
   * so ids alone are not enough to render the wishlist page without refetching each one —
   * callers that have the product pass it in and we keep a copy.
   */
  wishlistItems: Record<string, Product>;
  cart: CartLine[];
  compare: string[];
}

const MAX_COMPARE = 4;

interface CommerceContextValue {
  wishlist: string[];
  cart: CartLine[];
  cartCount: number;
  compare: string[];
  wishlistItems: Product[];
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string, product?: Product) => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  moveToCart: (productId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  isCompared: (productId: string) => boolean;
  toggleCompare: (productId: string) => void;
  clearCompare: () => void;
}

const STORAGE_KEY = "forever-jewels-commerce";

const CommerceContext = createContext<CommerceContextValue | null>(null);

export function CommerceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CommerceState>({ wishlist: [], wishlistItems: {}, cart: [], compare: [] });

  useEffect(() => {
    // Read persisted state after mount only — matching the server-rendered
    // empty state first avoids a hydration mismatch on the header badges.
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setState((prev) => ({ ...prev, ...(JSON.parse(raw) as Partial<CommerceState>) }));
    } catch {
      // ignore malformed storage
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const toggleWishlist = useCallback((productId: string, product?: Product) => {
    setState((prev) => {
      const items = { ...prev.wishlistItems };
      if (prev.wishlist.includes(productId)) {
        delete items[productId];
        return { ...prev, wishlist: prev.wishlist.filter((id) => id !== productId), wishlistItems: items };
      }
      if (product) items[productId] = product;
      return { ...prev, wishlist: [...prev.wishlist, productId], wishlistItems: items };
    });
  }, []);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setState((prev) => {
      const existing = prev.cart.find((line) => line.product.id === product.id);
      const cart = existing
        ? prev.cart.map((line) =>
            line.product.id === product.id ? { ...line, quantity: line.quantity + quantity } : line
          )
        : [...prev.cart, { product, quantity }];
      return { ...prev, cart };
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setState((prev) => ({
      ...prev,
      cart: prev.cart.filter((line) => line.product.id !== productId),
    }));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setState((prev) => ({
      ...prev,
      cart:
        quantity <= 0
          ? prev.cart.filter((line) => line.product.id !== productId)
          : prev.cart.map((line) => (line.product.id === productId ? { ...line, quantity } : line)),
    }));
  }, []);

  const moveToCart = useCallback((productId: string) => {
    setState((prev) => {
      const product = prev.wishlistItems[productId];
      if (!product) return prev;
      const existing = prev.cart.find((line) => line.product.id === productId);
      const items = { ...prev.wishlistItems };
      delete items[productId];
      return {
        ...prev,
        wishlist: prev.wishlist.filter((id) => id !== productId),
        wishlistItems: items,
        cart: existing
          ? prev.cart.map((line) => (line.product.id === productId ? { ...line, quantity: line.quantity + 1 } : line))
          : [...prev.cart, { product, quantity: 1 }],
      };
    });
  }, []);

  const clearCart = useCallback(() => setState((prev) => ({ ...prev, cart: [] })), []);

  const isWishlisted = useCallback(
    (productId: string) => state.wishlist.includes(productId),
    [state.wishlist]
  );

  const toggleCompare = useCallback((productId: string) => {
    setState((prev) => {
      if (prev.compare.includes(productId)) {
        return { ...prev, compare: prev.compare.filter((id) => id !== productId) };
      }
      if (prev.compare.length >= MAX_COMPARE) return prev;
      return { ...prev, compare: [...prev.compare, productId] };
    });
  }, []);

  const clearCompare = useCallback(() => {
    setState((prev) => ({ ...prev, compare: [] }));
  }, []);

  const isCompared = useCallback(
    (productId: string) => state.compare.includes(productId),
    [state.compare]
  );

  const value = useMemo<CommerceContextValue>(
    () => ({
      wishlist: state.wishlist,
      cart: state.cart,
      cartCount: state.cart.reduce((sum, line) => sum + line.quantity, 0),
      cartSubtotal: state.cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0),
      wishlistItems: state.wishlist
        .map((id) => state.wishlistItems[id])
        .filter((product): product is Product => Boolean(product)),
      compare: state.compare,
      isWishlisted,
      toggleWishlist,
      addToCart,
      removeFromCart,
      updateQuantity,
      moveToCart,
      clearCart,
      isCompared,
      toggleCompare,
      clearCompare,
    }),
    [
      state,
      isWishlisted,
      toggleWishlist,
      addToCart,
      removeFromCart,
      updateQuantity,
      moveToCart,
      clearCart,
      isCompared,
      toggleCompare,
      clearCompare,
    ]
  );

  return <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>;
}

export function useCommerce() {
  const ctx = useContext(CommerceContext);
  if (!ctx) throw new Error("useCommerce must be used within a CommerceProvider");
  return ctx;
}
