"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "forever-jewels-recently-viewed";
const MAX_ITEMS = 8;

function readIds(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

/** Tracks the current product as viewed, and returns the other recently-viewed ids. */
export function useRecentlyViewed(currentProductId: string): string[] {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const existing = readIds();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIds(existing.filter((id) => id !== currentProductId));

    const next = [currentProductId, ...existing.filter((id) => id !== currentProductId)].slice(0, MAX_ITEMS);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, [currentProductId]);

  return ids;
}
