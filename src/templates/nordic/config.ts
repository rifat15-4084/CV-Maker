import type { SectionKey } from "@/lib/cv/schema";
import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "nordic",
  name: "Nordic",
  category: "Minimal",
  thumbnail: null,
  defaultAccent: "#475569",
  accentOptions: ["#334155","#0f172a","#475569","#1e293b","#0f766e","#1e3a8a"],
  fonts: fontsFor("inter", "ibmplex", "source", "system"),
  supportedSections: SECTION_KEYS as unknown as SectionKey[],
  extraFields: [
    {
      "key": "sectionDividers",
      "label": "Divider lines between sections",
      "type": "toggle"
    }
  ],
  hasPhoto: false,
  description: "Scandinavian minimal CV: vast whitespace, a single hairline rule and near-weightless typography.",
  preview: {
    "header": "stacked",
    "sidebar": "none",
    "accentRule": "underline",
    "density": "airy"
  },
};
