"use client";

import { useId } from "react";
import { MONTH_OPTIONS, YEAR_OPTIONS } from "@/lib/cv/format";
import { Select } from "../field";
import { cn } from "@/lib/utils";

/**
 * Month + year picker backed by a single "YYYY-MM" string, with an optional
 * "Present" toggle for ongoing roles.
 */
export function DateField({
  id,
  value,
  onChange,
  allowPresent = false,
  current = false,
  onCurrentChange,
  label,
  className,
  invalid,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  allowPresent?: boolean;
  current?: boolean;
  onCurrentChange?: (value: boolean) => void;
  label?: string;
  className?: string;
  invalid?: boolean;
}) {
  const generatedId = useId();
  const baseId = id ?? generatedId;

  const match = /^(\d{4})-(\d{1,2})$/.exec(value.trim());
  const year = match?.[1] ?? "";
  const month = match?.[2] ? match[2].padStart(2, "0") : "";
  function update(nextYear: string, nextMonth: string) {
    if (!nextYear) {
      onChange("");
      return;
    }
    onChange(`${nextYear}-${nextMonth || "01"}`);
  }

  const disabled = allowPresent && current;
  const years = YEAR_OPTIONS;

  return (
    <div className={cn("space-y-1.5", className)}>
      {label ? (
        <span
          className="block text-xs font-medium text-ink-300"
          id={`${baseId}-label`}
        >
          {label}
        </span>
      ) : null}
      <div className="flex gap-2">
        <Select
          aria-labelledby={label ? `${baseId}-label` : undefined}
          aria-label={label ? undefined : "Month"}
          value={month}
          disabled={disabled}
          invalid={invalid}
          onChange={(event) => update(year, event.target.value)}
          className="flex-1"
        >
          <option value="">Month</option>
          {MONTH_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Select
          aria-label="Year"
          value={year}
          disabled={disabled}
          invalid={invalid}
          onChange={(event) => update(event.target.value, month)}
          className="flex-1"
        >
          <option value="">Year</option>
          {years.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>
      {allowPresent && onCurrentChange ? (
        <label className="flex cursor-pointer items-center gap-2 text-xs text-ink-400">
          <input
            type="checkbox"
            checked={current}
            onChange={(event) => onCurrentChange(event.target.checked)}
            className="size-3.5 rounded border-[var(--border-soft)] bg-white/5 accent-cyan-500"
          />
          I currently work / study here
        </label>
      ) : null}
    </div>
  );
}
