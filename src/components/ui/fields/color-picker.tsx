"use client";

import { useId } from "react";
import { Check, Pipette } from "lucide-react";
import { cn } from "@/lib/utils";

const HEX_RE = /^#([0-9a-fA-F]{6})$/;

/** Accent colour picker: curated swatches plus a custom hex input. */
export function ColorPicker({
  value,
  onChange,
  options,
  label = "Accent colour",
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  label?: string;
  className?: string;
}) {
  const hexId = useId();
  const nativeId = useId();
  const valid = HEX_RE.test(value);

  return (
    <div className={cn("space-y-2", className)}>
      <span className="block text-xs font-medium text-ink-300">{label}</span>
      <div className="flex flex-wrap items-center gap-2">
        {options.map((option) => {
          const active = option.toLowerCase() === value.toLowerCase();
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              aria-label={`Accent ${option}`}
              aria-pressed={active}
              className={cn(
                "relative size-7 rounded-full border transition",
                active
                  ? "scale-110 border-white/80"
                  : "border-[var(--border-soft)] hover:scale-105",
              )}
              style={{ backgroundColor: option }}
            >
              {active ? (
                <Check
                  className="absolute inset-0 m-auto size-3.5 text-white drop-shadow"
                  aria-hidden
                />
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <label
          htmlFor={nativeId}
          className="flex size-9 cursor-pointer items-center justify-center rounded-xl border border-[var(--border-soft)] bg-white/5 text-ink-400 transition hover:text-[var(--page-fg)]"
          title="Pick a custom colour"
        >
          <Pipette className="size-4" aria-hidden />
          <input
            id={nativeId}
            type="color"
            value={valid ? value : "#0ea5e9"}
            onChange={(event) => onChange(event.target.value)}
            className="sr-only"
          />
        </label>
        <input
          id={hexId}
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          spellCheck={false}
          aria-label="Accent hex value"
          className={cn(
            "h-9 w-28 rounded-xl border bg-white/5 px-3 font-mono text-xs text-[var(--page-fg)] uppercase focus:outline-none",
            valid
              ? "border-[var(--border-soft)] focus:border-cyan-400/60"
              : "border-rose-500/70",
          )}
        />
        <span
          aria-hidden
          className="h-9 w-9 rounded-xl border border-[var(--border-soft)]"
          style={{ backgroundColor: valid ? value : "#0ea5e9" }}
        />
      </div>
    </div>
  );
}
