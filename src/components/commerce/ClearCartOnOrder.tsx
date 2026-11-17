"use client";

import { useEffect } from "react";
import { useCommerce } from "@/hooks/useCommerce";
import { CHECKOUT_DETAILS_KEY, LAST_ORDER_KEY } from "@/lib/checkout";

/**
 * Empties the bag once a Stripe session has completed. Remembers the session id so that
 * reopening the confirmation page later doesn't wipe a bag the customer has since refilled.
 */
export function ClearCartOnOrder({ sessionId }: { sessionId: string }) {
  const { ready, clearCart } = useCommerce();

  useEffect(() => {
    if (!ready) return;
    try {
      if (window.localStorage.getItem(LAST_ORDER_KEY) === sessionId) return;
      window.localStorage.setItem(LAST_ORDER_KEY, sessionId);
      window.sessionStorage.removeItem(CHECKOUT_DETAILS_KEY);
    } catch {
      // storage unavailable — still clear the in-memory bag below
    }
    clearCart();
  }, [ready, sessionId, clearCart]);

  return null;
}
