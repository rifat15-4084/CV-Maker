import { config } from "./config";
import { createTheme } from "../_kit/theme";
import { pickFont } from "../_kit/fonts";
import { contactItems, fullName, visibleSections } from "../_kit/helpers";
import { SectionBlock, type SectionStyleOptions } from "../_kit/sections";
import { ContactList } from "../_kit/primitives";
import type { TemplateProps } from "../types";

export { config };

/**
 * Dotmatrix — tinted header band with a printed dot screen.
 *
 * The opening is a filled accent-tinted band carrying a CSS radial-gradient dot
 * pattern, with the name reversed out over it. Body sections are separated by a
 * dotted hairline rule and skills render as rounded tags rather than bars, so
 * the whole sheet has a halftone, sticker-sheet feel.
 *
 * The dot screen (radial-gradient), the tinted band, and the dotted section
 * dividers are unique to this template.
 */
export function Template({ data }: TemplateProps) {
  const theme = createTheme(data, { font: pickFont(data.settings.font, config.fonts) });
  const personal = data.personal;
  const sections = visibleSections(data);

  const options: SectionStyleOptions = {
    titleVariant: "caps",
    entryLayout: "stacked",
    bulletMarker: "disc",
    separator: true,
    skillStyle: "chips",
    skillColumns: 2,
    chipVariant: "soft",
  };

  /** A printed dot screen: 1pt dots on a 5pt grid, tinted with the accent. */
  const dotScreen = `radial-gradient(${theme.accentDark} 0.9pt, transparent 1pt)`;

  return (
    <div style={{ fontFamily: theme.font, color: theme.ink }}>
      {/* ------------------------------- band ------------------------------- */}
      <header
        style={{
          position: "relative",
          padding: "13mm 16mm 11mm",
          background: theme.tintStrong,
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: dotScreen,
            backgroundSize: "5pt 5pt",
            opacity: 0.5,
          }}
        />
        <div style={{ position: "relative" }}>
          <h1
            style={{
              margin: 0,
              fontFamily: theme.headingFont,
              fontSize: "27pt",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: 1.04,
            }}
          >
            {fullName(personal) || "Your Name"}
          </h1>
          {personal.jobTitle ? (
            <p
              style={{
                margin: "4pt 0 0",
                fontSize: "10.5pt",
                fontWeight: 600,
                color: theme.accentDark,
              }}
            >
              {personal.jobTitle}
            </p>
          ) : null}
          <div style={{ marginTop: "8pt" }}>
            <ContactList items={contactItems(personal)} theme={theme} columns={2} icon={false} />
          </div>
        </div>
      </header>

      {/* ------------------------------- body ------------------------------- */}
      <div style={{ padding: "11mm 16mm 16mm" }}>
        {sections.map((section) => (
          <div
            key={section}
            style={{
              borderTop: `1pt dotted ${theme.line}`,
              paddingTop: "9pt",
            }}
          >
            <SectionBlock data={data} section={section} theme={theme} options={options} />
          </div>
        ))}
      </div>
    </div>
  );
}
