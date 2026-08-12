import type { ReactNode } from "react";
import { Header, Footer } from "@/components/layouts";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
