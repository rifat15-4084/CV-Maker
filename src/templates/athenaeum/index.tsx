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
  const photoShape = (data.extra.photoShape === "square" ? "square" : "circle") as "circle" | "square";
  const options: SectionStyleOptions = { titleVariant: "underline", entryLayout: "row", bulletMarker: "disc" };
  const sections = visibleSections(data);
  return (
      <div style={{ padding: "16mm 19mm" }}>
        <header style={{ display: "flex", gap: "9mm", alignItems: "center", marginBottom: theme.sectionGap }}>
          {showPhoto ? <Photo src={personal.photo} theme={theme} size="30mm" shape={photoShape} initialsText={`${personal.firstName}${personal.lastName}`} /> : null}
          <div style={{ minWidth: 0 }}>
            <h1 style={{ margin: 0, fontFamily: theme.headingFont, fontSize: "27pt", fontWeight: 700 }}>{fullName(personal) || "Your Name"}</h1>
            {personal.jobTitle ? <p style={{ margin: "4pt 0 0", fontSize: "10.5pt", color: theme.accentDark }}>{personal.jobTitle}</p> : null}
            <div style={{ marginTop: "7pt" }}><ContactList items={contactItems(personal)} theme={theme} /></div>
          </div>
        </header>
        {sections.map((section) => <SectionBlock key={section} data={data} section={section} theme={theme} options={options} />)}
      </div>
  );
}
