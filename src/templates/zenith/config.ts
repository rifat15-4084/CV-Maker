import type { SectionKey } from "@/lib/cv/schema";
import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "zenith",
  name: "Zenith",
  category: "Modern",
  thumbnail: null,
  defaultAccent: "#4f46e5",
  accentOptions: ["#7c3aed","#8b5cf6","#6d28d9","#a855f7","#4c1d95","#2563eb"],
  fonts: fontsFor("space", "montserrat", "inter", "dmsans"),
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
  description: "Gradient masthead over a clean single column with numbered section markers and a relaxed measure.",
  preview: {
    "header": "band",
    "sidebar": "none",
    "accentRule": "full",
    "density": "normal"
  },
};
