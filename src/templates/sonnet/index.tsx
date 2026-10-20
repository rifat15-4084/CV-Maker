import { config } from "./config";
import { createTheme } from "../_kit/theme";
import { pickFont } from "../_kit/fonts";
import { contactItems, fullName, visibleSections } from "../_kit/helpers";
import { SectionBlock, type SectionStyleOptions } from "../_kit/sections";
import { ContactList } from "../_kit/primitives";
import type { TemplateProps } from "../types";

export { config };

/**
 * Sonnet — centred classical masthead.
 *
 * Deliberately a single narrow measure with a *centred* opening: a monogram
 * roundel with the person's initials, the name beneath it, then a centred
 * contact row. The body uses generous 27mm margins so the serif setting reads
 * like a printed essay.
 *
 * Distinct from the other single-column designs by: the monogram roundel, the
 * centred masthead with symmetric rules, the narrow centred measure, and
 * double-rule section titles.
 */
export function Template({ data }: TemplateProps) {
  const theme = createTheme(data, {
    font: pickFont(data.settings.font, config.fonts),
    density: "relaxed",
  });
  const personal = data.personal;
  const sections = visibleSections(data);
  const initials = `${personal.firstName.charAt(0)}${personal.lastName.charAt(0)}`.toUpperCase();

  const wide: SectionStyleOptions = {
    titleVariant: "double",
    entryLayout: "stacked",
    bulletMarker: "dash",
  };
  // Two columns for the short list sections so a relaxed measure stays compact.
  const split: SectionStyleOptions = {
    titleVariant: "double",
    entryLayout: "stacked",
    bulletMarker: "none",
    skillStyle: "dots",
    skillColumns: 2,
  };
  const SPLIT_SECTIONS = new Set(["skills", "languages", "certifications"]);

  return (
    <div style={{ fontFamily: theme.font, color: theme.ink, padding: "18mm 27mm 16mm" }}>
      {/* ----------------------------- masthead ----------------------------- */}
      <header style={{ textAlign: "center", marginBottom: "12pt" }}>
        <div
          aria-hidden
          style={{
            width: "22mm",
            height: "22mm",
            margin: "0 auto 9pt",
            borderRadius: "50%",
            border: `1.25pt solid ${theme.accent}`,
            display: "grid",
            placeItems: "center",
            fontFamily: theme.headingFont,
            fontSize: "19pt",
            fontWeight: 700,
            letterSpacing: "0.02em",
            color: theme.accentDark,
          }}
        >
          {initials || "CV"}
        </div>

        <h1
          style={{
            margin: 0,
            fontFamily: theme.headingFont,
            fontSize: "33pt",
            fontWeight: 700,
            lineHeight: 1.02,
            letterSpacing: "0.005em",
          }}
        >
          {fullName(personal) || "Your Name"}
        </h1>

        {personal.jobTitle ? (
          <p
            style={{
              margin: "5pt 0 0",
              fontSize: "11pt",
              fontStyle: "italic",
              color: theme.accentDark,
            }}
          >
            {personal.jobTitle}
          </p>
        ) : null}

        <div
          aria-hidden
          style={{
            width: "34mm",
            height: "0.75pt",
            background: theme.line,
            margin: "9pt auto",
          }}
        />

        <div style={{ display: "flex", justifyContent: "center" }}>
          <ContactList items={contactItems(personal)} theme={theme} columns={1} icon={false} />
        </div>
      </header>

      {/* ------------------------------- body ------------------------------- */}
      <div>
        {sections.map((section) => (
          <SectionBlock
            key={section}
            data={data}
            section={section}
            theme={theme}
            options={SPLIT_SECTIONS.has(section) ? split : wide}
          />
        ))}
      </div>
    </div>
  );
}
