import type { SectionKey } from "@/lib/cv/schema";
import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "athenaeum",
  name: "Athenaeum",
  category: "Academic",
  thumbnail: null,
  defaultAccent: "#7f1d1d",
  accentOptions: ["#e11d48","#db2777","#be123c","#f43f5e","#9d174d","#7c3aed"],
  fonts: fontsFor("garamond", "libre", "lora", "source"),
  supportedSections: SECTION_KEYS as unknown as SectionKey[],
  extraFields: [
    {
      "key": "showPhoto",
      "label": "Show photo",
      "type": "toggle"
    },
    {
      "key": "sectionDividers",
      "label": "Divider lines between sections",
      "type": "toggle"
    }
  ],
  hasPhoto: true,
  description: "Refined academic CV with a framed photo, deep accent rules and a restrained research-focused layout.",
  preview: {
    "header": "split",
    "sidebar": "none",
    "photo": true,
    "photoShape": "square",
    "accentRule": "underline",
    "density": "normal"
  },
};
