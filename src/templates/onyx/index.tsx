import { config } from "./config";
import { createTheme } from "../_kit/theme";
import { pickFont } from "../_kit/fonts";
import { contactItems, fullName, visibleSections } from "../_kit/helpers";
import { SectionBlock, type SectionStyleOptions } from "../_kit/sections";
import { Photo } from "../_kit/primitives";
import type { TemplateProps } from "../types";

export { config };

export function Template({ data }: TemplateProps) {
  const theme = createTheme(data, { font: pickFont(data.settings.font, config.fonts) });
  const personal = data.personal;
  const showPhoto = data.extra.showPhoto !== false;
  const photoShape = (data.extra.photoShape === "square" ? "square" : "circle") as "circle" | "square";
  const options: SectionStyleOptions = { titleVariant: "underline", entryLayout: "row", bulletMarker: "disc" };
  const sections = visibleSections(data);
  return (
      <>
        <header style={{ background: "#0f172a", color: "#f8fafc", padding: "14mm 16mm", display: "flex", gap: "10mm", alignItems: "center" }}>
          {showPhoto ? <Photo src={personal.photo} theme={theme} accent={theme.accent} size="30mm" shape={photoShape} initialsText={`${personal.firstName}${personal.lastName}`} /> : null}
          <div style={{ minWidth: 0 }}>
            <h1 style={{ margin: 0, fontSize: "30pt", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.02 }}>{fullName(personal) || "Your Name"}</h1>
            {personal.jobTitle ? <p style={{ margin: "5pt 0 0", fontSize: "11.5pt", fontWeight: 600, color: theme.accent }}>{personal.jobTitle}</p> : null}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4pt 14pt", marginTop: "9pt", fontSize: "8.8pt", opacity: 0.9 }}>
              {contactItems(personal).map((item) => <span key={item.key}>{item.value}</span>)}
            </div>
          </div>
        </header>
        <div style={{ padding: "12mm 16mm 16mm" }}>
          {sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
        </div>
      </>
  );
}
