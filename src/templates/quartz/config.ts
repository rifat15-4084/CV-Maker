import type { SectionKey } from "@/lib/cv/schema";
import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "quartz",
  name: "Quartz",
  category: "Modern",
  thumbnail: null,
  defaultAccent: "#0f766e",
  accentOptions: ["#0f766e","#0891b2","#14b8a6","#059669","#155e75","#334155"],
  fonts: fontsFor("ibmplex", "source", "inter", "dmsans"),
  supportedSections: SECTION_KEYS as unknown as SectionKey[],
  extraFields: [
    {
      "key": "skillColumns",
      "label": "Skill columns",
      "type": "select",
      "options": [
        {
          "value": "1",
          "label": "One column"
        },
        {
          "value": "2",
          "label": "Two columns"
        }
      ]
    },
    {
      "key": "sectionDividers",
      "label": "Divider lines between sections",
      "type": "toggle"
    }
  ],
  hasPhoto: false,
  description: "Crystalline two-column CV with a solid accent header bar, boxed headings and a grouped skills matrix.",
  preview: {
    "header": "band",
    "sidebar": "none",
    "accentRule": "block",
    "density": "normal"
  },
};
