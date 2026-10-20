"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Card wrapper for a repeatable entry (job, degree, project…). */
export function EntryCard({
  title,
  subtitle,
  onRemove,
  removeLabel = "Remove",
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  onRemove?: () => void;
  removeLabel?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--border-soft)] bg-white/[0.03] p-4",
        className,
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--page-fg)]">{title}</p>
          {subtitle ? <p className="truncate text-xs text-ink-500">{subtitle}</p> : null}
        </div>
        {onRemove ? (
          <button
            type="button"
            onClick={onRemove}
            aria-label={removeLabel}
            title={removeLabel}
            className="shrink-0 rounded-lg p-1.5 text-ink-500 transition hover:bg-rose-500/10 hover:text-rose-300"
          >
            <Trash2 className="size-4" aria-hidden />
          </button>
        ) : null}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

/** "Add another …" button used at the end of repeatable lists. */
export function AddEntryButton({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <Button
      type="button"
      variant="secondary"
      fullWidth
      onClick={onClick}
      disabled={disabled}
      className="border-dashed"
    >
      <Plus className="size-4" aria-hidden />
      {label}
    </Button>
  );
}

/** Two-column field grid that collapses on small screens. */
export function FieldGrid({
  children,
  columns = 2,
}: {
  children: React.ReactNode;
  columns?: 1 | 2 | 3;
}) {
  return (
    <div
      className={cn(
        "grid gap-3",
        columns === 1 && "grid-cols-1",
        columns === 2 && "grid-cols-1 sm:grid-cols-2",
        columns === 3 && "grid-cols-1 sm:grid-cols-3",
      )}
    >
      {children}
    </div>
  );
}
