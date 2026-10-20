import { config } from "./config";
import { createTheme } from "../_kit/theme";
import { pickFont } from "../_kit/fonts";
import { fullName } from "../_kit/helpers";
import { ContactBlock, SectionBlock, type SectionStyleOptions } from "../_kit/sections";
import { Photo, SectionTitle, Sheet } from "../_kit/primitives";
import type { TemplateProps } from "../types";

export { config };

const MAIN_SECTIONS = [
  "summary",
  "experience",
  "education",
  "projects",
  "certifications",
  "awards",
  "references",
  "custom",
] as const;

export function Template({ data }: TemplateProps) {
  const theme = createTheme(data, { font: pickFont(data.settings.font, config.fonts) });
  const personal = data.personal;
  const showPhoto = data.extra.showPhoto !== false;
  const showIcons = data.extra.showContactIcons !== false;

  const mainOptions: SectionStyleOptions = {
    titleVariant: "underline",
    entryLayout: "row",
    bulletMarker: "disc",
  };

  return (
    <Sheet theme={theme} style={{ padding: 0 }}>
      <div style={{ display: "grid", gridTemplateColumns: "64mm 1fr", minHeight: "297mm" }}>
        {/* ------------------------------ sidebar ----------------------------- */}
        <aside
          style={{
            background: theme.tintSoft,
            borderRight: `1.5pt solid ${theme.accent}`,
            padding: "16mm 8mm 14mm",
            display: "grid",
            gap: "15pt",
            alignContent: "start",
          }}
        >
          {showPhoto ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Photo
                src={personal.photo}
                theme={theme}
                size="34mm"
                shape="circle"
                initialsText={`${personal.firstName}${personal.lastName}`}
              />
            </div>
          ) : null}

          <div>
            <SectionTitle title="Contact" variant="sidebar" theme={theme} />
            <ContactBlock data={data} theme={theme} icon={showIcons} />
          </div>

          <SectionBlock
            data={data}
            section="skills"
            theme={theme}
            options={{ titleVariant: "sidebar", skillStyle: "bars" }}
          />
          <SectionBlock
            data={data}
            section="languages"
            theme={theme}
            options={{ titleVariant: "sidebar" }}
          />
          <SectionBlock
            data={data}
            section="hobbies"
            theme={theme}
            options={{ titleVariant: "sidebar", chipVariant: "outline" }}
          />
        </aside>

        {/* -------------------------------- main ------------------------------ */}
        <main style={{ padding: "16mm 14mm 14mm", minWidth: 0 }}>
          <header style={{ marginBottom: theme.sectionGap }}>
            <h1
              style={{
                fontSize: "30pt",
                fontWeight: 800,
                letterSpacing: "-0.025em",
                lineHeight: 1.05,
                margin: 0,
              }}
            >
              {fullName(personal) || "Your Name"}
            </h1>
            {personal.jobTitle ? (
              <p
                style={{
                  margin: "5pt 0 0",
                  color: theme.accentDark,
                  fontSize: "12pt",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                }}
              >
                {personal.jobTitle}
              </p>
            ) : null}
            {personal.tagline ? (
              <p style={{ margin: "6pt 0 0", color: theme.muted, fontSize: "10pt", maxWidth: "110mm" }}>
                {personal.tagline}
              </p>
            ) : null}
            <div
              aria-hidden
              style={{ width: "26mm", height: "3pt", background: theme.accent, marginTop: "9pt", borderRadius: "2pt" }}
            />
          </header>

          {MAIN_SECTIONS.map((section) => (
            <SectionBlock key={section} data={data} section={section} theme={theme} options={mainOptions} />
          ))}
        </main>
      </div>
    </Sheet>
  );
}
