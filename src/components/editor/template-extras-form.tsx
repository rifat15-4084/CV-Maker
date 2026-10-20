"use client";

import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { ColorPicker } from "@/components/ui/fields/color-picker";
import { Switch } from "@/components/ui/field";
import type { TemplateExtraField } from "@/templates/types";

/**
 * Renders the extra fields a template declares in its config.
 * Values live in `data.extra` so switching templates never discards them.
 */
export function TemplateExtrasForm({
  fields,
  values,
  onChange,
  accentOptions,
}: {
  fields: TemplateExtraField[];
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  accentOptions: string[];
}) {
  if (!fields.length) {
    return (
      <p className="text-sm leading-relaxed text-ink-400">
        This template has no extra options — everything it shows comes from the sections above.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {fields.map((field) => {
        const raw = values[field.key];
        const control = (() => {
          switch (field.type) {
            case "toggle":
              return (
                <Switch
                  label={field.label}
                  description={field.help}
                  checked={raw === true}
                  onChange={(value) => onChange(field.key, value)}
                />
              );
            case "select":
              return (
                <Field label={field.label} htmlFor={`extra-${field.key}`} hint={field.help}>
                  <Select
                    id={`extra-${field.key}`}
                    value={typeof raw === "string" ? raw : (field.options?.[0]?.value ?? "")}
                    onChange={(event) => onChange(field.key, event.target.value)}
                  >
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </Field>
              );
            case "color":
              return (
                <ColorPicker
                  label={field.label}
                  value={typeof raw === "string" ? raw : accentOptions[0] ?? "#0ea5e9"}
                  options={accentOptions}
                  onChange={(value) => onChange(field.key, value)}
                />
              );
            case "textarea":
              return (
                <Field label={field.label} htmlFor={`extra-${field.key}`} hint={field.help}>
                  <Textarea
                    id={`extra-${field.key}`}
                    rows={3}
                    value={typeof raw === "string" ? raw : ""}
                    onChange={(event) => onChange(field.key, event.target.value)}
                  />
                </Field>
              );
            default:
              return (
                <Field label={field.label} htmlFor={`extra-${field.key}`} hint={field.help}>
                  <Input
                    id={`extra-${field.key}`}
                    value={typeof raw === "string" ? raw : ""}
                    onChange={(event) => onChange(field.key, event.target.value)}
                  />
                </Field>
              );
          }
        })();

        return <div key={field.key}>{control}</div>;
      })}
    </div>
  );
}
