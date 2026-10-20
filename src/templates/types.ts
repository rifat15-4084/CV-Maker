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

/**
 * Describes the template's structure so the registry can draw a preview
 * thumbnail (SVG) without shipping an image asset for every template.
 */
export interface TemplatePreviewSpec {
  header: "banner" | "stacked" | "split" | "centered" | "rail" | "band";
  sidebar: "none" | "left" | "right";
  sidebarTinted?: boolean;
  photo?: boolean;
  photoShape?: "square" | "circle";
  density?: "airy" | "normal" | "dense";
  accentRule?: "underline" | "block" | "full";
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
  description: string;
  preview: TemplatePreviewSpec;
}

export interface TemplateProps {
  data: CVData;
}

export type TemplateComponent = ComponentType<TemplateProps>;

export interface TemplateModule {
  config: TemplateConfig;
  Template: TemplateComponent;
}
