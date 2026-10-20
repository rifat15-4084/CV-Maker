import { config } from "./config";
import { createTheme } from "../_kit/theme";
import { pickFont, resolveFont } from "../_kit/fonts";
import { contactItems, fullName } from "../_kit/helpers";
import { SectionBlock, type SectionStyleOptions } from "../_kit/sections";
import { Sheet } from "../_kit/primitives";
import type { TemplateProps } from "../types";

export { config };

const BODY_SECTIONS = [
  "education",
  "experience",
  "projects",
  "skills",
  "certifications",
  "awards",
  "languages",
  "references",
  "custom",
] as const;

export function Template({ data }: TemplateProps) {
  const theme = createTheme(data, {
    font: resolveFont("source"),
    headingFont: pickFont(data.settings.font, config.fonts),
    density: "compact",
  });
  const personal = data.personal;
  const contact = contactItems(personal);
  const inlineContact = data.extra.showContactInline !== false;
  const profileHeading = String(data.extra.profileHeading ?? "Research Profile");

  const options: SectionStyleOptions = {
    titleVariant: "caps",
    entryLayout: "stacked",
    bulletMarker: "disc",
    skillStyle: "columns",
    skillColumns: 2,
    labels: {
      education: "Education",
      experience: "Academic & Professional Experience",
      projects: "Publications & Projects",
      skills: "Areas of Expertise",
      summary: profileHeading || "Research Profile",
      awards: "Honours & Awards",
      references: "References",
    },
  };

  return (
    <Sheet theme={theme} style={{ padding: 0 }}>
      <div style={{ padding: "16mm 20mm 18mm" }}>
        {/* -------------------------------- header --------------------------- */}
        <header style={{ textAlign: "center" }}>
          <h1
            style={{
              fontFamily: "var(--cv-heading)",
              margin: 0,
              fontSize: "32pt",
              fontWeight: 600,
              letterSpacing: "0.01em",
              lineHeight: 1.1,
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
                color: theme.muted,
              }}
            >
              {personal.jobTitle}
            </p>
          ) : null}
          {personal.tagline ? (
            <p style={{ margin: "4pt 0 0", fontSize: "9.5pt", color: theme.faint }}>{personal.tagline}</p>
          ) : null}

          <div
            style={{
              borderTop: `2pt solid ${theme.accent}`,
              borderBottom: `0.75pt solid ${theme.ink}`,
              margin: "10pt auto 0",
              paddingTop: "6pt",
              paddingBottom: "5pt",
              maxWidth: "140mm",
              fontSize: "9pt",
              color: theme.muted,
              lineHeight: 1.6,
            }}
          >
            {inlineContact ? (
              contact.map((item, index) => (
                <span key={item.key}>
                  {index > 0 ? <span style={{ color: theme.accent, padding: "0 5pt" }}>·</span> : null}
                  {item.value}
                </span>
              ))
            ) : (
              <>
                {personal.email ? <div>{personal.email}</div> : null}
                {personal.phone ? <div>{personal.phone}</div> : null}
                {personal.address ? <div>{personal.address}</div> : null}
              </>
            )}
          </div>
        </header>

        {/* ------------------------------- sections -------------------------- */}
        <div style={{ marginTop: "14pt" }}>
          <SectionBlock data={data} section="summary" theme={theme} options={options} />
          {BODY_SECTIONS.map((section) => (
            <SectionBlock
              key={section}
              data={data}
              section={section}
              theme={theme}
              options={{
                ...options,
                entryLayout: section === "education" || section === "experience" ? "stacked" : options.entryLayout,
              }}
            />
          ))}        </div>
      </div>
    </Sheet>
  );
}
