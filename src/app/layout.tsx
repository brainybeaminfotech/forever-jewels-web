import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Playfair_Display, Cormorant_Garamond, Inter } from "next/font/google";
import { SITE } from "@/constants/site";
import { CommerceProvider } from "@/hooks/useCommerce";
import { FloatingActionMenu } from "@/components/layouts";
import "@/styles/globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "luxury jewelry",
    "engagement rings",
    "diamond jewelry",
    "fine jewelry",
    "wedding rings",
    "custom jewellery",
    SITE.name,
  ],
  authors: [{ name: SITE.name }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.description,
    images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.description,
    images: [SITE.ogImage],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${cormorant.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <CommerceProvider>
          {children}
          <FloatingActionMenu />
        </CommerceProvider>
        {/* Right-click / double-click / DevTools-shortcut deterrent — see public/security.js */}
        <Script src="/security.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
