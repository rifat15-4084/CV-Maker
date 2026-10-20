import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";
import { templateCount } from "@/templates/registry";

export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Site-wide Open Graph card, generated at build time. Avoids shipping a binary
 * asset while keeping social previews on-brand.
 */
export default function OpengraphImage() {
  const count = templateCount();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "linear-gradient(135deg, #050915 0%, #0b1226 45%, #1a1040 100%)",
          color: "#f8fafc",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "linear-gradient(135deg, #22d3ee, #8b5cf6, #ec4899)",
            }}
          />
          <div style={{ display: "flex", fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>
            {SITE_NAME}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              fontSize: 76,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
            }}
          >
            Forge a CV that gets you hired
          </div>
          <div style={{ display: "flex", fontSize: 34, color: "#a5b4fc" }}>
            {`${count}+ print-ready templates · live preview · clean PDF export`}
          </div>
        </div>

        <div style={{ display: "flex", gap: 14, fontSize: 24, color: "#94a3b8" }}>
          <span>ATS-friendly</span>
          <span>·</span>
          <span>Free to start</span>
          <span>·</span>
          <span>Autosaved in your browser</span>
        </div>
      </div>
    ),
    size,
  );
}
