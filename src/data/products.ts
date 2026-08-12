import type { Product } from "@/types";
import { getNewArrivals } from "@/lib/catalog";

/** A diverse spread of real products — one of every jewellery type, newest first. */
export const NEW_ARRIVALS: Product[] = getNewArrivals(8);
