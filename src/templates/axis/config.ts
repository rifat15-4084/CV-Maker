import type { SectionKey } from "@/lib/cv/schema";
import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "axis",
  name: "Axis",
  category: "Minimal",
  thumbnail: null,
  defaultAccent: "#0f172a",
  accentOptions: ["#334155","#0f172a","#475569","#1e293b","#0f766e","#1e3a8a"],
  fonts: fontsFor("inter", "ibmplex", "dmsans", "system"),
  supportedSections: SECTION_KEYS as unknown as SectionKey[],
  extraFields: [
    {
      "key": "timeline",
      "label": "Timeline rail for dates",
      "type": "toggle"
    },
    {
      "key": "sectionDividers",
      "label": "Divider lines between sections",
      "type": "toggle"
    }
  ],
  hasPhoto: false,
  description: "Grid-aligned minimal CV with a strict left axis, timeline dots and a consistent vertical rhythm.",
  designNotes:
    "68/32 editorial split — main column plus a 62mm right reference rail divided by a hairline. Full-width grid header sets a large name on a 2.5pt ink baseline rule. Main headings use an accent bar, rail headings solid accent blocks.",
};
