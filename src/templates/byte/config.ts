import type { SectionKey } from "@/lib/cv/schema";
import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "byte",
  name: "Byte",
  category: "Tech",
  thumbnail: null,
  defaultAccent: "#22c55e",
  accentOptions: ["#22c55e", "#166534", "#15803d", "#3f6212", "#047857", "#065f46", "#1e3a8a"],
  fonts: fontsFor("ibmmono", "space", "ibmplex", "inter"),
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
      "key": "sectionDividers",
      "label": "Divider lines between sections",
      "type": "toggle"
    }
  ],
  hasPhoto: false,
  description: "Terminal-flavoured tech CV with a prompt line, crisp monospace dates and a compact single column.",
  designNotes:
    "Compact single-column, monospace by default. Terminal-style header with a '~/cv $ whoami' prompt above the name and iconless contacts; headings are spaced caps with hairline borders and shell-style labels like 'experience.log'.",
};
