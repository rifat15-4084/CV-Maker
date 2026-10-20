import type { SectionKey } from "@/lib/cv/schema";
import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "vertex",
  name: "Vertex",
  category: "Modern",
  thumbnail: null,
  defaultAccent: "#4f46e5",
  accentOptions: ["#4f46e5", "#7c3aed", "#8b5cf6", "#6d28d9", "#a855f7", "#4c1d95", "#2563eb"],
  fonts: fontsFor("space", "montserrat", "dmsans", "inter"),
  supportedSections: SECTION_KEYS as unknown as SectionKey[],
  extraFields: [
    {
      "key": "showPhoto",
      "label": "Show photo",
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
  hasPhoto: true,
  description: "Two-column modern CV with a colour-block header, angular accents and a compact right rail for skills and languages.",
  designNotes:
    "Full-width solid-accent header band with a 28mm square photo in a white ring beside the name, over a two-column body with a 58mm tinted right rail. Main headings use an accent left bar; rail headings are sidebar-style.",
};
