#!/usr/bin/env node
/**
 * Scaffolds the remaining CVForge templates.
 *
 * The first 12 templates are hand-authored. This script generates a further
 * 44 using genuinely distinct layout archetypes (header structure, column
 * model, sidebar decoration, typography and section chrome), derived from the
 * archetype definitions in scripts/template-archetypes.mjs.
 *
 * Usage: node scripts/scaffold-templates.mjs
 */
import { mkdirSync, existsSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ARCHETYPES } from "./template-archetypes.mjs";
import { EXTRA_ARCHETYPES } from "./template-extra-archetypes.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const templatesDir = join(root, "src", "templates");

const FONT_LIBRARY_IDS = [
  "inter",
  "dmsans",
  "space",
  "montserrat",
  "source",
  "ibmplex",
  "ibmmono",
  "playfair",
  "lora",
  "merriweather",
  "libre",
  "garamond",
  "system",
  "georgia",
];

function fontList(ids) {
  for (const id of ids) {
    if (!FONT_LIBRARY_IDS.includes(id)) {
      throw new Error(`Unknown font id "${id}"`);
    }
  }
  return `fontsFor(${ids.map((id) => `"${id}"`).join(", ")})`;
}

function configSource(template) {
  return `import type { SectionKey } from "@/lib/cv/schema";
import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "${template.id}",
  name: ${JSON.stringify(template.name)},
  category: ${JSON.stringify(template.category)},
  thumbnail: null,
  defaultAccent: "${template.accent}",
  accentOptions: ${JSON.stringify(template.accentOptions)},
  fonts: ${fontList(template.fonts)},
  supportedSections: ${
    template.excludeSections?.length
      ? `([...SECTION_KEYS] as SectionKey[]).filter((key) => !${JSON.stringify(
          template.excludeSections,
        )}.includes(key))`
      : "SECTION_KEYS as unknown as SectionKey[]"
  },
  extraFields: ${JSON.stringify(template.extraFields ?? [], null, 2).replace(/\n/g, "\n  ")},
  hasPhoto: ${template.hasPhoto ? "true" : "false"},
  description: ${JSON.stringify(template.description)},
  preview: ${JSON.stringify(template.preview, null, 2).replace(/\n/g, "\n  ")},
};
`;
}

const created = [];
const skipped = [];

for (const template of [...ARCHETYPES, ...EXTRA_ARCHETYPES]) {
  const dir = join(templatesDir, template.id);
  if (existsSync(dir)) {
    skipped.push(template.id);
    continue;
  }
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "config.ts"), configSource(template), "utf8");
  writeFileSync(join(dir, "index.tsx"), template.component, "utf8");
  created.push(template.id);
}

console.log(`✔ created ${created.length} template(s): ${created.join(", ") || "none"}`);
if (skipped.length) console.log(`• kept ${skipped.length} existing: ${skipped.join(", ")}`);
const total = readdirSync(templatesDir, { withFileTypes: true }).filter(
  (entry) =>
    entry.isDirectory() &&
    !entry.name.startsWith("_") &&
    existsSync(join(templatesDir, entry.name, "config.ts")),
).length;
console.log(`• total templates on disk: ${total}`);
