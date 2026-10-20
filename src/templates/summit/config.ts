import type { SectionKey } from "@/lib/cv/schema";
import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "summit",
  name: "Summit",
  category: "Professional",
  thumbnail: null,
  defaultAccent: "#166534",
  accentOptions: ["#166534","#15803d","#3f6212","#047857","#065f46","#1e3a8a"],
  fonts: fontsFor("montserrat", "source", "inter", "dmsans"),
  supportedSections: SECTION_KEYS as unknown as SectionKey[],
  extraFields: [
    {
      "key": "sectionDividers",
      "label": "Divider lines between sections",
      "type": "toggle"
    },
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
    }
  ],
  hasPhoto: false,
  description: "Achievement-focused professional CV with a strong top band and a two-column skills grid.",
  designNotes:
    "Full-width solid-accent header band over a single column. The band carries a 27pt name and job title with two-column contacts below; headings are accent underlines.",
};
