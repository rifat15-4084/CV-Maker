"use client";

import { Eye, EyeOff, GripVertical } from "lucide-react";
import { SortableList } from "@/components/ui/sortable";
import { Switch } from "@/components/ui/field";
import { SECTION_LABELS } from "@/lib/cv/defaults";
import { cn } from "@/lib/utils";
import type { SectionKey } from "@/lib/cv/schema";

/**
 * Lets the user reorder the CV's sections and toggle their visibility.
 * Sections without content are dimmed but still reorderable.
 */
export function SectionManager({
  order,
  visibility,
  onOrderChange,
  onVisibilityChange,
  hasContent,
  available,
}: {
  order: SectionKey[];
  visibility: Record<string, boolean>;
  onOrderChange: (order: SectionKey[]) => void;
  onVisibilityChange: (key: SectionKey, visible: boolean) => void;
  hasContent: (key: SectionKey) => boolean;
  /** Sections the current template actually renders. */
  available?: SectionKey[];
}) {
  const items = order.map((key) => ({ id: key, key }));

  return (
    <div className="space-y-3">
      <p className="text-sm leading-relaxed text-ink-400">
        Drag to change the order sections appear on the page, and use the switch to hide anything
        this application does not need. Hidden content is kept in your account.
      </p>

      <SortableList
        items={items}
        onReorder={(next) => onOrderChange(next.map((item) => item.key))}
        label="CV sections"
        renderItem={(item) => {
          const key = item.key;
          const visible = visibility[key] !== false;
          const filled = hasContent(key);
          const supported = !available || available.includes(key);

          return (
            <div
              className={cn(
                "flex items-center gap-3 rounded-2xl border border-[var(--border-soft)] bg-white/[0.03] py-3 pr-3 pl-9",
                !visible && "opacity-60",
              )}
            >
              <span className="absolute" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-sm font-medium text-[var(--page-fg)]">
                  {SECTION_LABELS[key]}
                  {!filled ? (
                    <span className="rounded-full border border-[var(--border-soft)] bg-white/5 px-2 py-0.5 text-[10px] text-ink-500">
                      empty
                    </span>
                  ) : null}
                  {!supported ? (
                    <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[10px] text-amber-300">
                      not in this template
                    </span>
                  ) : null}
                </p>
              </div>
              <Switch
                label=""
                checked={visible}
                onChange={(value) => onVisibilityChange(key, value)}
              />
            </div>
          );
        }}
      />

      <div className="flex items-center gap-4 rounded-2xl border border-[var(--border-soft)] bg-white/[0.02] p-3 text-xs text-ink-500">
        <span className="inline-flex items-center gap-1.5">
          <GripVertical className="size-3.5" aria-hidden /> Drag to reorder
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Eye className="size-3.5" aria-hidden /> Shown
        </span>
        <span className="inline-flex items-center gap-1.5">
          <EyeOff className="size-3.5" aria-hidden /> Hidden
        </span>
      </div>
    </div>
  );
}
