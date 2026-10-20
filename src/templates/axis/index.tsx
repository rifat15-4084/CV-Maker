import { config } from "./config";
import { createTheme } from "../_kit/theme";
import { pickFont } from "../_kit/fonts";
import { contactItems, fullName, visibleSections } from "../_kit/helpers";
import { SectionBlock, SectionContent, type SectionStyleOptions } from "../_kit/sections";
import { ContactList, SectionTitle } from "../_kit/primitives";
import type { SectionKey } from "@/lib/cv/schema";
import type { TemplateProps } from "../types";

export { config };

/**
 * Axis — "Swiss Grid".
 *
 * A strict editorial two-column body: a wide main column carries prose sections
 * (summary, experience, projects) while a narrow right rail holds the scannable
 * reference material (skills, languages, certifications, education). The header
 * is a full-width grid with the name on a baseline rule and contact details
 * pushed to the opposite corner.
 *
 * Structurally distinct from the single-column templates: the 68/32 split, the
 * right-aligned contact block and the rail-specific section set do not appear in
 * any other design.
 */

/** Sections that belong in the right-hand reference rail. */
const RAIL: SectionKey[] = ["skills", "languages", "certifications", "education", "hobbies"];

export function Template({ data }: TemplateProps) {
  const theme = createTheme(data, { font: pickFont(data.settings.font, config.fonts) });
  const personal = data.personal;
  const sections = visibleSections(data);

  const mainSections = sections.filter((section) => !RAIL.includes(section));
  const railSections = sections.filter((section) => RAIL.includes(section));

  const mainOptions: SectionStyleOptions = {
    titleVariant: "rule",
    entryLayout: "row",
    bulletMarker: "dash",
  };
  // The rail uses a compact block title and stacked entries so it reads as a
  // reference column rather than a continuation of the main flow.
  const railOptions: SectionStyleOptions = {
    titleVariant: "block",
    entryLayout: "stacked",
    bulletMarker: "none",
    skillStyle: "bars",
    skillColumns: 1,
  };

  return (
    <div style={{ fontFamily: theme.font, color: theme.ink }}>
      {/* ------------------------------ header ------------------------------ */}
      <header
        style={{
          padding: "16mm 16mm 8mm",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          alignItems: "end",
          gap: "8pt",
          borderBottom: `2.5pt solid ${theme.ink}`,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontFamily: theme.headingFont,
              fontSize: "32pt",
              fontWeight: 800,
              letterSpacing: "-0.035em",
              lineHeight: 0.98,
            }}
          >
            {fullName(personal) || "Your Name"}
          </h1>
          {personal.jobTitle ? (
            <p
              style={{
                margin: "5pt 0 0",
                fontSize: "10pt",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: theme.accentDark,
              }}
            >
              {personal.jobTitle}
            </p>
          ) : null}
        </div>
        <div style={{ textAlign: "right", maxWidth: "62mm" }}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <ContactList items={contactItems(personal)} theme={theme} columns={1} icon={false} />
          </div>
        </div>
      </header>

      {/* --------------------------- two-column body ------------------------ */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 62mm",
          gap: "10mm",
          padding: "8mm 16mm 16mm",
          alignItems: "start",
        }}
      >
        <div style={{ minWidth: 0 }}>
          {mainSections.map((section) => (
            <SectionBlock
              key={section}
              data={data}
              section={section}
              theme={theme}
              options={mainOptions}
            />
          ))}
        </div>

        <aside
          style={{
            borderLeft: `0.75pt solid ${theme.line}`,
            paddingLeft: "6mm",
            minWidth: 0,
          }}
        >
          {railSections.map((section) => (
            <section key={section} style={{ marginBottom: theme.sectionGap }}>
              <SectionTitle
                title={configSectionLabel(section)}
                variant="block"
                theme={theme}
                accent={theme.accent}
              />
              <SectionContent data={data} section={section} theme={theme} options={railOptions} />
            </section>
          ))}
        </aside>
      </div>
    </div>
  );
}

/** Rail headings are shorter than the default labels to fit the narrow column. */
function configSectionLabel(section: SectionKey): string {
  switch (section) {
    case "certifications":
      return "Certification";
    case "languages":
      return "Languages";
    case "education":
      return "Education";
    case "skills":
      return "Skills";
    case "hobbies":
      return "Interests";
    default:
      return section;
  }
}
