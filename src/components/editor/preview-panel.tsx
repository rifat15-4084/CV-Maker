"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Minus, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CVRenderer } from "@/components/templates/cv-renderer";
import { PreviewGuard } from "@/components/templates/preview-guard";
import { useEditorStore } from "@/lib/editor/editor-store";
import { cn } from "@/lib/utils";

const MIN_ZOOM = 0.35;
const MAX_ZOOM = 1.6;
const A4_WIDTH_PX = 794; // 210mm at 96dpi — the width .cv-sheet resolves to.

/**
 * Live A4 preview with zoom, fit-to-width and multi-page navigation.
 *
 * Templates use fixed A4 geometry, so instead of paginating the DOM we scale
 * the single sheet and let the user page through the visual overflow: the
 * sheet's scroll height divided by one page height tells us how many pages the
 * content currently occupies.
 */
export function PreviewPanel() {
  const data = useEditorStore((state) => state.data);
  const templateId = useEditorStore((state) => state.templateId);

  const frameRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(0.8);
  const [fitMode, setFitMode] = useState(true);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  const fit = useCallback(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const available = frame.clientWidth - 32;
    if (available <= 0) return;
    const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, available / A4_WIDTH_PX));
    setZoom(Number(next.toFixed(3)));
  }, []);

  // Fit on mount and whenever the panel changes size.
  useEffect(() => {
    if (!fitMode) return;
    fit();
    const frame = frameRef.current;
    if (!frame || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => fit());
    observer.observe(frame);
    return () => observer.disconnect();
  }, [fit, fitMode]);

  // Measure how many A4 pages the current content spans.
  useEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const pageHeightPx = A4_WIDTH_PX * (297 / 210);
        const raw = sheet.scrollHeight || sheet.offsetHeight;
        setPageCount(Math.max(1, Math.ceil(raw / pageHeightPx - 0.02)));
      });
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(sheet);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [data, templateId]);

  // Clamp during render rather than in an effect: the page simply cannot exceed
  // the measured page count, so we derive it instead of storing an extra state.
  const safePage = Math.min(page, pageCount);

  const step = (delta: number) => {
    setFitMode(false);
    setZoom((value) =>
      Number(Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value + delta)).toFixed(3)),
    );
  };

  const scrollToPage = (target: number) => {
    setFitMode(false);
    setPage(target);
    const frame = frameRef.current;
    if (!frame) return;
    const pageHeightPx = A4_WIDTH_PX * (297 / 210) * zoom;
    frame.scrollTo({ top: (target - 1) * pageHeightPx, behavior: "smooth" });
  };

  // Track which page the user is looking at while scrolling manually.
  const onScroll = () => {
    const frame = frameRef.current;
    if (!frame) return;
    const pageHeightPx = A4_WIDTH_PX * (297 / 210) * zoom;
    const current = Math.min(pageCount, Math.max(1, Math.round(frame.scrollTop / pageHeightPx) + 1));
    if (current !== page) setPage(current);
  };
  const scaleLabel = useMemo(() => `${Math.round(zoom * 100)}%`, [zoom]);

  return (
    <section
      aria-label="Live preview"
      className="flex min-h-0 flex-col overflow-hidden rounded-3xl border border-[var(--border-soft)] bg-white/[0.02]"
    >
      <div className="no-print flex flex-wrap items-center gap-2 border-b border-[var(--border-soft)] px-3 py-2">
        <span className="text-xs font-medium tracking-wide text-ink-500 uppercase">Preview</span>

        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => step(-0.1)} aria-label="Zoom out">
            <Minus className="size-4" aria-hidden />
          </Button>
          <span className="w-12 text-center text-xs tabular-nums text-ink-400">{scaleLabel}</span>
          <Button variant="ghost" size="icon" onClick={() => step(0.1)} aria-label="Zoom in">
            <Plus className="size-4" aria-hidden />
          </Button>
          <Button
            variant={fitMode ? "outline" : "ghost"}
            size="icon"
            onClick={() => {
              setFitMode(true);
              fit();
            }}
            title="Fit to width"
            aria-label="Fit to width"
          >
            <Maximize2 className="size-4" aria-hidden />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setFitMode(false);
              setZoom(1);
            }}
            title="Actual size (100%)"
            aria-label="Actual size"
          >
            <RotateCcw className="size-4" aria-hidden />
          </Button>
        </div>
      </div>

      <div
        ref={frameRef}
        onScroll={onScroll}
        className="relative min-h-0 flex-1 overflow-auto bg-slate-950/40 p-4 scrollbar-thin"
      >
        <div
          className="mx-auto"
          style={{
            width: A4_WIDTH_PX * zoom,
            height: (A4_WIDTH_PX * (297 / 210)) * pageCount * zoom,
          }}
        >
          <div
            ref={sheetRef}
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top left",
              width: A4_WIDTH_PX,
            }}
          >
            <PreviewGuard templateId={templateId}>
              <CVRenderer
                key={templateId}
                data={data}
                templateId={templateId}
                className="!w-[210mm]"
              />
            </PreviewGuard>
          </div>

          {/* Page-break guides so the user can see where A4 pages end. */}
          {pageCount > 1
            ? Array.from({ length: pageCount - 1 }).map((_, index) => (
                <div
                  key={index}
                  aria-hidden
                  className="pointer-events-none absolute left-4 right-4 border-t border-dashed border-cyan-400/30"
                  style={{ top: (A4_WIDTH_PX * (297 / 210)) * (index + 1) * zoom + 16 }}
                />
              ))
            : null}
        </div>
      </div>

      <div className="no-print flex items-center justify-center gap-3 border-t border-[var(--border-soft)] px-3 py-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => scrollToPage(Math.max(1, safePage - 1))}
          disabled={safePage <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" aria-hidden />
        </Button>
        <span className={cn("text-xs tabular-nums", pageCount > 1 ? "text-amber-300" : "text-ink-400")}>
          Page {safePage} of {pageCount}
          {pageCount > 1 ? " · content may spill over" : ""}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => scrollToPage(Math.min(pageCount, safePage + 1))}
          disabled={safePage >= pageCount}
          aria-label="Next page"
        >
          <ChevronRight className="size-4" aria-hidden />
        </Button>
      </div>
    </section>
  );
}
