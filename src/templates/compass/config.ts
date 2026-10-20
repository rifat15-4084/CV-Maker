import type { SectionKey } from "@/lib/cv/schema";
import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "compass",
  name: "Compass",
  category: "Professional",
  thumbnail: null,
  defaultAccent: "#334155",
  accentOptions: ["#334155","#0f172a","#475569","#1e293b","#0f766e","#1e3a8a"],
  fonts: fontsFor("source", "inter", "dmsans", "system"),
  supportedSections: SECTION_KEYS as unknown as SectionKey[],
  extraFields: [
    {
      "key": "showPhoto",
      "label": "Show photo",
      "type": "toggle"
    },
    {
      "key": "contactColumns",
      "label": "Contact columns",
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
  hasPhoto: true,
  description: "Balanced professional CV with a round photo, two-column contact header and measured section spacing.",
  preview: {
    "header": "split",
    "sidebar": "none",
    "photo": true,
    "photoShape": "circle",
    "accentRule": "underline",
    "density": "normal"
  },
};
