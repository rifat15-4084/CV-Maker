import type { SectionKey } from "@/lib/cv/schema";
import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "horizon",
  name: "Horizon",
  category: "Modern",
  thumbnail: null,
  defaultAccent: "#0891b2",
  accentOptions: ["#0f766e","#0891b2","#14b8a6","#059669","#155e75","#334155"],
  fonts: fontsFor("dmsans", "inter", "source", "ibmplex"),
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
  description: "Wide-scan header across the top of the page, then a calm two-column body separated by a hairline rule — airy and contemporary.",
  designNotes:
    "Full-width header band closed by a 3pt accent bottom rule, with the name left and contact right, over a two-column body whose 52mm right aside is separated by a hairline border. Headings are spaced caps.",
};
