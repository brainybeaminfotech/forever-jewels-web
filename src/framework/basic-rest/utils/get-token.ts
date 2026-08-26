import { AUTH_TOKEN } from "@utils/constants";

/**
 * Mirrors tcctechweb's `@framework/utils/get-token`. Returns "" on the server —
 * requests then fall back to the public authorization token, which is what the
 * featured-product feed (an unauthenticated endpoint) needs.
 */
export const getToken = (): string => {
  if (typeof window === "undefined") return "";
  const match = document.cookie.match(new RegExp(`(?:^|; )${AUTH_TOKEN}=([^;]*)`));
  return match?.[1] ? decodeURIComponent(match[1]) : "";
};
