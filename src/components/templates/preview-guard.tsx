"use client";

import { Component, Suspense, type ReactNode } from "react";

/* ==========================================================================
   Fault isolation for the live preview.

   Templates are third-party-ish code from the editor's point of view: a bad
   `extra` value, a missing field or a chunk that fails to load must never take
   the whole editor down and lose the user's unsaved work. The boundary catches
   render errors and shows a contained message; Suspense covers the moment the
   code-split template chunk is still in flight.
   ========================================================================== */

interface PreviewBoundaryProps {
  /** Changing this resets the boundary (e.g. on template switch). */
  resetKey: string;
  children: ReactNode;
  fallback?: ReactNode;
}

interface PreviewBoundaryState {
  error: Error | null;
}

export class PreviewErrorBoundary extends Component<PreviewBoundaryProps, PreviewBoundaryState> {
  state: PreviewBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): PreviewBoundaryState {
    return { error };
  }

  componentDidUpdate(previous: PreviewBoundaryProps) {
    // A template switch should clear a previous failure rather than pin the
    // error state onto the newly selected design.
    if (previous.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      return (
        this.props.fallback ?? (
          <div
            role="alert"
            className="flex h-full min-h-[400px] flex-col items-center justify-center gap-2 p-8 text-center"
          >
            <p className="text-sm font-semibold text-amber-300">
              This template could not be previewed
            </p>
            <p className="max-w-sm text-xs leading-relaxed text-ink-400">
              Your content is safe and has not been changed. Try another template, or reload the page.
            </p>
            <p className="mt-1 max-w-md font-mono text-[11px] break-words text-ink-500">
              {this.state.error.message}
            </p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

/** Neutral A4 skeleton shown while a template chunk downloads. */
export function PreviewSkeleton() {
  return (
    <div
      className="flex h-full min-h-[400px] w-full flex-col gap-4 bg-white p-10"
      role="status"
      aria-label="Loading template preview"
    >
      <div className="h-7 w-2/3 animate-pulse rounded bg-slate-200" />
      <div className="h-3 w-1/3 animate-pulse rounded bg-slate-100" />
      <div className="mt-6 h-px w-full bg-slate-100" />
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex flex-col gap-2">
          <div className="h-3.5 w-1/4 animate-pulse rounded bg-slate-200" />
          <div className="h-2.5 w-full animate-pulse rounded bg-slate-100" />
          <div className="h-2.5 w-11/12 animate-pulse rounded bg-slate-100" />
        </div>
      ))}
    </div>
  );
}

/**
 * Convenience wrapper: error boundary + Suspense around a preview surface.
 * Both layers are keyed by the template id so switching templates recovers
 * cleanly instead of showing a stale error.
 */
export function PreviewGuard({
  templateId,
  children,
  skeleton,
}: {
  templateId: string;
  children: ReactNode;
  skeleton?: ReactNode;
}) {
  return (
    <PreviewErrorBoundary resetKey={templateId}>
      <Suspense fallback={skeleton ?? <PreviewSkeleton />}>{children}</Suspense>
    </PreviewErrorBoundary>
  );
}
