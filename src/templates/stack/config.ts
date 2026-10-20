import type { SectionKey } from "@/lib/cv/schema";
import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "stack",
  name: "Stack",
  category: "Tech",
  thumbnail: null,
  defaultAccent: "#0ea5e9",
  accentOptions: ["#2563eb","#1d4ed8","#3b82f6","#0ea5e9","#4f46e5","#334155"],
  fonts: fontsFor("ibmplex", "source", "inter", "ibmmono"),
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
  description: "Layered tech CV with a stacked header band, grouped skill matrix and tight, engineering-style spacing.",
  designNotes:
    "Single column under a stacked header block (name, job title, two-column contacts) divided from the body by a 2pt accent border-top. Headings are accent underlines. The full-width accent rule is the whole idea.",
};
