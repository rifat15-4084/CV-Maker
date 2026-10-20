import type { SectionKey } from "@/lib/cv/schema";
import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "mono-min",
  name: "Mono",
  category: "Minimal",
  thumbnail: null,
  defaultAccent: "#111827",
  accentOptions: ["#111827", "#334155", "#0f172a", "#475569", "#1e293b", "#0f766e", "#1e3a8a"],
  fonts: fontsFor("ibmmono", "ibmplex", "inter", "system"),
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
  description: "Typewriter-minimal CV built on a monospace grid with tight, technical spacing and no ornament.",
  designNotes:
    "Single-column monospace page. Small left name with a plain subtitle and iconless two-column contacts; headings are letter-spaced spaced caps with a hairline underline. Deliberately ornament-free — purely typographic.",
};
