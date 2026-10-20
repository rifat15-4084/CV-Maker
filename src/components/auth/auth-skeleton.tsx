import { cn } from "@/lib/utils";

/**
 * Neutral placeholder shown while the session is being resolved from
 * localStorage. Rendering the same markup on the server and the first client
 * pass is what prevents a hydration mismatch — the alternative (guessing the
 * signed-in state before hydration) always flickers.
 */
export function AuthSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8", className)}
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading…</span>
      <div className="space-y-4">
        <div className="h-8 w-56 animate-pulse rounded-xl bg-white/5" />
        <div className="h-4 w-80 animate-pulse rounded-lg bg-white/5" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-40 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Compact skeleton for the auth-card area. */
export function AuthCardSkeleton() {
  return (
    <div className="glass rounded-3xl p-6 sm:p-8" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>
      <div className="mx-auto h-7 w-48 animate-pulse rounded-lg bg-white/5" />
      <div className="mx-auto mt-3 h-4 w-64 animate-pulse rounded-lg bg-white/5" />
      <div className="mt-7 space-y-4">
        <div className="h-12 animate-pulse rounded-xl bg-white/5" />
        <div className="h-12 animate-pulse rounded-xl bg-white/5" />
        <div className="h-12 animate-pulse rounded-xl bg-white/5" />
      </div>
    </div>
  );
}
