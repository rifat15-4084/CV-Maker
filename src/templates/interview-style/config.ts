import type { SectionKey } from "@/lib/cv/schema";
import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "interview-style",
  name: "Interview Style",
  category: "Editorial",
  thumbnail: null,
  defaultAccent: "#111111",
  accentOptions: ["#111111", "#7f1d1d", "#1e3a8a", "#14532d", "#713f12", "#4c1d95"],
  fonts: fontsFor("playfair", "libre", "lora", "source"),
  supportedSections: SECTION_KEYS as unknown as SectionKey[],
  extraFields: [],
  hasPhoto: false,
  description: "Q&A summary, speech-bubble tags.",
  designNotes: "Distinct editorial/geometric layout with original structure and typography.",
};
