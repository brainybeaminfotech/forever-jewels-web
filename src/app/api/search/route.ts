import { NextResponse } from "next/server";
import { searchProducts } from "@framework/product/get-search-products";

/**
 * Server-side proxy for the header typeahead.
 *
 * The header is a client component, but the REST API is served over plain http in some
 * environments — a browser on an https page would block that as mixed content. Proxying
 * keeps the call server-side and keeps the auth token out of the browser bundle.
 */
export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q") ?? "";
  if (query.trim().length < 2) return NextResponse.json({ results: [] });

  const results = await searchProducts(query);
  return NextResponse.json({ results });
}
