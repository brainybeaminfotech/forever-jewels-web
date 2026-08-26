/** One heading + prose (+ optional bullets) block in a long-form document. */
export interface ContentSection {
  id: string;
  title: string;
  body: string[];
  bullets?: string[];
}
