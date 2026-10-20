import Link from "next/link";
import { FileQuestion, Home, LayoutTemplate } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { AuroraBackdrop, GridBackdrop } from "@/components/marketing/primitives";

/** Root 404 — rendered for unmatched routes outside the (site) group too. */
export default function RootNotFound() {
  return (
    <div className="relative flex min-h-dvh items-center overflow-hidden">
      <AuroraBackdrop />
      <GridBackdrop />
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <span className="glass mx-auto flex size-16 items-center justify-center rounded-3xl text-cyan-300">
          <FileQuestion className="size-8" aria-hidden />
        </span>
        <p className="mt-6 text-sm font-semibold tracking-[0.3em] text-cyan-300">ERROR 404</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          This page has moved on to a better role
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-ink-400">
          The link may be broken or the page may have been renamed.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/">
            <Home className="size-4" aria-hidden />
            Back to home
          </ButtonLink>
          <ButtonLink href="/templates" variant="secondary">
            <LayoutTemplate className="size-4" aria-hidden />
            Browse templates
          </ButtonLink>
        </div>
        <p className="mt-8 text-sm text-ink-500">
          Need a hand?{" "}
          <Link href="/contact" className="text-cyan-300 hover:underline">
            Contact support
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
