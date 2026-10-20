"use client";

import { useEffect, useState } from "react";
import { CVRenderer } from "@/components/templates/cv-renderer";
import { personaForTemplate } from "@/lib/cv/sample-personas";
import { normalizeCVData } from "@/lib/cv/defaults";
import { getTemplateConfig } from "@/templates/registry.client";

/**
 * Chrome-free A4 render of a single template with realistic sample data.
 *
 * This is the canonical "what does this template look like" surface. Two
 * consumers depend on it staying stable:
 *   • the thumbnail generator (`npm run thumbnails`) screenshots this route;
 *   • the gallery/editor live fallback renders the same component in-page.
 *
 * It intentionally renders at true A4 with no scaling so a headless browser can
 * capture a pixel-accurate still at deviceScaleFactor 2.
 */
export function PreviewRoute({ slug }: { slug: string }) {
  const config = getTemplateConfig(slug);
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fonts = typeof document !== "undefined" ? document.fonts : undefined;
    if (!fonts) {
      // No Font Loading API: reveal on the next tick rather than synchronously.
      const timer = setTimeout(() => setFontsReady(true), 0);
      return () => clearTimeout(timer);
    }
    void fonts.ready.then(() => {
      if (!cancelled) setFontsReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Signal readiness to the thumbnail generator: the template chunk has mounted
   * (the sheet has real children) and web fonts have settled. Screenshotting
   * before this produces blank or mis-wrapped artwork.
   */
  useEffect(() => {
    if (!fontsReady || !config) return;
    let cancelled = false;
    const mark = () => {
      const sheet = document.querySelector("[data-preview-root] .cv-sheet");
      if (!cancelled && sheet && sheet.childElementCount > 0) {
        document.documentElement.dataset.cvPreviewReady = "true";
        return true;
      }
      return false;
    };
    if (mark()) return;
    // The template is code-split, so poll briefly until it mounts.
    const interval = setInterval(() => {
      if (mark()) clearInterval(interval);
    }, 100);
    const stop = setTimeout(() => clearInterval(interval), 20_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
      clearTimeout(stop);
      delete document.documentElement.dataset.cvPreviewReady;
    };
  }, [fontsReady, config]);

  if (!config) {
    return (
      <div
        data-preview-missing={slug}
        style={{ padding: "24px", fontFamily: "system-ui", color: "#0f172a" }}
      >
        Unknown template “{slug}”.
      </div>
    );
  }

  const persona = personaForTemplate(config.id, config.category);
  const data = normalizeCVData(persona.data);

  return (
    <div
      data-preview-root={config.id}
      data-preview-fonts={fontsReady ? "ready" : "pending"}
      style={{ background: "#ffffff", width: "210mm", minHeight: "297mm" }}
    >
      <CVRenderer data={data} templateId={config.id} className="shadow-none" />
    </div>
  );
}
