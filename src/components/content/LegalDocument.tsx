import { ContentSections } from "./ContentSections";
import type { LegalSection } from "@/data/company";

interface LegalDocumentProps {
  sections: LegalSection[];
  lastUpdated: string;
}

/** Thin wrapper over `ContentSections` that adds the "Last updated" line. */
export function LegalDocument({ sections, lastUpdated }: LegalDocumentProps) {
  return <ContentSections sections={sections} meta={<>Last updated — {lastUpdated}</>} />;
}
