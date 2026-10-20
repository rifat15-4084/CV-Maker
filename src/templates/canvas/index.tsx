import { config } from "./config";
import { createTheme } from "../_kit/theme";
import { pickFont } from "../_kit/fonts";
import { fullName } from "../_kit/helpers";
import { ContactBlock, SectionBlock, type SectionStyleOptions } from "../_kit/sections";
import { BulletList, Chip, ChipRow, Photo, SectionTitle, Sheet } from "../_kit/primitives";
import type { TemplateProps } from "../types";

export { config };

const STACK_SECTIONS = [
  "experience",
  "education",
  "certifications",
  "languages",
  "awards",
  "references",
  "hobbies",
  "custom",
] as const;

export function Template({ data }: TemplateProps) {
  const theme = createTheme(data, { font: pickFont(data.settings.font, config.fonts) });
  const personal = data.personal;
  const showPhoto = data.extra.showPhoto !== false;
  const showTagline = data.extra.coverTagline !== false;
  const columns = data.extra.projectColumns === "1" ? 1 : 2;

  const options: SectionStyleOptions = {
    titleVariant: "boxed",
    entryLayout: "stacked",
    bulletMarker: "square",
  };

  return (
    <Sheet theme={theme} style={{ padding: 0 }}>
      {/* -------------------------------- header ----------------------------- */}
      <header style={{ position: "relative", padding: "16mm 16mm 12mm", overflow: "hidden" }}>
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "62mm",
            height: "52mm",
            background: theme.tint,
            borderBottomLeftRadius: "26mm",
            zIndex: 0,
          }}
        />
        <div style={{ position: "relative", zIndex: 1, display: "flex", gap: "12mm", alignItems: "center" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span
              style={{
                display: "inline-block",
                background: theme.accent,
                color: theme.accentText,
                fontSize: "8.5pt",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                padding: "3pt 8pt",
                borderRadius: "99pt",
                marginBottom: "8pt",
              }}
            >
              {personal.jobTitle || "Curriculum Vitae"}
            </span>
            <h1
              style={{
                margin: 0,
                fontSize: "36pt",
                fontWeight: 800,
                letterSpacing: "-0.035em",
                lineHeight: 0.98,
                textTransform: "uppercase",
              }}
            >
              {fullName(personal) || "Your Name"}
            </h1>
            {showTagline && personal.tagline ? (
              <p style={{ margin: "8pt 0 0", fontSize: "10.5pt", color: theme.muted, maxWidth: "100mm" }}>
                {personal.tagline}
              </p>
            ) : null}
          </div>
          {showPhoto ? (
            <div style={{ flexShrink: 0, marginRight: "6mm" }}>
              <Photo
                src={personal.photo}
                theme={theme}
                size="34mm"
                shape="square"
                ring
                initialsText={`${personal.firstName}${personal.lastName}`}
              />
            </div>
          ) : null}
        </div>

        <div style={{ marginTop: "12pt", paddingTop: "8pt", borderTop: `1.5pt solid ${theme.accent}` }}>
          <ContactBlock data={data} theme={theme} columns={2} />
        </div>
      </header>

      {/* -------------------------------- body ------------------------------- */}
      <div style={{ padding: "6mm 16mm 16mm" }}>
        <SectionBlock data={data} section="summary" theme={theme} options={{ ...options, titleVariant: "rule" }} />
        <SectionBlock data={data} section="experience" theme={theme} options={options} />

        {data.projects.length > 0 && data.settings.sectionVisibility.projects !== false ? (
          <section style={{ marginBottom: theme.sectionGap }}>
            <SectionTitle title="Projects" variant="boxed" theme={theme} />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: columns === 2 ? "1fr 1fr" : "1fr",
                gap: "8pt",
              }}
            >
              {data.projects.map((project) => (
                <div
                  key={project.id}
                  className="cv-avoid-break"
                  style={{
                    border: `0.75pt solid ${theme.line}`,
                    borderLeft: `3pt solid ${theme.accent}`,
                    borderRadius: theme.radius,
                    padding: "8pt 9pt",
                    background: theme.tintSoft,
                    breakInside: "avoid",
                  }}
                >
                  <div className="cv-entry-title" style={{ fontWeight: 700, fontSize: "11pt" }}>
                    {project.name}
                  </div>
                  <div style={{ fontSize: "8.5pt", color: theme.accentDark, fontWeight: 600, marginTop: "2pt" }}>
                    {[project.role, project.tech].filter(Boolean).join(" · ")}
                  </div>
                  {project.link ? (
                    <div style={{ fontSize: "8.5pt", color: theme.faint, marginTop: "1pt" }}>{project.link}</div>
                  ) : null}
                  {project.description ? (
                    <p style={{ margin: "4pt 0 0", fontSize: "9.5pt", color: theme.muted }}>
                      {project.description}
                    </p>
                  ) : null}
                  <BulletList items={project.bullets} theme={theme} accent={theme.accent} marker="square" />
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <SectionBlock data={data} section="education" theme={theme} options={options} />

        {data.skills.length > 0 && data.settings.sectionVisibility.skills !== false ? (
          <section style={{ marginBottom: theme.sectionGap }}>
            <SectionTitle title="Skills" variant="boxed" theme={theme} />
            <ChipRow gap="5pt">
              {data.skills.map((skill) => (
                <Chip key={skill.id} theme={theme} variant="solid">
                  {skill.name}
                  {skill.showBar ? ` · ${skill.level}/5` : ""}
                </Chip>
              ))}
            </ChipRow>
          </section>
        ) : null}

        {STACK_SECTIONS.map((section) => (
          <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />
        ))}
      </div>
    </Sheet>
  );
}
