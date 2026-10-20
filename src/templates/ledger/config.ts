import type { SectionKey } from "@/lib/cv/schema";
import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "ledger",
  name: "Ledger",
  category: "Professional",
  thumbnail: null,
  defaultAccent: "#1d4ed8",
  accentOptions: ["#2563eb","#1d4ed8","#3b82f6","#0ea5e9","#4f46e5","#334155"],
  fonts: fontsFor("ibmplex", "source", "inter", "ibmmono"),
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
  description: "Structured professional CV with a table-like header block and aligned, uniformly spaced experience rows.",
  designNotes:
    "Compact single column with a ledger/table feel. Name block closed by a 2pt accent bottom rule, uppercase muted job title and two-column contacts; headings are spaced caps with hairline borders.",
};
