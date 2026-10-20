import type { SectionKey } from "@/lib/cv/schema";
import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "sterling",
  name: "Sterling",
  category: "Professional",
  thumbnail: null,
  defaultAccent: "#1e3a8a",
  accentOptions: ["#1e3a8a","#172554","#1d4ed8","#0f172a","#1e40af","#312e81"],
  fonts: fontsFor("source", "inter", "ibmplex", "lora"),
  supportedSections: SECTION_KEYS as unknown as SectionKey[],
  extraFields: [
    {
      "key": "sectionDividers",
      "label": "Divider lines between sections",
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
  hasPhoto: false,
  description: "Corporate professional CV with a bordered masthead, rule-separated sections and a formal tone throughout.",
  preview: {
    "header": "banner",
    "sidebar": "none",
    "accentRule": "underline",
    "density": "normal"
  },
};
