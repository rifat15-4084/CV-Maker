import type { SectionKey } from "@/lib/cv/schema";
import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "circuit",
  name: "Circuit",
  category: "Tech",
  thumbnail: null,
  defaultAccent: "#06b6d4",
  accentOptions: ["#0891b2","#06b6d4","#0284c7","#0e7490","#155e75","#2563eb"],
  fonts: fontsFor("space", "dmsans", "ibmplex", "inter"),
  supportedSections: SECTION_KEYS as unknown as SectionKey[],
  extraFields: [
    {
      "key": "sectionDividers",
      "label": "Divider lines between sections",
      "type": "toggle"
    },
    {
      "key": "sectionColumns",
      "label": "Body columns",
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
    }
  ],
  hasPhoto: false,
  description: "Modern tech CV with a node marker at the name, crisp rules and a clean single-column body.",
  preview: {
    "header": "stacked",
    "sidebar": "none",
    "accentRule": "full",
    "density": "normal"
  },
};
