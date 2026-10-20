import { config } from "./config";
import { createTheme } from "../_kit/theme";
import { pickFont } from "../_kit/fonts";
import { fullName, visibleSections } from "../_kit/helpers";
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
        <div style={{ background: theme.accent, color: theme.accentText, padding: "16mm 15mm", display: "flex", gap: "10mm", alignItems: "center" }}>
          {showPhoto ? <Photo src={personal.photo} theme={theme} accent="rgba(255,255,255,0.92)" size="34mm" shape={photoShape} initialsText={`${personal.firstName}${personal.lastName}`} /> : null}
          <div>
            <h1 style={{ margin: 0, fontSize: "40pt", fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.98 }}>{fullName(personal) || "Your Name"}</h1>
            {personal.jobTitle ? <p style={{ margin: "6pt 0 0", fontSize: "12pt", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" }}>{personal.jobTitle}</p> : null}
          </div>
        </div>
        <div style={{ padding: "12mm 15mm 15mm" }}>
          {sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
        </div>
      </>
  );
}
