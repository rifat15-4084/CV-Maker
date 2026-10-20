import type { SectionKey } from "@/lib/cv/schema";
import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "lectern",
  name: "Lectern",
  category: "Academic",
  thumbnail: null,
  defaultAccent: "#0f766e",
  accentOptions: ["#0f766e","#0891b2","#14b8a6","#059669","#155e75","#334155"],
  fonts: fontsFor("source", "garamond", "inter", "lora"),
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
  description: "Teaching-focused academic CV with a calm header rule, ordered sections and a two-column contact strip.",
  designNotes:
    "Full-width header band closed by a 2pt accent bottom rule. Serif name, accent job title and two-column contacts; headings are accent underlines. Close to Ledger but distinguished by serif display type against Ledger's compact all-caps treatment.",
};
