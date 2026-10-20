import type { SectionKey } from "@/lib/cv/schema";
import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "regency",
  name: "Regency",
  category: "Executive",
  thumbnail: null,
  defaultAccent: "#1e3a8a",
  accentOptions: ["#1e3a8a","#172554","#1d4ed8","#0f172a","#1e40af","#312e81"],
  fonts: fontsFor("playfair", "libre", "lora", "source"),
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
  description: "Regal executive CV with a serif display name, centred masthead and a commanding single-column body.",
  designNotes:
    "Single centred column at 18mm margins. Centred serif masthead closed by a 1pt accent bottom border with an uppercase job title and centred contact block; headings are accent underlines.",
};
