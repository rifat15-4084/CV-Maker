import { config } from "./config";
import { createTheme } from "../_kit/theme";
import { pickFont } from "../_kit/fonts";
import { contactItems, fullName } from "../_kit/helpers";
import { SectionBlock, type SectionStyleOptions } from "../_kit/sections";
import { Icon, Sheet, SheetSection } from "../_kit/primitives";
import type { TemplateProps } from "../types";

export { config };

const BODY_SECTIONS = [
  "summary",
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
  "awards",
  "languages",
  "references",
  "hobbies",
  "custom",
] as const;

export function Template({ data }: TemplateProps) {
  const theme = createTheme(data, { density: "normal", font: pickFont(data.settings.font, config.fonts) });
  const personal = data.personal;
  const showTagline = data.extra.showTagline !== false;
  const contact = contactItems(personal).slice(0, 6);

  const options: SectionStyleOptions = {
    titleVariant: "double",
    entryLayout: "row",
    bulletMarker: "dash",
    separator: false,
  };

  return (
    <Sheet theme={theme} style={{ padding: 0 }}>
      {/* -------------------------------- header ----------------------------- */}
      <header
        style={{
          background: "#0f172a",
          color: "#f8fafc",
          padding: "18mm 18mm 14mm",
          borderBottom: `4pt solid ${theme.accent}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "16pt" }}>
          <div style={{ minWidth: 0 }}>
            <h1
              style={{
                fontFamily: theme.font,
                fontSize: "34pt",
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              {fullName(personal) || "Your Name"}
            </h1>
            {personal.jobTitle ? (
              <p
                style={{
                  margin: "6pt 0 0",
                  fontSize: "11.5pt",
                  textTransform: "uppercase",
                  letterSpacing: "0.24em",
                  color: theme.accent,
                  fontWeight: 600,
                }}
              >
                {personal.jobTitle}
              </p>
            ) : null}
            {showTagline && personal.tagline ? (
              <p style={{ margin: "7pt 0 0", fontSize: "10pt", color: "#cbd5e1", maxWidth: "120mm" }}>
                {personal.tagline}
              </p>
            ) : null}
          </div>
          <div aria-hidden style={{ width: "26mm", height: "26mm", position: "relative", flexShrink: 0 }}>
            <div style={{ position: "absolute", inset: 0, border: `1pt solid ${theme.accent}`, borderRadius: "2pt" }} />
            <div
              style={{
                position: "absolute",
                inset: "5pt",
                border: `0.5pt solid rgba(248,250,252,0.35)`,
                borderRadius: "1pt",
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: data.extra.contactLayout === "wrap" ? "1fr" : "repeat(3, minmax(0, 1fr))",
            gap: "5pt 14pt",
            marginTop: "14pt",
            paddingTop: "10pt",
            borderTop: "0.75pt solid rgba(248,250,250,0.22)",
          }}
        >
          {contact.map((item) => (
            <div key={item.key} style={{ display: "flex", gap: "5pt", alignItems: "center", color: "#e2e8f0", fontSize: "9pt" }}>
              <span style={{ color: theme.accent, display: "flex" }}>
                <Icon name={item.icon} size={10} />
              </span>
              <span style={{ overflowWrap: "anywhere" }}>{item.value}</span>
            </div>
          ))}
        </div>
      </header>

      {/* -------------------------------- body ------------------------------- */}
      <div style={{ padding: "14mm 18mm 16mm" }}>
        {data.summary ? (
          <SheetSection
            title="Executive Summary"
            variant="double"
            theme={theme}
            accent={theme.accent}
          >
            <p style={{ margin: 0, color: theme.muted, fontSize: "10.5pt", fontStyle: "italic" }}>
              {data.summary}
            </p>
          </SheetSection>
        ) : null}

        {BODY_SECTIONS.map((section) =>
          section === "summary" ? null : (
            <SectionBlock
              key={section}
              data={data}
              section={section}
              theme={theme}
              options={{
                ...options,
                skillStyle: "columns",
                labels: { experience: "Professional Experience", education: "Education & Training" },
              }}
            />
          ),
        )}
      </div>
    </Sheet>
  );
}
