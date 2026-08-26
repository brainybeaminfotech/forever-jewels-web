import type { Metadata } from "next";
import { LegalDocument, PageHero } from "@/components/content";
import { LEGAL_LAST_UPDATED, TERMS_SECTIONS } from "@/data/company";
import { SITE } from "@/constants/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `The terms that govern purchases from ${SITE.name} — ordering, pricing, shipping, returns, and warranty.`,
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms & Conditions"
        description="The agreement between you and us when you browse this site or buy a piece from it. Written to be read, not to be skipped."
      />
      <LegalDocument sections={TERMS_SECTIONS} lastUpdated={LEGAL_LAST_UPDATED} />
    </>
  );
}
