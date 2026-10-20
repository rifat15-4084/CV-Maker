"use client";

import { useEffect } from "react";
import { ArrowLeft, Printer } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { CVRenderer } from "@/components/templates/cv-renderer";
import type { CVData } from "@/lib/cv/schema";

/**
 * Clean, chrome-free view of a CV that triggers the browser's print dialog.
 *
 * `document.title` is set to the desired file name so "Save as PDF" proposes
 * `Amara_Okafor_CV.pdf`. The print stylesheet in globals.css removes shadows and
 * page margins, and everything marked `no-print` stays on screen only.
 */
export function PrintDocument({
  data,
  templateId,
  fileName,
  backHref,
}: {
  data: CVData;
  templateId: string;
  fileName: string;
  backHref: string;
}) {
  useEffect(() => {
    const previous = document.title;
    document.title = fileName;

    // Wait until the (code-split) template has actually painted AND web fonts
    // have settled before opening the print dialog. Templates pull Google Fonts
    // from a stylesheet, so printing before `document.fonts.ready` can reflow
    // every line and push content onto extra pages.
    let observer: MutationObserver | undefined;
    let timer: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const afterFonts = async () => {
      try {
        await document.fonts?.ready;
      } catch {
        // Font loading API unavailable / rejected: print anyway.
      }
      if (cancelled) return;
      // One more frame so the reflow from the font swap is committed.
      requestAnimationFrame(() => {
        if (!cancelled) timer = setTimeout(() => window.print(), 150);
      });
    };

    const mounted = document.querySelector(".cv-sheet[data-cv-ready]");
    if (mounted) {
      void afterFonts();
    } else {
      observer = new MutationObserver(() => {
        if (document.querySelector(".cv-sheet[data-cv-ready]")) {
          observer?.disconnect();
          void afterFonts();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      timer = setTimeout(() => window.print(), 4000); // safety net
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
      clearTimeout(timer);
      document.title = previous;
    };
  }, [fileName]);

  return (
    <div className="min-h-dvh bg-slate-950">
      <div className="no-print sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-slate-950/90 px-4 py-3 backdrop-blur">
        <div className="min-w-0">
          <p className="text-sm font-medium text-white">Print / Save as PDF</p>
          <p className="truncate text-xs text-slate-400">
            Choose “Save as PDF” as the destination. No browser headers or footers are added.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ButtonLink href={backHref} variant="secondary" size="sm">
            <ArrowLeft className="size-4" aria-hidden />
            Back to editor
          </ButtonLink>
          <Button size="sm" onClick={() => window.print()}>
            <Printer className="size-4" aria-hidden />
            Print
          </Button>
        </div>
      </div>

      <div className="print-root mx-auto flex justify-center px-4 py-8 print:p-0">
        <CVRenderer data={data} templateId={templateId} />
      </div>
    </div>
  );
}
