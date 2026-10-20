import Link from "next/link";
import type { Metadata } from "next";
import { Compass, FileQuestion, Home, LayoutTemplate } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { AuroraBackdrop, GridBackdrop } from "@/components/marketing/primitives";

export const metadata: Metadata = {
  title: "Page not found",
  description: "We could not find that page. Browse templates or head back to the home page.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="relative flex min-h-[70vh] items-center overflow-hidden">
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
          The link may be broken or the page may have been renamed. Try one of these instead.
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
        <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-ink-500">
          <Link href="/features" className="transition hover:text-cyan-300">
            Features
          </Link>
          <Link href="/how-it-works" className="transition hover:text-cyan-300">
            How it works
          </Link>
          <Link href="/faq" className="transition hover:text-cyan-300">
            FAQ
          </Link>
          <Link href="/contact" className="transition hover:text-cyan-300">
            Contact
          </Link>
        </div>
        <p className="mt-10 inline-flex items-center gap-2 text-xs text-ink-600">
          <Compass className="size-3.5" aria-hidden />
          If you followed a link from inside CV Maker, please tell us and we will fix it.
        </p>
      </div>
    </div>
  );
}
