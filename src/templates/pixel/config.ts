import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "pixel",
  name: "Pixel",
  category: "Tech",
  thumbnail: null,
  defaultAccent: "#2563eb",
  accentOptions: ["#2563eb", "#22c55e", "#0ea5e9", "#a855f7", "#f97316", "#14b8a6"],
  fonts: fontsFor("ibmplex", "ibmmono", "source", "dmsans"),
  supportedSections: [...SECTION_KEYS],
  extraFields: [
    { key: "codeSummary", label: "Render summary as a code block", type: "toggle" },
    { key: "promptChevron", label: "Show › prompt before headings", type: "toggle" },
  ],
  hasPhoto: false,
  description:
    "Developer-focused layout with monospace detail lines, a right-hand rail for stack, skills and links, and code-style summary treatment.",
  designNotes:
    "Developer two-column (1fr / 56mm tinted right rail) in monospace. Tinted header with a monospace chevron prompt line and right-aligned mono contacts; headings are monospace uppercase with a '>' chevron. Summary renders as a code block with an accent left bar.",
};
