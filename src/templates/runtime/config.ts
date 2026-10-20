import type { SectionKey } from "@/lib/cv/schema";
import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "runtime",
  name: "Runtime",
  category: "Tech",
  thumbnail: null,
  defaultAccent: "#2563eb",
  accentOptions: ["#2563eb","#1d4ed8","#3b82f6","#0ea5e9","#4f46e5","#334155"],
  fonts: fontsFor("ibmmono", "ibmplex", "inter", "space"),
  supportedSections: SECTION_KEYS as unknown as SectionKey[],
  extraFields: [
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
  description: "Systems-style tech CV with monospace meta and a tinted sidebar holding stack, skills and links.",
  designNotes:
    "Two-column with a 56mm tinted right aside separated by a hairline. Masthead sits in the main column, the name above a 2pt accent border-bottom; headings are spaced caps. The tinted rail is the differentiator.",
};
