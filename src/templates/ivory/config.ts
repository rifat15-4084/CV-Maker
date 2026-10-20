import type { SectionKey } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "ivory",
  name: "Ivory",
  category: "Minimal",
  thumbnail: null,
  defaultAccent: "#334155",
  accentOptions: ["#334155", "#7f1d1d", "#1e3a8a", "#3f6212", "#713f12", "#4c1d95"],
  fonts: fontsFor("libre", "garamond", "lora", "merriweather"),
  supportedSections: [
    "summary",
    "experience",
    "education",
    "skills",
    "projects",
    "certifications",
    "languages",
    "awards",
    "custom",
  ] as SectionKey[],
  extraFields: [
    { key: "showLabels", label: "Show left column labels", type: "toggle" },
    { key: "contactSeparators", label: "Contact separators", type: "select", options: [
      { value: "dot", label: "Middle dots" },
      { value: "pipe", label: "Pipes" },
      { value: "none", label: "None" },
    ] },
  ],
  hasPhoto: false,
  description:
    "Editorial minimal CV: wide margins, serif display type and a quiet left label column — understated and highly readable.",
  designNotes:
    "Single column at wide margins with a 34mm left label gutter. Stacked serif name over an ink rule, contact line, then a faint second rule; section headings are plain caps labels sitting in the gutter with no rules at all.",
};
