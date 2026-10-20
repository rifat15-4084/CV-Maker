import type { SectionKey } from "@/lib/cv/schema";
import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "paper",
  name: "Paper",
  category: "Minimal",
  thumbnail: null,
  defaultAccent: "#334155",
  accentOptions: ["#334155","#0f172a","#475569","#1e293b","#0f766e","#1e3a8a"],
  fonts: fontsFor("source", "inter", "lora", "garamond"),
  supportedSections: SECTION_KEYS as unknown as SectionKey[],
  extraFields: [
    {
      "key": "sectionDividers",
      "label": "Divider lines between sections",
      "type": "toggle"
    }
  ],
  hasPhoto: false,
  description: "Quiet paper-white minimal CV with a label-and-content grid and no colour beyond a single thin rule.",
  preview: {
    "header": "stacked",
    "sidebar": "none",
    "accentRule": "underline",
    "density": "normal"
  },
};
