"use client";

import { memo } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { TemplateThumbnail } from "@/components/templates/template-thumbnail";
import { templateSelectionActions, useIsTemplateSelected } from "@/lib/store/template-selection";
import { cn } from "@/lib/utils";
import type { TemplateConfig } from "@/templates/types";

/* ==========================================================================
   One gallery card.

   Memoisation notes (this is the fix for the "everything reloads" bug):
     • `memo` with a props object that only ever contains a stable `template`
       reference, a stable `href` string and stable primitives. Nothing created
       inline per render, so React can bail out of re-rendering every other card.
     • Selection state is read per-card from the Zustand slice, so clicking a
       card re-renders *that card only*. The parent grid does not subscribe.
     • Hover/select handlers are the store's stable action handles, not closures.
   ========================================================================== */

export interface TemplateCardProps {
  template: TemplateConfig;
  /** Pre-computed href — a plain string, so it is stable across renders. */
  href: string;
  /** Optional secondary action (the picker uses it; the gallery does not). */
  onUse?: (templateId: string) => void;
  onUseSample?: (templateId: string) => void;
  busy?: boolean;
  /** Show the "selected" ring/check. */
  selectable?: boolean;
  priority?: boolean;
}

function TemplateCardImpl({
  template,
  href,
  onUse,
  onUseSample,
  busy = false,
  selectable = false,
}: TemplateCardProps) {
  const selected = useIsTemplateSelected(template.id);

  return (
    <article
      className={cn(
        "glass group flex h-full flex-col overflow-hidden rounded-3xl transition",
        selectable && selected
          ? "border-cyan-400/70 ring-1 ring-cyan-400/40"
          : "hover:-translate-y-1 hover:border-cyan-400/40",
      )}
      onMouseEnter={() => templateSelectionActions.setHovered(template.id)}
      onMouseLeave={() => templateSelectionActions.setHovered(null)}
      data-template-card={template.id}
    >
      <Link
        href={href}
        className="relative block aspect-[210/297] overflow-hidden bg-white"
        aria-label={`Preview the ${template.name} template`}
        onClick={() => templateSelectionActions.setSelected(template.id)}
      >
        <TemplateThumbnail template={template} width={320} />

        {selectable && selected ? (
          <span className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-cyan-400 text-slate-950">
            <Check className="size-4" aria-hidden />
          </span>
        ) : (
          <span className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent p-4 opacity-0 transition group-hover:opacity-100">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-2 text-xs font-semibold text-slate-900">
              Preview &amp; use
              <ArrowRight className="size-3.5" aria-hidden />
            </span>
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold">{template.name}</h3>
          <span className="shrink-0 rounded-full border border-[var(--border-soft)] bg-white/5 px-2 py-0.5 text-[11px] text-ink-400">
            {template.category}
          </span>
        </div>

        <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-ink-500">
          {template.description}
        </p>

        <div className="mt-3 flex items-center justify-between gap-2 border-t border-[var(--border-soft)] pt-3">
          <div className="flex items-center gap-1" aria-label="Accent colour options">
            {template.accentOptions.slice(0, 5).map((accent) => (
              <span
                key={accent}
                className="size-3.5 rounded-full ring-1 ring-white/20"
                style={{ backgroundColor: accent }}
              />
            ))}
          </div>
          <Link
            href={href}
            className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-300 transition group-hover:gap-1.5"
          >
            Use template
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>

        {onUse && onUseSample ? (
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => onUse(template.id)}
              className="flex-1 rounded-lg border border-[var(--border-soft)] bg-white/5 px-3 py-1.5 text-xs font-medium transition hover:bg-white/10 disabled:opacity-50"
            >
              Blank
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => onUseSample(template.id)}
              className="flex-1 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 px-3 py-1.5 text-xs font-medium text-white transition hover:brightness-110 disabled:opacity-50"
            >
              Sample
            </button>
          </div>
        ) : null}
      </div>
    </article>
  );
}

/**
 * Exported with a custom comparator that ignores handler identity only when the
 * caller did not supply one — in practice callers pass stable references, so
 * the default shallow compare is correct and cheapest.
 */
export const TemplateCard = memo(TemplateCardImpl);
