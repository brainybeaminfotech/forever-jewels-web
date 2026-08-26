/**
 * REST client for the shared tcctech backend.
 *
 * This is the fetch equivalent of tcctechweb's axios instance
 * (`@framework/utils/http`) and reproduces its two request interceptors and its
 * response interceptor exactly, because the backend is the same service:
 *   - `Authorization: <auth token | PUBLIC_AUTHORIZATION_TOKEN>` (note: no `Bearer ` prefix)
 *   - every request gets `?company_key=<AES-CBC hex of NEXT_PUBLIC_COMPANY_INFO_KEY>`
 *   - when NEXT_PUBLIC_SECURE_COMMUNICATION is "true", request bodies are encrypted and
 *     the response body arrives as hex ciphertext that must be decrypted then JSON-parsed
 *
 * Why fetch instead of axios: this site calls the API from async Server Components, so
 * requests go through Next's fetch cache (`next: { revalidate }`) for ISR. axios bypasses
 * that cache entirely, which would re-hit the API on every render.
 */

import { decryptRequestData, encryptCompanyKey, encryptResponseData } from "@utils/encrypt-decrypt-data";
import { getToken } from "./get-token";

/** Base URL, e.g. `https://betapi.tcctechno.com/api/v4`. Trimmed — the shared .env values often carry stray spaces. */
export const REST_API_ENDPOINT = (process.env.NEXT_PUBLIC_REST_API_ENDPOINT ?? "").trim().replace(/\/+$/, "");

const COMPANY_INFO_KEY = (process.env.NEXT_PUBLIC_COMPANY_INFO_KEY ?? "").trim();

const isSecureCommunication = () => process.env.NEXT_PUBLIC_SECURE_COMMUNICATION === "true";

export function isApiConfigured(): boolean {
  return REST_API_ENDPOINT.length > 0;
}

export class ApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export type QueryValue = string | number | boolean | undefined | null;

function buildUrl(path: string, query?: Record<string, QueryValue>): string {
  const url = new URL(`${REST_API_ENDPOINT}/${path.replace(/^\/+/, "")}`);

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value === undefined || value === null || value === "") continue;
    url.searchParams.set(key, String(value));
  }

  // Request interceptor parity: company_key is appended to every request.
  if (!url.searchParams.has("company_key")) {
    url.searchParams.set("company_key", encryptCompanyKey(COMPANY_INFO_KEY));
  }

  return url.toString();
}

/**
 * Response interceptor parity. With secure communication on, the body is hex ciphertext —
 * either raw, or JSON-encoded as a quoted string depending on the endpoint — so both are
 * handled before decrypting.
 */
function parseBody<T>(raw: string, path: string, status: number): T {
  if (!isSecureCommunication()) {
    try {
      return JSON.parse(raw) as T;
    } catch {
      throw new ApiError(`Response from ${path} was not valid JSON.`, status);
    }
  }

  let cipherHex = raw.trim();
  try {
    const parsed: unknown = JSON.parse(cipherHex);
    // A quoted hex string decodes to a string; an already-plain JSON object means the
    // endpoint replied unencrypted despite the flag, so pass it straight through.
    if (typeof parsed === "string") cipherHex = parsed;
    else return parsed as T;
  } catch {
    // Raw (unquoted) hex ciphertext — use as-is.
  }

  const decrypted = decryptRequestData(cipherHex);
  if (!decrypted) {
    throw new ApiError(
      `Could not decrypt the response from ${path}. Check NEXT_PUBLIC_ENCRYPT_DECRYPT_KEY / _IV.`,
      status,
    );
  }

  try {
    return JSON.parse(decrypted) as T;
  } catch {
    throw new ApiError(`Decrypted response from ${path} was not valid JSON.`, status);
  }
}

export interface HttpGetOptions {
  query?: Record<string, QueryValue>;
  /** Seconds to cache the response for (Next.js ISR). */
  revalidate?: number;
  signal?: AbortSignal;
  /** POST only: wrap the body as `{ data: <hex ciphertext> }`. Off by default — see `request`. */
  encryptBody?: boolean;
}

async function request<T>(method: "GET" | "POST", path: string, body?: unknown, options: HttpGetOptions = {}): Promise<T> {
  if (!isApiConfigured()) {
    throw new ApiError("NEXT_PUBLIC_REST_API_ENDPOINT is not set — API requests are disabled.");
  }

  const { query, revalidate = 300, signal } = options;
  const url = buildUrl(path, query);
  const token = getToken();

  const headers: Record<string, string> = {
    Accept: "*/*",
    "Content-Type": "application/json",
    Authorization: token || "PUBLIC_AUTHORIZATION_TOKEN",
  };

  let payload: string | undefined;
  if (body !== undefined) {
    // tcctechweb's axios wraps POST bodies as `{ data: <hex> }` when secure communication
    // is on, but THIS backend rejects that — `user/product/details` answers an encrypted
    // body with "Product not found!" and only accepts plain JSON (which is also how
    // tcctechweb's own server-side product-detail fetch calls it). Encryption is therefore
    // opt-in per request rather than driven by the env flag.
    payload = JSON.stringify(options.encryptBody ? { data: encryptResponseData(body) } : body);
  }

  let response: Response;
  try {
    response = await fetch(url, { method, headers, body: payload, signal, next: { revalidate } });
  } catch (cause) {
    throw new ApiError(`Network request to ${path} failed: ${(cause as Error).message}`);
  }

  const raw = await response.text();

  if (!response.ok) {
    throw new ApiError(`Request to ${path} failed with ${response.status}.`, response.status);
  }

  return parseBody<T>(raw, path, response.status);
}

const http = {
  get: <T>(path: string, options?: HttpGetOptions) => request<T>("GET", path, undefined, options),
  post: <T>(path: string, body?: unknown, options?: HttpGetOptions) => request<T>("POST", path, body, options),
};

export default http;
