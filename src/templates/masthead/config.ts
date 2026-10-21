import type { SectionKey } from "@/lib/cv/schema";
import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "masthead",
  name: "Masthead",
  category: "Editorial",
  thumbnail: null,
  defaultAccent: "#111111",
  accentOptions: ["#111111", "#7f1d1d", "#1e3a8a", "#14532d", "#713f12", "#4c1d95"],
  fonts: fontsFor("playfair", "libre", "lora", "source"),
  supportedSections: SECTION_KEYS as unknown as SectionKey[],
  extraFields: [
    { key: "ruleStyle", label: "Rule style", type: "select", options: [
      { value: "double", label: "Double rule" },
      { value: "thick", label: "Thick single rule" },
      { value: "triple", label: "Triple rule" },
    ]},
    { key: "showDateline", label: "Show dateline row", type: "toggle" },
    { key: "smallCapsMeta", label: "Small caps meta text", type: "toggle" },
  ],
  hasPhoto: false,
  description: "Newspaper masthead with double rule, dateline-style contact row, serif headline name.",
  designNotes: "Single column editorial page. Massive serif masthead name set as a newspaper headline with double horizontal rules; contact row styled as a dateline; section headings use small caps with thin rules. Ornament is purely typographic with no sidebar, built from SectionBlock on a generous text measure.",
};
