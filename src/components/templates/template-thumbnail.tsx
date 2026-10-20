"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CVRenderer } from "@/components/templates/cv-renderer";
import { normalizeCVData } from "@/lib/cv/defaults";
import { personaForTemplate } from "@/lib/cv/sample-personas";
import type { CVData } from "@/lib/cv/schema";
import { cn } from "@/lib/utils";
import type { TemplateConfig } from "@/templates/types";

/* ==========================================================================
   TemplateThumbnail
   ==========================================================================
   Card artwork for a CV design. Two ways to use it:

     • Gallery / template picker — pass only `template`. It shows the
       pre-generated still at /thumbnails/<id>.webp (built by
       `npm run thumbnails` from the template's REAL component) with a live
       scaled-down render of the component as a fallback.

     • Dashboard — also pass `data`, the user's own CV. There is no stored
       image of a user's CV, and a sample render would be actively misleading,
       so this always renders the user's real content live.

   Nothing here ever falls back to a shared placeholder: a card either shows
   this template's design or a neutral loading sheet.
   ========================================================================== */

/** A4 at 96dpi is 794x1123 CSS px; the sheet is scaled down to the card. */
const SHEET_WIDTH_PX = 794;

export function TemplateThumbnail({
  template,
  className,
  /** Rendered width in CSS px; used to derive the live-preview scale. */
  width = 320,
  live = true,
  priority = false,
  /** Render this CV instead of the template's sample persona (dashboard). */
  data,
}: {
  template: TemplateConfig;
  className?: string;
  width?: number;
  live?: boolean;
  priority?: boolean;
  data?: CVData | unknown;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [measuredWidth, setMeasuredWidth] = useState(width);

  const isUserCV = data !== undefined;

  // Render the live preview only once the card is (nearly) on screen, so a long
  // dashboard or a 60-card gallery does not mount dozens of template renders.
  useEffect(() => {
    const node = containerRef.current;
    if (!node || !live) return;
    if (typeof IntersectionObserver === "undefined") {
      // Older browser: nothing will ever intersect, so reveal on the next tick
      // rather than calling setState synchronously inside this effect body.
      const timer = setTimeout(() => setInView(true), 0);
      return () => clearTimeout(timer);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [live]);

  // The live render scales true A4 down to the card, so it has to know the
  // card's real width. Cards are responsive (1-3 columns at different
  // breakpoints), which means a fixed scale would drift out of alignment.
  useEffect(() => {
    const node = containerRef.current;
    if (!node || !live || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver((entries) => {
      const next = entries[0]?.contentRect.width;
      if (next && Math.abs(next - measuredWidth) > 1) setMeasuredWidth(next);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [live, measuredWidth]);

  // A stored still exists only for the template's sample render, never for a
  // user's own CV.
  const useStill = !isUserCV && !imageFailed;
  const showLive = inView && live && !useStill;

  return (
    <div
      ref={containerRef}
      className={cn("relative h-full w-full overflow-hidden bg-white", className)}
      data-template-thumb={template.id}
    >
      {useStill ? (
        <Image
          src={`/thumbnails/${template.id}.webp`}
          alt={`${template.name} CV template preview`}
          fill
          // Fixed box + `fill` inside an aspect-locked parent: no layout shift.
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 320px"
          className="object-cover object-top"
          loading={priority ? "eager" : "lazy"}
          priority={priority}
          decoding="async"
          unoptimized
          onError={() => setImageFailed(true)}
        />
      ) : showLive ? (
        <LivePreview template={template} width={measuredWidth} data={data} />
      ) : (
        <div
          className="absolute inset-0 animate-pulse bg-gradient-to-b from-slate-100 to-slate-200/70"
          role="img"
          aria-label={`${template.name} preview loading`}
        />
      )}
    </div>
  );
}

/**
 * The real template component, rendered at true A4 and scaled to the card.
 *
 * The wrapper is clipped by the parent's `overflow-hidden` and the inner sheet
 * is transformed so it fills the card exactly. `pointer-events-none` keeps the
 * card's own click target on top.
 */
function LivePreview({
  template,
  width,
  data,
}: {
  template: TemplateConfig;
  width: number;
  data?: CVData | unknown;
}) {
  const scale = width / SHEET_WIDTH_PX;
  const cvData =
    data !== undefined ? normalizeCVData(data) : personaForTemplate(template.id, template.category).data;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        style={{
          width: `${SHEET_WIDTH_PX}px`,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
        aria-hidden
      >
        <CVRenderer data={cvData} templateId={template.id} className="shadow-none" />
      </div>
    </div>
  );
}
