import type { SectionKey } from "@/lib/cv/schema";
import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "clarity",
  name: "Clarity",
  category: "Minimal",
  thumbnail: null,
  defaultAccent: "#0ea5e9",
  accentOptions: ["#2563eb","#1d4ed8","#3b82f6","#0ea5e9","#4f46e5","#334155"],
  fonts: fontsFor("dmsans", "inter", "source", "system"),
  supportedSections: SECTION_KEYS as unknown as SectionKey[],
  extraFields: [
    {
      "key": "sectionDividers",
      "label": "Divider lines between sections",
      "type": "toggle"
    },
    {
      "key": "skillLevelStyle",
      "label": "Skill level style",
      "type": "select",
      "options": [
        {
          "value": "bars",
          "label": "Bars"
        },
        {
          "value": "chips",
          "label": "Chips"
        },
        {
          "value": "hidden",
          "label": "Names only"
        }
      ]
    }
  ],
  hasPhoto: false,
  description: "Clear minimal CV with a soft tinted contact strip, one accent colour and light, tidy section rules.",
  designNotes:
    "Single column under a full-width tinted header band. The band carries the name, accent job title and two-column contacts; headings are accent underlines. Restraint is the point — one tint band, nothing else.",
};
