import type { Metadata } from "next";
import { LegalDocument, PageHero } from "@/components/content";
import { LEGAL_LAST_UPDATED, PRIVACY_SECTIONS } from "@/data/company";
import { SITE } from "@/constants/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: `How ${SITE.name} collects, uses, and protects your personal information — and the rights you have over it.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="What we collect, why we collect it, who we share it with, and how to make us stop. We do not sell your data."
      />
      <LegalDocument sections={PRIVACY_SECTIONS} lastUpdated={LEGAL_LAST_UPDATED} />
    </>
  );
}
