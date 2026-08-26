import type { NextConfig } from "next";

/**
 * Product imagery is served from the bucket the API reports via
 * `user/companyinfo` → `web_setting.image_base_url`, so `next/image` has to allow that
 * host. It's mirrored into NEXT_PUBLIC_IMG_URL because next.config can't make an API
 * call — keep the two in sync when pointing at a different backend.
 */
function remoteHostPatterns() {
  const candidates = [process.env.NEXT_PUBLIC_IMG_URL, process.env.NEXT_PUBLIC_REST_API_ENDPOINT];
  const seen = new Set<string>();
  const patterns: Array<{ protocol: "http" | "https"; hostname: string }> = [];

  for (const candidate of candidates) {
    if (!candidate) continue;
    try {
      const { protocol, hostname } = new URL(candidate.trim());
      const key = `${protocol}//${hostname}`;
      // The API host is plain http in some environments — honour the actual scheme
      // rather than assuming https, or images silently fail to optimise.
      if (seen.has(key)) continue;
      seen.add(key);
      patterns.push({ protocol: protocol === "http:" ? "http" : "https", hostname });
    } catch {
      // Ignore a malformed value rather than failing the build.
    }
  }
  return patterns;
}

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "diabrilliance.com" }, ...remoteHostPatterns()],
    /**
     * Next's image optimizer resolves every upstream host and refuses to fetch when any
     * returned address looks private (SSRF protection). On NAT64/DNS64 networks, public
     * hosts like the product S3 bucket resolve to `64:ff9b::/96` addresses, which that
     * check flags — so product photos fail with a 400 ("resolved to private ip") on some
     * requests and succeed on others, depending on what DNS returns that moment.
     *
     * Relaxed in development only; production keeps the protection, since a deployed
     * host resolves S3 to ordinary public addresses.
     */
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
  },
  reactStrictMode: true,
};

export default nextConfig;
