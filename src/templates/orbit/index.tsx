import { config } from "./config";
import { createTheme } from "../_kit/theme";
import { pickFont } from "../_kit/fonts";
import { contactItems, fullName, show } from "../_kit/helpers";
import { SectionContent, type SectionStyleOptions } from "../_kit/sections";
import {
  BulletList,
  Chip,
  ChipRow,
  Icon,
  Photo,
  Sheet,
  SkillBars,
  SkillChips,
} from "../_kit/primitives";
import { formatDateRange } from "@/lib/cv/format";
import { orderedSections, SECTION_LABELS } from "@/lib/cv/defaults";
import type { TemplateProps } from "../types";

export { config };

export function Template({ data }: TemplateProps) {
  const theme = createTheme(data, { font: pickFont(data.settings.font, config.fonts) });
  const personal = data.personal;
  const contact = contactItems(personal);
  const showPhoto = data.extra.showPhoto !== false;
  const skillStyle = String(data.extra.skillLevelStyle ?? "dots");

  const options: SectionStyleOptions = {
    titleVariant: "rule",
    entryLayout: "row",
    bulletMarker: "disc",
    labels: { summary: "Profile", projects: "Key Projects", certifications: "Certifications" },
  };

  const sections = orderedSections(data.settings).filter((key) => show(data, key));

  return (
    <Sheet theme={theme} style={{ padding: 0 }}>
      {/* -------------------------------- header ----------------------------- */}
      <header
        style={{
          background: `linear-gradient(120deg, ${theme.accent}, ${theme.accentDark})`,
          color: theme.accentText,
          padding: "16mm 16mm",
          display: "flex",
          gap: "12mm",
          alignItems: "center",
        }}
      >
        {showPhoto ? (
          <Photo
            src={personal.photo}
            theme={theme}
            accent="rgba(255,255,255,0.9)"
            size="32mm"
            shape="circle"
            initialsText={`${personal.firstName}${personal.lastName}`}
          />
        ) : null}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ margin: 0, fontSize: "30pt", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.02 }}>
            {fullName(personal) || "Your Name"}
          </h1>
          {personal.jobTitle ? (
            <p style={{ margin: "4pt 0 0", fontSize: "11.5pt", fontWeight: 600, opacity: 0.94, letterSpacing: "0.04em" }}>
              {personal.jobTitle}
            </p>
          ) : null}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "4pt 12pt",
              marginTop: "9pt",
              fontSize: "8.8pt",
            }}
          >
            {contact.map((item) => (
              <span key={item.key} style={{ display: "flex", alignItems: "center", gap: "4pt" }}>
                <Icon name={item.icon} size={10} />
                {item.value}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* -------------------------------- body ------------------------------- */}
      <div style={{ padding: "12mm 16mm 16mm" }}>
        {sections.map((section) => {
          if (section === "skills") {
            return (
              <section key={section} className="cv-section" style={{ marginBottom: theme.sectionGap }}>
                <h2
                  style={{
                    fontSize: "11.5pt",
                    fontWeight: 800,
                    borderLeft: `3.5pt solid ${theme.accent}`,
                    paddingLeft: "7pt",
                    marginBottom: "8pt",
                  }}
                >
                  {SECTION_LABELS.skills}
                </h2>
                {skillStyle === "bars" ? (
                  <SkillBars items={data.skills} theme={theme} columns={2} />
                ) : skillStyle === "hidden" ? (
                  <SkillChips items={data.skills} theme={theme} variant="outline" />
                ) : (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "5pt 18pt",
                    }}
                  >
                    {data.skills.map((skill) => (
                      <div key={skill.id} className="cv-avoid-break" style={{ display: "grid", gap: "2.5pt" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9.5pt" }}>
                          <span style={{ fontWeight: 600 }}>{skill.name}</span>
                          <span style={{ display: "flex", gap: "2.5pt" }}>
                            {[1, 2, 3, 4, 5].map((step) => (
                              <span
                                key={step}
                                style={{
                                  width: "5pt",
                                  height: "5pt",
                                  borderRadius: "50%",
                                  background: step <= skill.level ? theme.accent : theme.line,
                                }}
                              />
                            ))}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            );
          }

          if (section === "experience" || section === "education") {
            const items = section === "experience" ? data.experience : data.education;
            return (
              <section key={section} className="cv-section" style={{ marginBottom: theme.sectionGap }}>
                <h2
                  style={{
                    fontSize: "11.5pt",
                    fontWeight: 800,
                    borderLeft: `3.5pt solid ${theme.accent}`,
                    paddingLeft: "7pt",
                    marginBottom: "8pt",
                  }}
                >
                  {SECTION_LABELS[section]}
                </h2>
                <div style={{ position: "relative", paddingLeft: "14pt" }}>
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      left: 0,
                      top: "4pt",
                      bottom: "4pt",
                      width: "1.25pt",
                      background: theme.line,
                    }}
                  />
                  {items.map((item) => {
                    const isExperience = "role" in item;
                    return (
                      <div
                        key={item.id}
                        className="cv-avoid-break"
                        style={{ position: "relative", marginBottom: theme.gap }}
                      >
                        <span
                          aria-hidden
                          style={{
                            position: "absolute",
                            left: "-14pt",
                            top: "3.5pt",
                            width: "7pt",
                            height: "7pt",
                            borderRadius: "50%",
                            background: theme.accent,
                            border: `1.25pt solid ${theme.paper}`,
                          }}
                        />
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "10pt", alignItems: "baseline" }}>
                          <div style={{ minWidth: 0 }}>
                            <div className="cv-entry-title" style={{ fontWeight: 700, fontSize: "11pt" }}>
                              {isExperience ? item.role || "Job title" : item.degree || item.field || "Degree"}
                            </div>
                            <div style={{ fontSize: "9.8pt", color: theme.accentDark, fontWeight: 600 }}>
                              {isExperience
                                ? [item.company, item.location].filter(Boolean).join(" · ")
                                : [item.school, item.location].filter(Boolean).join(" · ")}
                            </div>
                          </div>
                          <div style={{ flexShrink: 0, fontSize: "8.8pt", fontWeight: 700, color: theme.muted, whiteSpace: "nowrap" }}>
                            {formatDateRange(item.startDate, item.endDate, item.current, true)}
                          </div>
                        </div>
                        {isExperience && item.description ? (
                          <p style={{ margin: "3pt 0 0", fontSize: "9.8pt", color: theme.muted }}>{item.description}</p>
                        ) : null}
                        {!isExperience && (item.grade || item.description) ? (
                          <p style={{ margin: "3pt 0 0", fontSize: "9.8pt", color: theme.muted }}>
                            {[item.grade, item.description].filter(Boolean).join(" — ")}
                          </p>
                        ) : null}
                        <BulletList items={item.bullets} theme={theme} accent={theme.accent} />
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          }

          if (section === "languages") {
            return (
              <section key={section} className="cv-section" style={{ marginBottom: theme.sectionGap }}>
                <h2
                  style={{
                    fontSize: "11.5pt",
                    fontWeight: 800,
                    borderLeft: `3.5pt solid ${theme.accent}`,
                    paddingLeft: "7pt",
                    marginBottom: "8pt",
                  }}
                >
                  {SECTION_LABELS.languages}
                </h2>
                <ChipRow>
                  {data.languages.map((item) => (
                    <Chip key={item.id} theme={theme}>
                      {item.name} · {item.level.replace(/-/g, " ")}
                    </Chip>
                  ))}
                </ChipRow>
              </section>
            );
          }

          return (
            <SectionContent key={section} data={data} section={section} theme={theme} options={options} />
          );
        })}
      </div>
    </Sheet>
  );
}
