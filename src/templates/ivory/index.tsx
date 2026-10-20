import { config } from "./config";
import { createTheme } from "../_kit/theme";
import { pickFont, resolveFont } from "../_kit/fonts";
import { contactItems, fullName, show } from "../_kit/helpers";
import { SECTION_LABELS } from "@/lib/cv/defaults";
import { SectionContent, type SectionStyleOptions } from "../_kit/sections";
import { Chip, ChipRow, Sheet } from "../_kit/primitives";
import { orderedSections } from "@/lib/cv/defaults";
import type { TemplateProps } from "../types";
export { config };

const SEPARATORS: Record<string, string> = { dot: " · ", pipe: "  |  ", none: "   " };

export function Template({ data }: TemplateProps) {
  const theme = createTheme(data, {
    font: resolveFont("source"),
    headingFont: pickFont(data.settings.font, config.fonts),
    density: "relaxed",
  });
  const personal = data.personal;
  const contact = contactItems(personal);
  const separator = SEPARATORS[String(data.extra.contactSeparators ?? "dot")] ?? SEPARATORS.dot;
  const showLabels = data.extra.showLabels !== false;

  const options: SectionStyleOptions = {
    entryLayout: "row",
    bulletMarker: "dash",
    chipVariant: "outline",
  };

  const sections = orderedSections(data.settings).filter((key) => show(data, key));

  return (
    <Sheet theme={theme} style={{ padding: 0 }}>
      <div style={{ padding: "22mm 20mm 18mm" }}>
        {/* -------------------------------- header --------------------------- */}
        <header>
          <h1
            style={{
              fontFamily: "var(--cv-heading)",
              margin: 0,
              fontSize: "34pt",
              fontWeight: 500,
              letterSpacing: "0.005em",
              lineHeight: 1.1,
            }}
          >
            {fullName(personal) || "Your Name"}
          </h1>
          {personal.jobTitle ? (
            <p
              style={{
                margin: "5pt 0 0",
                fontSize: "10pt",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: theme.accentDark,
                fontWeight: 600,
              }}
            >
              {personal.jobTitle}
            </p>
          ) : null}

          <div aria-hidden style={{ height: "0.75pt", background: theme.ink, margin: "12pt 0 6pt" }} />

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: "9pt",
              color: theme.muted,
              gap: "2pt 0",
            }}
          >
            {contact.map((item, index) => (
              <span key={item.key} style={{ display: "inline-flex" }}>
                {index > 0 ? <span style={{ color: theme.accent, padding: "0 6pt" }}>{separator}</span> : null}
                {item.value}
              </span>
            ))}
          </div>
          <div aria-hidden style={{ height: "0.75pt", background: theme.line, marginTop: "6pt" }} />
        </header>

        {/* ------------------------------- sections -------------------------- */}
        <div style={{ marginTop: "16pt" }}>
          {sections.map((section) =>
            section === "skills" || section === "hobbies" ? (
              <section
                key={section}
                className="cv-avoid-break"
                style={{
                  display: "grid",
                  gridTemplateColumns: showLabels ? "34mm 1fr" : "1fr",
                  gap: "10mm",
                  marginBottom: theme.sectionGap,
                }}
              >
                {showLabels ? (
                  <div
                    style={{
                      fontFamily: "var(--cv-heading)",
                      fontSize: "8.5pt",
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: theme.faint,
                      paddingTop: "2pt",
                    }}
                  >
                    {SECTION_LABELS[section]}
                  </div>
                ) : null}
                <div>
                  <ChipRow gap="4pt">
                    {section === "skills"
                      ? data.skills.map((item) => (
                          <Chip key={item.id} theme={theme} variant="outline">
                            {item.name}
                          </Chip>
                        ))
                      : data.hobbies.map((item) => (
                          <Chip key={item.id} theme={theme} variant="outline">
                            {item.name}
                          </Chip>
                        ))}
                  </ChipRow>
                </div>
              </section>
            ) : (
              <section
                key={section}
                style={{
                  display: "grid",
                  gridTemplateColumns: showLabels ? "34mm 1fr" : "1fr",
                  gap: "10mm",
                  marginBottom: theme.sectionGap,
                }}
              >
                {showLabels ? (
                  <div
                    className="cv-avoid-break"
                    style={{
                      fontFamily: "var(--cv-heading)",
                      fontSize: "8.5pt",
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: theme.faint,
                      paddingTop: "2pt",
                    }}
                  >
                    {SECTION_LABELS[section]}
                  </div>
                ) : null}
                <div style={{ minWidth: 0 }}>
                  <SectionContent data={data} section={section} theme={theme} options={options} />
                </div>
              </section>
            ),
          )}
        </div>
      </div>
    </Sheet>
  );
}
