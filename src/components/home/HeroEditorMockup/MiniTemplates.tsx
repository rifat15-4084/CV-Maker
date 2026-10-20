"use client";

import { memo } from "react";
import type { CSSProperties, ReactNode } from "react";
import { PLACEHOLDERS } from "./samplePeople";
import type { FieldKey } from "./samplePeople";

/* ==========================================================================
   The six miniature CV templates shown inside the preview panel.

   Each one is a fixed, hand-built structure — the point of the mockup is that
   the six designs look genuinely different, so nothing here is derived from a
   shared skeleton or a colour variable. Sizes are in raw px because the whole
   stage is scaled as a unit (see index.tsx), so px stay exact at any scale.

   Placeholders render on an empty string, and the preview re-renders on every
   keystroke, so the components are memoised on the five field values.
   ========================================================================== */

const SKELETON_WIDTHS = [92, 78, 86, 60, 72, 88, 66];

/** Grey skeleton bar; width cycles through a fixed ladder by index. */
function Bar({ i, light, style }: { i: number; light?: boolean; style?: CSSProperties }) {
  return (
    <div
      style={{
        height: 4,
        borderRadius: 2,
        background: light ? "rgba(157,180,255,.55)" : "#e3e5ec",
        margin: "4px 0",
        width: `${SKELETON_WIDTHS[i % SKELETON_WIDTHS.length]}%`,
        ...style,
      }}
    />
  );
}

function Heading({ children, color, style }: { children: ReactNode; color: string; style?: CSSProperties }) {
  return (
    <div
      style={{
        fontSize: 6.5,
        lineHeight: 1.45,
        letterSpacing: ".14em",
        fontWeight: 700,
        color,
        margin: "9px 0 4px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Pill({ children, accent }: { children: ReactNode; accent: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "1px 6px",
        borderRadius: 9,
        background: accent,
        color: "#fff",
        fontSize: 6.5,
        margin: "0 3px 3px 0",
      }}
    >
      {children}
    </span>
  );
}

const para: CSSProperties = { margin: 0, color: "#555" };

/** Empty fields render as grey placeholder text, not italic. */
function text(value: string, key: FieldKey, onDark = false) {
  if (value) return value;
  return (
    <span style={{ color: onDark ? "rgba(255,255,255,.5)" : "#c4c7d3" }}>{PLACEHOLDERS[key]}</span>
  );
}

function dark(value: string, key: FieldKey) {
  if (value) return value;
  return (
    <span style={{ color: "rgba(255,255,255,.45)" }}>{PLACEHOLDERS[key]}</span>
  );
}

export interface MiniTemplateProps {
  name: string;
  title: string;
  summary: string;
  email: string;
  phone: string;
}

/* --------------------------------- 1. Atlas ------------------------------- */
/* Dark left sidebar (38%) + light main column. */
const Atlas = memo(function Atlas({ name, title, summary, email, phone }: MiniTemplateProps) {
  const accent = "#1e2b4a";
  const side = "#9db4ff";
  return (
    <div style={{ display: "flex", height: "100%" }}>
      <div style={{ width: "38%", background: accent, color: "#fff", padding: "14px 10px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.15 }}>{dark(name, "name")}</div>
        <div style={{ fontSize: 7.5, color: side, margin: "3px 0 8px" }}>{dark(title, "title")}</div>

        <Heading color={side} style={{ margin: "0 0 4px" }}>
          CONTACT
        </Heading>
        <div style={{ fontSize: 7.5, lineHeight: 1.45 }}>{dark(email, "email")}</div>
        <div style={{ fontSize: 7.5, lineHeight: 1.45 }}>{dark(phone, "phone")}</div>

        <Heading color={side}>SKILLS</Heading>
        {[0, 1, 2, 3].map((i) => (
          <Bar key={i} i={i} light />
        ))}
      </div>

      <div style={{ flex: 1, padding: "14px 12px", background: "#fff" }}>
        <Heading color={accent} style={{ margin: "0 0 4px" }}>
          SUMMARY
        </Heading>
        <p style={para}>{text(summary, "summary")}</p>

        <Heading color={accent}>EXPERIENCE</Heading>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Bar key={i} i={i} />
        ))}

        <Heading color={accent}>EDUCATION</Heading>
        {[0, 1, 2].map((i) => (
          <Bar key={i} i={i} />
        ))}
      </div>
    </div>
  );
});

/* ----------------------------- 2. Serif Classic --------------------------- */
/* Centred Georgia masthead over a double rule, then left-aligned sections. */
const SerifClassic = memo(function SerifClassic({
  name,
  title,
  summary,
  email,
  phone,
}: MiniTemplateProps) {
  const accent = "#222";
  const contact = [email, phone].filter(Boolean).join(" · ");
  return (
    <div style={{ padding: 16, fontFamily: "Georgia, serif", textAlign: "center" }}>
      <div style={{ fontSize: 18, letterSpacing: ".04em", color: "#222" }}>{text(name, "name")}</div>
      <div style={{ fontSize: 8.5, fontStyle: "italic", color: "#666", margin: "2px 0 5px" }}>
        {text(title, "title")}
      </div>
      <div style={{ fontSize: 7, color: "#777" }}>
        {contact || (
          <span style={{ color: "#c4c7d3" }}>
            {PLACEHOLDERS.email} · {PLACEHOLDERS.phone}
          </span>
        )}
      </div>

      <div
        style={{
          borderTop: `1px solid ${accent}`,
          borderBottom: `1px solid ${accent}`,
          height: 3,
          margin: "8px 0",
        }}
      />

      <div style={{ textAlign: "left" }}>
        <Heading color={accent}>PROFILE</Heading>
        <p style={para}>{text(summary, "summary")}</p>

        <Heading color={accent}>EXPERIENCE</Heading>
        {[0, 1, 2, 3, 4].map((i) => (
          <Bar key={i} i={i} />
        ))}

        <Heading color={accent}>EDUCATION</Heading>
        {[0, 1, 2].map((i) => (
          <Bar key={i} i={i} />
        ))}
      </div>
    </div>
  );
});

/* ------------------------------ 3. Bold Block ----------------------------- */
/* Full-width accent header block, then a two-column body. */
const BoldBlock = memo(function BoldBlock({ name, title, summary, email, phone }: MiniTemplateProps) {
  const accent = "#f0476a";
  return (
    <div style={{ height: "100%", background: "#fff" }}>
      <div style={{ background: accent, color: "#fff", padding: "16px 14px" }}>
        <div style={{ fontSize: 17, fontWeight: 800, lineHeight: 1.1 }}>{dark(name, "name")}</div>
        <div style={{ fontSize: 8, marginTop: 3, opacity: 0.9 }}>{dark(title, "title")}</div>
      </div>

      <div style={{ display: "flex", gap: 10, padding: "6px 14px" }}>
        <div style={{ width: "46%" }}>
          <Heading color={accent}>ABOUT</Heading>
          <p style={para}>{text(summary, "summary")}</p>

          <Heading color={accent}>CONTACT</Heading>
          <div style={{ fontSize: 7.5, lineHeight: 1.45, color: "#555" }}>
            {text(email, "email")}
          </div>
          <div style={{ fontSize: 7.5, lineHeight: 1.45, color: "#555" }}>
            {text(phone, "phone")}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <Heading color={accent}>EXPERIENCE</Heading>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Bar key={i} i={i} />
          ))}

          <Heading color={accent}>SKILLS</Heading>
          <div>
            {["UX", "Research", "Figma"].map((s) => (
              <Pill key={s} accent={accent}>
                {s}
              </Pill>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

/* ------------------------------- 4. Timeline ------------------------------ */
/* Teal dot rail down the experience list. */
const Timeline = memo(function Timeline({ name, title, summary, email, phone }: MiniTemplateProps) {
  const accent = "#0f9d8a";
  const contact = [email, phone].filter(Boolean).join(" · ");
  return (
    <div style={{ padding: 14, background: "#fff" }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: accent }}>{text(name, "name")}</div>
      <div style={{ fontSize: 8, color: "#666", marginBottom: 3 }}>{text(title, "title")}</div>
      <div style={{ fontSize: 7, color: "#888" }}>
        {contact || (
          <span style={{ color: "#c4c7d3" }}>
            {PLACEHOLDERS.email} · {PLACEHOLDERS.phone}
          </span>
        )}
      </div>

      <Heading color={accent}>SUMMARY</Heading>
      <p style={para}>{text(summary, "summary")}</p>

      <Heading color={accent}>EXPERIENCE</Heading>
      <div style={{ borderLeft: `1.5px solid ${accent}`, marginLeft: 3, paddingLeft: 9 }}>
        {[0, 1, 2].map((entry) => (
          <div key={entry} style={{ position: "relative", marginBottom: 5 }}>
            <span
              style={{
                position: "absolute",
                left: -13.5,
                top: 1,
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: accent,
              }}
            />
            <Bar i={entry * 2} style={{ marginTop: 0 }} />
            <Bar i={entry * 2 + 1} style={{ marginBottom: 0 }} />
          </div>
        ))}
      </div>
    </div>
  );
});

/* ----------------------------- 5. Minimal Mono ---------------------------- */
/* Monospace, shell-style headings. */
const MinimalMono = memo(function MinimalMono({
  name,
  title,
  summary,
  email,
  phone,
}: MiniTemplateProps) {
  const accent = "#111";
  const mono = 'ui-monospace, Menlo, Consolas, "Courier New", monospace';
  return (
    <div style={{ padding: 14, fontFamily: mono, fontSize: 7, background: "#fff" }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#111" }}>{text(name, "name")}</div>
      <div style={{ color: "#666" }}>
        $ {title || <span style={{ color: "#c4c7d3" }}>{PLACEHOLDERS.title}</span>}
      </div>

      <div style={{ borderTop: "1px dashed #bbb", margin: "7px 0" }} />

      <Heading color={accent}># ABOUT</Heading>
      <p style={{ ...para, fontFamily: mono, fontSize: 7 }}>{text(summary, "summary")}</p>

      <Heading color={accent}># CONTACT</Heading>
      <div style={{ color: "#555" }}>{text(email, "email")}</div>
      <div style={{ color: "#555" }}>{text(phone, "phone")}</div>

      <Heading color={accent}># EXPERIENCE</Heading>
      {[0, 1, 2, 3].map((i) => (
        <Bar key={i} i={i} />
      ))}
    </div>
  );
});

/* -------------------------- 6. Creative Gradient -------------------------- */
/* Violet→pink gradient band with an initials roundel. */
const CreativeGradient = memo(function CreativeGradient({
  name,
  title,
  summary,
  email,
  phone,
}: MiniTemplateProps) {
  const accent = "#7c5cff";
  const contact = [email, phone].filter(Boolean).join(" · ");
  const initials =
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "CV";

  return (
    <div style={{ height: "100%", background: "#fff" }}>
      <div
        style={{
          background: "linear-gradient(120deg,#7c5cff,#ff7ac6)",
          padding: 14,
          display: "flex",
          gap: 10,
          color: "#fff",
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: "rgba(255,255,255,.25)",
            border: "2px solid #fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {initials}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>{dark(name, "name")}</div>
          <div style={{ fontSize: 7.5, opacity: 0.9 }}>{dark(title, "title")}</div>
        </div>
      </div>

      <div style={{ padding: "6px 14px" }}>
        <Heading color={accent}>ABOUT ME</Heading>
        <p style={para}>{text(summary, "summary")}</p>

        <Heading color={accent}>CONTACT</Heading>
        <div style={{ fontSize: 7.5, lineHeight: 1.45, color: "#555" }}>
          {contact || (
            <span style={{ color: "#c4c7d3" }}>
              {PLACEHOLDERS.email} · {PLACEHOLDERS.phone}
            </span>
          )}
        </div>

        <Heading color={accent}>SKILLS</Heading>
        <div>
          {["Design", "Strategy", "Writing", "Tools"].map((s) => (
            <Pill key={s} accent={accent}>
              {s}
            </Pill>
          ))}
        </div>

        <Heading color={accent}>EXPERIENCE</Heading>
        {[0, 1, 2].map((i) => (
          <Bar key={i} i={i} />
        ))}
      </div>
    </div>
  );
});

/* -------------------------------------------------------------------------- */

export interface MiniTemplate {
  name: string;
  Component: React.ComponentType<MiniTemplateProps>;
}

/** Exactly the order the demo cycles through. */
export const MINI_TEMPLATES: MiniTemplate[] = [
  { name: "Atlas", Component: Atlas },
  { name: "Serif Classic", Component: SerifClassic },
  { name: "Bold Block", Component: BoldBlock },
  { name: "Timeline", Component: Timeline },
  { name: "Minimal Mono", Component: MinimalMono },
  { name: "Creative Gradient", Component: CreativeGradient },
];
