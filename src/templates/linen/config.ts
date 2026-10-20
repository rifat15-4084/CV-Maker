import type { SectionKey } from "@/lib/cv/schema";
import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "linen",
  name: "Linen",
  category: "Minimal",
  thumbnail: null,
  defaultAccent: "#78350f",
  accentOptions: ["#b45309","#d97706","#f59e0b","#ea580c","#92400e","#78350f"],
  fonts: fontsFor("lora", "garamond", "source", "libre"),
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
  description: "Warm minimal CV with a subtle tinted band, serif body and restrained letter-spaced headings.",
  designNotes:
    "Single column under a tinted header band with a hairline bottom border. Warm serif name with a letterspaced uppercase accent job title and two-column contacts; headings are accent underlines.",
};
