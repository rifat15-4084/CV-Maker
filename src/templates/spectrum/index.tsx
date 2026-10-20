import { config } from "./config";
import { createTheme } from "../_kit/theme";
import { pickFont } from "../_kit/fonts";
import { contactItems, fullName, visibleSections } from "../_kit/helpers";
import { SectionContent, type SectionStyleOptions } from "../_kit/sections";
import { Icon, Sheet } from "../_kit/primitives";
import { SECTION_LABELS } from "@/lib/cv/defaults";
import type { SectionKey } from "@/lib/cv/schema";
import type { TemplateProps } from "../types";

export { config };

const CARD_KEYS: SectionKey[] = ["summary", "skills", "languages", "hobbies"];

export function Template({ data }: TemplateProps) {
  const theme = createTheme(data, { font: pickFont(data.settings.font, config.fonts) });
  const personal = data.personal;
  const contact = contactItems(personal);
  const sections = visibleSections(data);
  const cardSections = sections.filter((section) => CARD_KEYS.includes(section));
  const listSections = sections.filter((section) => !CARD_KEYS.includes(section));

  const options: SectionStyleOptions = { entryLayout: "row", bulletMarker: "disc", skillStyle: "bars" };

  return (
    <Sheet theme={theme} style={{ padding: 0 }}>
      <header style={{ background: `linear-gradient(115deg, ${theme.accent}, ${theme.accentDark})`, color: theme.accentText, padding: "15mm 16mm" }}>
        <h1 style={{ margin: 0, fontSize: "30pt", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.03 }}>{fullName(personal) || "Your Name"}</h1>
        {personal.jobTitle ? <p style={{ margin: "5pt 0 0", fontSize: "11.5pt", fontWeight: 600, opacity: 0.95 }}>{personal.jobTitle}</p> : null}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4pt 14pt", marginTop: "10pt", fontSize: "8.8pt" }}>
          {contact.map((item) => (
            <span key={item.key} style={{ display: "flex", alignItems: "center", gap: "4pt" }}>
              <Icon name={item.icon} size={10} />
              {item.value}
            </span>
          ))}
        </div>
      </header>

      <div style={{ padding: "12mm 16mm 16mm", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10mm" }}>
        <div style={{ minWidth: 0 }}>
          {cardSections.map((section) => (
            <section key={section} className="cv-avoid-break" style={{ background: theme.tintSoft, border: `0.75pt solid ${theme.tintStrong}`, borderRadius: theme.radius, padding: "8pt 9pt", marginBottom: theme.gap }}>
              <h2 style={{ fontSize: "9.5pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: theme.accentDark, marginBottom: "6pt" }}>{SECTION_LABELS[section]}</h2>
              <SectionContent data={data} section={section} theme={theme} options={options} />
            </section>
          ))}
        </div>
        <div style={{ minWidth: 0 }}>
          {listSections.map((section) => (
            <section key={section} className="cv-section" style={{ marginBottom: theme.sectionGap }}>
              <h2 style={{ fontSize: "11pt", fontWeight: 700, paddingBottom: "3pt", borderBottom: `2pt solid ${theme.accent}`, marginBottom: "7pt" }}>{SECTION_LABELS[section]}</h2>
              <SectionContent data={data} section={section} theme={theme} options={options} />
            </section>
          ))}
        </div>
      </div>
    </Sheet>
  );
}
