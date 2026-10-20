"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getTemplateConfigOrFallback } from "@/templates/registry.client";
import { TemplateThumbnail } from "@/components/templates/template-thumbnail";

/**
 * Hero mockup: a stylised browser/app frame showing a real CV page drawn from
 * the selected template's preview spec, plus floating status badges.
 */
export function HeroMockup({ templateIds }: { templateIds: string[] }) {
  const [index, setIndex] = useState(0);
  const config = getTemplateConfigOrFallback(
    templateIds[index] ?? templateIds[0],
  );

  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[3rem] bg-gradient-to-tr from-cyan-500/20 via-violet-500/20 to-fuchsia-500/20 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 28, rotate: -1.5 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="glass-strong overflow-hidden rounded-3xl shadow-[var(--shadow-card)]"
      >
        <div className="flex items-center gap-2 border-b border-[var(--border-soft)] px-4 py-3">
          <span className="size-2.5 rounded-full bg-rose-400/80" />
          <span className="size-2.5 rounded-full bg-amber-400/80" />
          <span className="size-2.5 rounded-full bg-emerald-400/80" />
          <span className="ml-3 truncate text-xs text-ink-400">
            cvmaker.app/editor — {config.name}
          </span>
          <span className="ml-auto hidden items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 sm:flex">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
            Saved
          </span>
        </div>

        <div className="grid gap-3 p-3 sm:grid-cols-[1.05fr_1fr] sm:p-4">
          <div className="hidden space-y-2 rounded-2xl bg-white/[0.03] p-3 sm:block">
            <div className="h-2 w-16 rounded-full bg-white/20" />
            <div className="h-7 rounded-lg bg-white/10" />
            <div className="h-2 w-20 rounded-full bg-white/20" />
            <div className="h-7 rounded-lg bg-white/10" />
            <div className="h-2 w-24 rounded-full bg-white/20" />
            <div className="h-20 rounded-lg bg-white/10" />
            <div className="h-2 w-20 rounded-full bg-white/20" />
            <div className="flex gap-1.5">
              <div className="h-6 flex-1 rounded-md bg-white/10" />
              <div className="h-6 flex-1 rounded-md bg-white/10" />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-[var(--border-soft)] bg-white">
            <AnimatePresence mode="wait">
              <motion.div
                key={config.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.32 }}
              >
                <TemplateThumbnail template={config} width={320} priority />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-[var(--border-soft)] px-4 py-3">
          {templateIds.slice(0, 6).map((id, dotIndex) => (
            <button
              key={id}
              type="button"
              aria-label={`Show ${id} template`}
              onClick={() => setIndex(dotIndex)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                dotIndex === index
                  ? "w-6 bg-gradient-to-r from-cyan-400 to-violet-500"
                  : "w-1.5 bg-white/25",
              )}
            />
          ))}
          <span className="ml-auto text-[10px] text-ink-500">Live preview</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="glass-strong absolute -bottom-6 -left-4 hidden rounded-2xl px-4 py-3 shadow-[var(--shadow-card)] sm:block"
      >
        <p className="text-[10px] font-medium tracking-wide text-ink-400 uppercase">
          Export
        </p>
        <p className="text-sm font-semibold text-[var(--page-fg)]">
          Amara_Okafor_CV.pdf
        </p>
        <p className="text-[10px] text-emerald-300">
          ATS-friendly · selectable text
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="glass-strong absolute -top-5 -right-3 hidden rounded-2xl px-4 py-3 shadow-[var(--shadow-card)] sm:block"
      >
        <p className="text-[10px] font-medium tracking-wide text-ink-400 uppercase">
          Templates
        </p>
        <p className="text-lg font-bold text-gradient">60</p>
      </motion.div>
    </div>
  );
}
