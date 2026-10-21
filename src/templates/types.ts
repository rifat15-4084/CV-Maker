import type { ComponentType } from "react";
import type { CVData, SectionKey } from "@/lib/cv/schema";

/* ==========================================================================
   Template contracts
   A template = a folder under /src/templates containing:
     - config.ts  → `export const config: TemplateConfig`
     - index.tsx  → `export function Template({ data }: TemplateProps)`
   `scripts/generate-registry.mjs` scans the folder and writes
   `src/templates/manifest.ts`, which `registry.ts` exposes.
   ========================================================================== */

export const TEMPLATE_CATEGORIES = [
  "Modern",
  "Creative",
  "Minimal",
  "Professional",
  "Tech",
  "Academic",
  "Executive",
  "Editorial",
  "Geometric",
  "Bold",
  "Infographic",
  "Elegant",
  "Luxury",
  "Grid",
] as const;

export type TemplateCategory = (typeof TEMPLATE_CATEGORIES)[number];

export interface TemplateFontOption {
  id: string;
  label: string;
  /** Full CSS font-family stack. */
  stack: string;
}

export type ExtraFieldType = "text" | "textarea" | "toggle" | "select" | "color";

export interface TemplateExtraField {
  key: string;
  label: string;
  type: ExtraFieldType;
  options?: { value: string; label: string }[];
  help?: string;
}

export interface TemplateConfig {
  /** Must equal the folder name. */
  id: string;
  name: string;
  category: TemplateCategory;
  /** Optional hand-made thumbnail (public path). Usually null → generated. */
  thumbnail: string | null;
  defaultAccent: string;
  accentOptions: string[];
  fonts: TemplateFontOption[];
  supportedSections: SectionKey[];
  extraFields: TemplateExtraField[];
  hasPhoto: boolean;
  /** Marketing copy shown in the gallery and picker. */
  description: string;
  /**
   * Short developer-facing note on what makes this design distinct: the
   * layout skeleton, the distinguishing treatments, and which `_kit`
   * primitives to use if you extend it.
   *
   * This is the shared vocabulary that keeps 60 templates from collapsing into
   * "the same layout with a different colour" — see the uniqueness gate in
   * `src/components/templates/thumbnails.test.ts`.
   */
  designNotes: string;
}

export interface TemplateProps {
  data: CVData;
}

export type TemplateComponent = ComponentType<TemplateProps>;

export interface TemplateModule {
  config: TemplateConfig;
  Template: TemplateComponent;
}
