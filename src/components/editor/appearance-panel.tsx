"use client";

import { Field, Select } from "@/components/ui/field";
import { ColorPicker } from "@/components/ui/fields/color-picker";
import { useEditorStore } from "@/lib/editor/editor-store";
import { SPACING_OPTIONS } from "@/lib/cv/schema";
import type { TemplateConfig } from "@/templates/types";

const SPACING_LABELS: Record<(typeof SPACING_OPTIONS)[number], string> = {
  compact: "Compact",
  normal: "Normal",
  relaxed: "Relaxed",
};

const LETTER_SPACING_OPTIONS = ["tight", "normal", "wide"] as const;

/**
 * Accent, typeface and spacing controls. The accent swatches come from the
 * active template so a choice always looks right in that layout.
 */
export function AppearancePanel({ template }: { template: TemplateConfig }) {
  const settings = useEditorStore((state) => state.data.settings);
  const setAccent = useEditorStore((state) => state.setAccent);
  const setFont = useEditorStore((state) => state.setFont);
  const setSpacing = useEditorStore((state) => state.setSpacing);
  const setLetterSpacing = useEditorStore((state) => state.setLetterSpacing);

  return (
    <div className="space-y-5">
      <ColorPicker
        label="Accent colour"
        value={settings.accent}
        options={template.accentOptions}
        onChange={setAccent}
      />

      <Field label="Typeface" htmlFor="appearance-font" hint="Each template offers its own set.">
        <Select
          id="appearance-font"
          value={settings.font}
          onChange={(event) => setFont(event.target.value)}
        >
          {template.fonts.map((font) => (
            <option key={font.id} value={font.id}>
              {font.label}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Density" htmlFor="appearance-spacing">
        <Select
          id="appearance-spacing"
          value={settings.spacing}
          onChange={(event) => setSpacing(event.target.value as typeof settings.spacing)}
        >
          {SPACING_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {SPACING_LABELS[option]}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Letter spacing" htmlFor="appearance-letter-spacing">
        <Select
          id="appearance-letter-spacing"
          value={settings.letterSpacing}
          onChange={(event) =>
            setLetterSpacing(event.target.value as typeof settings.letterSpacing)
          }
        >
          {LETTER_SPACING_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option[0].toUpperCase() + option.slice(1)}
            </option>
          ))}
        </Select>
      </Field>

      <p className="text-xs leading-relaxed text-ink-500">
        Changes apply instantly to the preview and are saved with the rest of your CV.
      </p>
    </div>
  );
}
