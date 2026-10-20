import { config } from "./config";
import { createTheme } from "../_kit/theme";
import { pickFont } from "../_kit/fonts";
import { contactItems, fullName, visibleSections } from "../_kit/helpers";
import { SectionBlock, type SectionStyleOptions } from "../_kit/sections";
import { ContactList, Photo } from "../_kit/primitives";
import type { TemplateProps } from "../types";

export { config };

export function Template({ data }: TemplateProps) {
  const theme = createTheme(data, { font: pickFont(data.settings.font, config.fonts) });
  const personal = data.personal;
  const showPhoto = data.extra.showPhoto !== false;
  const options: SectionStyleOptions = { titleVariant: "underline", entryLayout: "row", bulletMarker: "disc" };
  const sections = visibleSections(data);
  return (
      <>
        <header style={{ background: "#0f172a", color: "#f8fafc", padding: "15mm 17mm", display: "flex", gap: "10mm", alignItems: "center" }}>
          {showPhoto ? <Photo src={personal.photo} theme={theme} accent={theme.accent} size="32mm" shape="square" initialsText={`${personal.firstName}${personal.lastName}`} /> : null}
          <div style={{ minWidth: 0 }}>
            <h1 style={{ margin: 0, fontSize: "32pt", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.02 }}>{fullName(personal) || "Your Name"}</h1>
            {personal.jobTitle ? <p style={{ margin: "5pt 0 0", fontSize: "11.5pt", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: theme.accent }}>{personal.jobTitle}</p> : null}
          </div>
        </header>
        <div style={{ padding: "11mm 17mm 16mm" }}>
          <div style={{ marginBottom: theme.sectionGap }}><ContactList items={contactItems(personal)} theme={theme} columns={2} /></div>
          {sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
        </div>
      </>
  );
}
