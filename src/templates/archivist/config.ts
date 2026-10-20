import type { SectionKey } from "@/lib/cv/schema";
import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "archivist",
  name: "Archivist",
  category: "Academic",
  thumbnail: null,
  defaultAccent: "#3f6212",
  accentOptions: ["#166534","#15803d","#3f6212","#047857","#065f46","#1e3a8a"],
  fonts: fontsFor("libre", "garamond", "source", "lora"),
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
  description: "Archival academic CV with restrained colour, reference-friendly entry spacing and a formal masthead.",
  designNotes:
    "Single-column serif page. Left masthead in serif with an accent-dark job title; headings carry a 3.5pt accent left border. No ornament — the weight and colour of the heading rules do the work.",
};
