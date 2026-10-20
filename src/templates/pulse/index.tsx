import { config } from "./config";
import { createTheme } from "../_kit/theme";
import { pickFont } from "../_kit/fonts";
import { contactItems, fullName, visibleSections } from "../_kit/helpers";
import { SectionBlock, type SectionStyleOptions } from "../_kit/sections";
import type { TemplateProps } from "../types";

export { config };

/**
 * Pulse — accent spine with an inline metrics strip.
 *
 * A full-height accent block runs down the left edge with the vertical name set
 * inside it. Immediately under the masthead sits a horizontal strip of contact
 * "pills", and the body flows in the remaining measure with tick-marked
 * section titles.
 *
 * The vertical spine, the reversed vertical name and the pill strip are unique
 * to this template.
 */
export function Template({ data }: TemplateProps) {
  const theme = createTheme(data, { font: pickFont(data.settings.font, config.fonts) });
  const personal = data.personal;
  const sections = visibleSections(data);

  const options: SectionStyleOptions = {
    titleVariant: "rule",
    entryLayout: "row",
    bulletMarker: "check",
    timeline: data.extra.timeline !== false,
  };
  const summaryOptions: SectionStyleOptions = { ...options, bulletMarker: "check" };

  return (
    <div
      style={{
        fontFamily: theme.font,
        color: theme.ink,
        display: "grid",
        gridTemplateColumns: "14mm 1fr",
        minHeight: "297mm",
      }}
    >
      {/* ------------------------------ spine ------------------------------- */}
      <div
        aria-hidden
        style={{
          background: `linear-gradient(180deg, ${theme.accent} 0%, ${theme.accentDark} 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            color: theme.accentText,
            fontSize: "13pt",
            fontWeight: 800,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          {fullName(personal) || "Your Name"}
        </span>
      </div>

      {/* ------------------------------ content ----------------------------- */}
      <div style={{ padding: "15mm 16mm 14mm", minWidth: 0 }}>
        <header style={{ marginBottom: "9pt" }}>
          <h1
            style={{
              margin: 0,
              fontFamily: theme.headingFont,
              fontSize: "29pt",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.03,
            }}
          >
            {fullName(personal) || "Your Name"}
          </h1>
          {personal.jobTitle ? (
            <p
              style={{
                margin: "4pt 0 0",
                fontSize: "11pt",
                fontWeight: 600,
                color: theme.accentDark,
              }}
            >
              {personal.jobTitle}
            </p>
          ) : null}
        </header>

        {/* Contact pills — a single horizontal strip rather than a list. */}
        <PillStrip items={contactItems(personal)} theme={theme} />

        <div style={{ marginTop: "11pt" }}>
          {sections.map((section) => (
            <SectionBlock
              key={section}
              data={data}
              section={section}
              theme={theme}
              options={section === "summary" ? summaryOptions : options}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Contact details as outlined pills on one wrapped row.
 *
 * Rendered from the same `contactItems` helper as every other template so the
 * content stays identical — only the treatment differs.
 */
function PillStrip({
  items,
  theme,
}: {
  items: ReturnType<typeof contactItems>;
  theme: ReturnType<typeof createTheme>;
}) {
  if (items.length === 0) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "4pt" }}>
      {items.map((item) => (
        <span
          key={item.key}
          className="cv-avoid-break"
          style={{
            border: `0.75pt solid ${theme.line}`,
            borderLeft: `2pt solid ${theme.accent}`,
            borderRadius: "2pt",
            padding: "2.5pt 6pt",
            fontSize: "8.5pt",
            color: theme.muted,
            whiteSpace: "nowrap",
            overflowWrap: "anywhere",
            maxWidth: "100%",
          }}
        >
          {item.value}
        </span>
      ))}
    </div>
  );
}
