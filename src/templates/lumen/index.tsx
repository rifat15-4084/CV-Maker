import { config } from "./config";
import { createTheme } from "../_kit/theme";
import { pickFont } from "../_kit/fonts";
import { fullName } from "../_kit/helpers";
import { ContactBlock, SectionBlock, type SectionStyleOptions } from "../_kit/sections";
import { Photo, Sheet, SheetSection } from "../_kit/primitives";
import type { TemplateProps } from "../types";

export { config };

export function Template({ data }: TemplateProps) {
  const theme = createTheme(data, { font: pickFont(data.settings.font, config.fonts) });
  const personal = data.personal;
  const showPhoto = data.extra.showPhoto !== false;

  const options: SectionStyleOptions = {
    titleVariant: "underline",
    entryLayout: "row",
    bulletMarker: "disc",
  };

  return (
    <Sheet theme={theme} style={{ padding: 0 }}>
      <div style={{ display: "grid", gridTemplateColumns: "62mm 1fr", minHeight: "297mm" }}>
        <aside style={{ background: theme.tintSoft, padding: "15mm 8mm", display: "grid", gap: "14pt", alignContent: "start" }}>
          {showPhoto ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Photo src={personal.photo} theme={theme} size="32mm" initialsText={`${personal.firstName}${personal.lastName}`} />
            </div>
          ) : null}
          <SheetSection title="Contact" variant="sidebar" theme={theme}>
            <ContactBlock data={data} theme={theme} columns={1} />
          </SheetSection>
          <SectionBlock data={data} section="skills" theme={theme} options={{ titleVariant: "sidebar", skillStyle: "bars" }} />
          <SectionBlock data={data} section="languages" theme={theme} options={{ titleVariant: "sidebar" }} />
          <SectionBlock data={data} section="hobbies" theme={theme} options={{ titleVariant: "sidebar", chipVariant: "outline" }} />
        </aside>

        <main style={{ padding: "15mm 14mm", minWidth: 0 }}>
          <header style={{ marginBottom: theme.sectionGap }}>
            <h1 style={{ margin: 0, fontSize: "27pt", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.05 }}>
              {fullName(personal) || "Your Name"}
            </h1>
            {personal.jobTitle ? (
              <p style={{ margin: "4pt 0 0", fontSize: "11pt", fontWeight: 600, color: theme.accentDark }}>{personal.jobTitle}</p>
            ) : null}
            <div aria-hidden style={{ width: "24mm", height: "2.5pt", background: theme.accent, marginTop: "8pt", borderRadius: "2pt" }} />
            {personal.tagline ? (
              <p style={{ margin: "8pt 0 0", fontSize: "9.8pt", color: theme.muted }}>{personal.tagline}</p>
            ) : null}
          </header>
          <SectionBlock data={data} section="summary" theme={theme} options={options} />
          <SectionBlock data={data} section="experience" theme={theme} options={options} />
          <SectionBlock data={data} section="education" theme={theme} options={options} />
          <SectionBlock data={data} section="projects" theme={theme} options={options} />
          <SectionBlock data={data} section="certifications" theme={theme} options={{ ...options, separator: true }} />
          <SectionBlock data={data} section="awards" theme={theme} options={{ ...options, separator: true }} />
          <SectionBlock data={data} section="references" theme={theme} options={options} />
          <SectionBlock data={data} section="custom" theme={theme} options={options} />
        </main>
      </div>
    </Sheet>
  );
}
