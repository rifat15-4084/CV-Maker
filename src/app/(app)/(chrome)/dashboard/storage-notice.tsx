"use client";

import { HardDrive, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatBytes } from "@/services/local/storage";
import { useStorageUsage } from "@/lib/storage/use-storage-usage";

/**
 * Explains, on the dashboard, that CV Maker has no server: everything lives in
 * this browser. Also surfaces a live storage meter, because a full localStorage
 * would otherwise fail silently at save time.
 */
export function StorageNotice({ className }: { className?: string }) {
  const usage = useStorageUsage();

  return (
    <div
      className={cn(
        "glass flex flex-wrap items-start justify-between gap-4 rounded-2xl border-cyan-400/25 p-4",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/25 to-fuchsia-500/20 text-cyan-300">
          <Info className="size-4.5" aria-hidden />
        </span>
        <div>
          <h2 className="text-sm font-semibold">Your data is stored in this browser</h2>
          <p className="mt-0.5 max-w-xl text-xs leading-relaxed text-ink-400">
            There is no account server — your CVs and photos stay on this device only. Export a
            backup to move them to another device or keep them safe.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <HardDrive className="size-4 shrink-0 text-ink-500" aria-hidden />
        <div className="min-w-[9rem]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-ink-500">Browser storage</span>
            <span
              className={usage.nearFull ? "font-semibold text-amber-300" : "text-ink-400"}
            >
              {usage.percent}%
            </span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10" aria-hidden>
            <div
              className={cn(
                "h-full rounded-full transition-all",
                usage.nearFull
                  ? "bg-gradient-to-r from-amber-400 to-rose-400"
                  : "bg-gradient-to-r from-cyan-400 to-violet-400",
              )}
              style={{ width: `${usage.percent}%` }}
            />
          </div>
          <p className="mt-1 text-[11px] text-ink-500">
            {formatBytes(usage.bytes)} of ~5 MB
          </p>
        </div>
      </div>

      {/* Announce the near-full state to assistive tech as well as sighted users. */}
      <span className="sr-only" role="status" aria-live="polite">
        {usage.nearFull ? "Browser storage is almost full." : ""}
      </span>
    </div>
  );
}
