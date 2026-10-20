"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home, RefreshCw, TriangleAlert } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { AuroraBackdrop, GridBackdrop } from "@/components/marketing/primitives";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the error in the console (and any monitoring hook) for debugging.
    console.error("[cv-maker] route error", error);
  }, [error]);

  return (
    <div className="relative flex min-h-[70vh] items-center overflow-hidden">
      <AuroraBackdrop />
      <GridBackdrop />
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <span className="glass mx-auto flex size-16 items-center justify-center rounded-3xl text-rose-300">
          <TriangleAlert className="size-8" aria-hidden />
        </span>
        <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
          Something went wrong on this page
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-ink-400">
          The error has been logged. You can retry the page, or head back to somewhere safe. Your
          saved CVs are not affected.
        </p>
        {error.digest ? (
          <p className="mt-3 text-xs text-ink-600">
            Reference: <code className="text-ink-400">{error.digest}</code>
          </p>
        ) : null}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button onClick={reset}>
            <RefreshCw className="size-4" aria-hidden />
            Try again
          </Button>
          <ButtonLink href="/" variant="secondary">
            <Home className="size-4" aria-hidden />
            Back to home
          </ButtonLink>
        </div>
        <p className="mt-8 text-sm text-ink-500">
          Still stuck?{" "}
          <Link href="/contact" className="text-cyan-300 hover:underline">
            Tell us what happened
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
