import { config } from "./config";
import { createTheme } from "../_kit/theme";
import { pickFont } from "../_kit/fonts";
import { fullName } from "../_kit/helpers";
import { ContactBlock, SectionBlock, type SectionStyleOptions } from "../_kit/sections";
import { Photo, Sheet, SheetSection } from "../_kit/primitives";
import type { TemplateProps } from "../types";

export { config };

export function Template({ data }: TemplateProps) {
  const theme = createTheme(data, { font: pickFont(data.settings.font, config.fonts), density: "relaxed" });
  const personal = data.personal;
  const showPhoto = data.extra.showPhoto !== false;
  const timeline = data.extra.timeline !== false;

  const options: SectionStyleOptions = { titleVariant: "underline", entryLayout: "row", bulletMarker: "disc", timeline };

  return (
    <Sheet theme={theme} style={{ padding: 0 }}>
      <div style={{ display: "grid", gridTemplateColumns: "66mm 1fr", minHeight: "297mm" }}>
        <aside style={{ background: "#f8fafc", borderRight: `0.75pt solid ${theme.line}`, padding: "14mm 8mm", display: "grid", gap: "14pt", alignContent: "start" }}>
          <div style={{ background: theme.accent, color: theme.accentText, borderRadius: theme.radius, padding: "10pt 9pt", display: "grid", justifyItems: "center", gap: "7pt" }}>
            {showPhoto ? <Photo src={personal.photo} theme={theme} accent="rgba(255,255,255,0.9)" size="30mm" initialsText={`${personal.firstName}${personal.lastName}`} /> : null}
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 700, fontSize: "11pt" }}>{fullName(personal) || "Your Name"}</div>
              {personal.jobTitle ? <div style={{ fontSize: "8.8pt", opacity: 0.9 }}>{personal.jobTitle}</div> : null}
            </div>
          </div>
          <SheetSection title="Contact" variant="sidebar" theme={theme}>
            <ContactBlock data={data} theme={theme} />
          </SheetSection>
          <SectionBlock data={data} section="skills" theme={theme} options={{ titleVariant: "sidebar", skillStyle: "dots" }} />
          <SectionBlock data={data} section="languages" theme={theme} options={{ titleVariant: "sidebar" }} />
          <SectionBlock data={data} section="hobbies" theme={theme} options={{ titleVariant: "sidebar", chipVariant: "outline" }} />
        </aside>

        <main style={{ padding: "16mm 14mm 14mm", minWidth: 0 }}>
          <SectionBlock data={data} section="summary" theme={theme} options={options} />
          <SectionBlock data={data} section="experience" theme={theme} options={options} />
          <SectionBlock data={data} section="education" theme={theme} options={{ ...options, timeline: false }} />
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
