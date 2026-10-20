import type { SectionKey } from "@/lib/cv/schema";
import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "lumen",
  name: "Lumen",
  category: "Modern",
  thumbnail: null,
  defaultAccent: "#0ea5e9",
  accentOptions: ["#2563eb","#1d4ed8","#3b82f6","#0ea5e9","#4f46e5","#334155"],
  fonts: fontsFor("inter", "dmsans", "source", "system"),
  supportedSections: SECTION_KEYS as unknown as SectionKey[],
  extraFields: [
    {
      "key": "showPhoto",
      "label": "Show photo",
      "type": "toggle"
    },
    {
      "key": "contactColumns",
      "label": "Contact columns",
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
  hasPhoto: true,
  description: "Soft-modern layout with a tinted full-width sidebar, glowing accent rule under the name and bar-style skill emphasis.",
  designNotes:
    "Two-column with a 62mm tinted left sidebar. Left masthead with a 24mm x 2.5pt accent rule under the name; sidebar uses spaced caps headings while the main column uses accent underlines. Sidebar holds a centred 32mm circle headshot.",
};
