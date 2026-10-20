import { config } from "./config";
import { createTheme } from "../_kit/theme";
import { pickFont } from "../_kit/fonts";
import { contactItems, fullName, visibleSections } from "../_kit/helpers";
import { SectionBlock, type SectionStyleOptions } from "../_kit/sections";
import { Icon, Sheet, SheetSection } from "../_kit/primitives";
import type { TemplateProps } from "../types";

export { config };

export function Template({ data }: TemplateProps) {
  const theme = createTheme(data, { font: pickFont(data.settings.font, config.fonts), density: "relaxed" });
  const personal = data.personal;
  const contact = contactItems(personal);
  const dividers = data.extra.sectionDividers !== false;
  const sections = visibleSections(data);
  const mainSections = sections.filter((s) => s !== "skills" && s !== "languages");
  const sideSections = sections.filter((s) => s === "skills" || s === "languages");

  const options: SectionStyleOptions = { titleVariant: "caps", entryLayout: "row", bulletMarker: "dash" };

  return (
    <Sheet theme={theme} style={{ padding: 0 }}>
      <header style={{ padding: "16mm 16mm 10mm", borderBottom: `3pt solid ${theme.accent}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "10pt", alignItems: "flex-end", flexWrap: "wrap" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "30pt", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.06 }}>{fullName(personal) || "Your Name"}</h1>
            {personal.jobTitle ? <p style={{ margin: "5pt 0 0", fontSize: "11pt", letterSpacing: "0.18em", textTransform: "uppercase", color: theme.accentDark, fontWeight: 600 }}>{personal.jobTitle}</p> : null}
          </div>
          <div style={{ display: "grid", gap: "3pt", fontSize: "9pt", color: theme.muted, textAlign: "right" }}>
            {contact.slice(0, 4).map((item) => (
              <span key={item.key} style={{ display: "flex", gap: "5pt", alignItems: "center", justifyContent: "flex-end" }}>
                <span style={{ color: theme.accent, display: "flex" }}><Icon name={item.icon} size={10} /></span>
                {item.value}
              </span>
            ))}
          </div>
        </div>
        {contact.length > 4 ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4pt 14pt", marginTop: "9pt", fontSize: "8.8pt", color: theme.faint }}>
            {contact.slice(4).map((item) => <span key={item.key}>{item.value}</span>)}
          </div>
        ) : null}
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 52mm", gap: "12mm", padding: "12mm 16mm 16mm" }}>
        <div style={{ minWidth: 0 }}>
          {mainSections.map((section, index) => (
            <div key={section}>
              {dividers && index > 0 ? <div aria-hidden style={{ height: "0.75pt", background: theme.line, marginBottom: theme.sectionGap }} /> : null}
              <SectionBlock data={data} section={section} theme={theme} options={options} />
            </div>
          ))}
        </div>
        <aside style={{ display: "grid", gap: theme.sectionGap, alignContent: "start", borderLeft: `0.75pt solid ${theme.line}`, paddingLeft: "8mm" }}>
          {sideSections.map((section) => (
            <SectionBlock key={section} data={data} section={section} theme={theme} options={{ ...options, skillStyle: "bars" }} />
          ))}
          <SectionBlock data={data} section="hobbies" theme={theme} options={{ titleVariant: "caps", chipVariant: "outline" }} />
          {personal.tagline ? (
            <SheetSection title="In short" variant="caps" theme={theme}>
              <p style={{ margin: 0, fontSize: "9.5pt", color: theme.muted, fontStyle: "italic" }}>{personal.tagline}</p>
            </SheetSection>
          ) : null}
        </aside>
      </div>
    </Sheet>
  );
}
