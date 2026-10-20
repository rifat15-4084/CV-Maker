"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTypingDemo } from "./useTypingDemo";
import { MINI_TEMPLATES } from "./MiniTemplates";
import { PLACEHOLDERS } from "./samplePeople";
import type { FieldKey } from "./samplePeople";

/* ==========================================================================
   Hero editor mockup.

   A fixed 682x561 "stage" that is scaled as a single unit, so every internal
   measurement below can stay in raw px and still land exactly where intended
   at any viewport width. Nothing inside is responsive on purpose — the design
   size is the design.

   The mockup is decorative: it is aria-hidden and contains no real inputs.
   ========================================================================== */

const STAGE_W = 682;
const STAGE_H = 561;

/* ------------------------------- styling bits ----------------------------- */

const LABEL: React.CSSProperties = {
  fontSize: 9,
  color: "#8a8aa8",
  letterSpacing: ".03em",
  marginBottom: 4,
};

const INPUT: React.CSSProperties = {
  height: 26,
  background: "#34344d",
  borderRadius: 8,
  padding: "0 9px",
  fontSize: 10.5,
  lineHeight: "26px",
  color: "#e8e8f5",
  whiteSpace: "nowrap",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
};

const ACTIVE_SHADOW = "0 0 0 1.5px #8a7bff, 0 0 14px rgba(138,123,255,.35)";

function Caret() {
  return (
    <>
      <style>{`@keyframes cv-caret{0%,50%{opacity:1}50.01%,100%{opacity:0}}`}</style>
      <span
        style={{
          display: "inline-block",
          width: 1.5,
          height: 12,
          background: "#cfc9ff",
          marginLeft: 1,
          verticalAlign: "middle",
          animation: "cv-caret 1s steps(1) infinite",
        }}
      />
    </>
  );
}

/** A decorative form row: label above a fake input that shows typed text. */
function FakeField({
  id,
  label,
  value,
  placeholder,
  active,
  multiline,
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  active: boolean;
  multiline?: boolean;
}) {
  const empty = value.length === 0;
  const body = empty ? <span style={{ color: "#c4c7d3" }}>{placeholder}</span> : value;

  return (
    <div>
      <div style={LABEL}>{label}</div>
      {multiline ? (
        <div
          style={{
            ...INPUT,
            height: 64,
            paddingTop: 7,
            lineHeight: 1.45,
            alignItems: "flex-start",
            whiteSpace: "normal",
            overflow: "hidden",
            boxShadow: active ? ACTIVE_SHADOW : undefined,
          }}
        >
          <span>
            {body}
            {active && <Caret />}
          </span>
        </div>
      ) : (
        <div
          style={{
            ...INPUT,
            boxShadow: active ? ACTIVE_SHADOW : undefined,
          }}
        >
          {body}
          {active && <Caret />}
        </div>
      )}
      <span id={`${id}-end`} hidden />
    </div>
  );
}

/* --------------------------------- badges --------------------------------- */

const BADGE: React.CSSProperties = {
  position: "absolute",
  background: "#171730",
  border: "1px solid #33335a",
  borderRadius: 16,
  boxShadow: "0 14px 40px rgba(0,0,0,.45)",
  backdropFilter: "blur(8px)",
};

function BadgeLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 9, letterSpacing: ".08em", fontWeight: 600, color: "#a5a5c4" }}>
      {children}
    </div>
  );
}

/* ------------------------------ mockup proper ----------------------------- */

export function HeroEditorMockup() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [visible, setVisible] = useState(true);

  const { fields, activeField, templateIndex, swapKey } = useTypingDemo(visible);

  // Fit the stage to the available width. Measured from the wrapper, not the
  // viewport, so it behaves correctly inside the hero's grid column.
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const measure = () => {
      const width = el.clientWidth;
      if (width > 0) setScale(Math.min(1, (width - 24) / STAGE_W));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Pause the loop when the mockup is off screen.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        // setTimeout(0): react-hooks/set-state-in-effect rejects synchronous
        // setState in an effect, including from a callback body.
        setTimeout(() => setVisible(entry.isIntersecting), 0);
      },
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const template = MINI_TEMPLATES[templateIndex] ?? MINI_TEMPLATES[0];
  const Template = template.Component;
  const activeByName: FieldKey | null = activeField;

  const fileBase = fields.name.trim().replace(/\s+/g, "_");

  return (
    <div
      ref={wrapperRef}
      data-hero-mockup=""
      style={{ width: "100%", height: STAGE_H * scale, position: "relative", overflow: "hidden" }}
      aria-hidden="true"
    >
      <div
        ref={stageRef}
        style={{
          width: STAGE_W,
          height: STAGE_H,
          position: "absolute",
          top: 0,
          left: 0,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          fontFamily: "var(--font-app-sans), system-ui, sans-serif",
          color: "#e8e8f5",
          background:
            "radial-gradient(60% 50% at 80% 10%, rgba(120,60,200,.45), transparent 70%), linear-gradient(#0c0c1d, #12102a)",
          borderRadius: 22,
          overflow: "hidden",
        }}
      >
        {/* Fixed 40px grid overlay. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            pointerEvents: "none",
          }}
        />

        {/* ------------------------------ window ----------------------------- */}
        <div
          style={{
            position: "absolute",
            left: 62,
            top: 92,
            width: 564,
            height: 388,
            background: "#14142a",
            border: "1px solid #2a2a45",
            borderRadius: 18,
            boxShadow: "0 30px 80px rgba(0,0,0,.45)",
          }}
        >
          {/* title bar */}
          <div
            style={{
              height: 44,
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "0 16px",
              borderBottom: "1px solid #2a2a45",
              fontSize: 12,
              color: "#b4b4cf",
            }}
          >
            {["#b8566a", "#c9a227", "#4fb07a"].map((c) => (
              <span
                key={c}
                style={{ width: 11, height: 11, borderRadius: "50%", background: c, flexShrink: 0 }}
              />
            ))}
            <span style={{ marginLeft: 10 }}>cvmaker.app/editor — {template.name}</span>
          </div>

          {/* form panel */}
          <div
            style={{
              position: "absolute",
              left: 16,
              top: 60,
              width: 266,
              height: 272,
              background: "#1b1b33",
              borderRadius: 16,
              padding: 12,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxSizing: "border-box",
            }}
          >
            <FakeField
              id="hero-name"
              label="Full name"
              value={fields.name}
              placeholder={PLACEHOLDERS.name}
              active={activeByName === "name"}
            />
            <FakeField
              id="hero-title"
              label="Job title"
              value={fields.title}
              placeholder={PLACEHOLDERS.title}
              active={activeByName === "title"}
            />
            <FakeField
              id="hero-summary"
              label="Summary"
              value={fields.summary}
              placeholder={PLACEHOLDERS.summary}
              active={activeByName === "summary"}
              multiline
            />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <FakeField
                id="hero-email"
                label="Email"
                value={fields.email}
                placeholder={PLACEHOLDERS.email}
                active={activeByName === "email"}
              />
              <FakeField
                id="hero-phone"
                label="Phone"
                value={fields.phone}
                placeholder={PLACEHOLDERS.phone}
                active={activeByName === "phone"}
              />
            </div>
          </div>

          {/* preview panel */}
          <div
            style={{
              position: "absolute",
              left: 295,
              top: 60,
              width: 253,
              height: 272,
              background: "#fff",
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: "0 0 0 1px rgba(255,255,255,.06)",
              fontSize: 7.5,
              lineHeight: 1.45,
              color: "#222",
            }}
          >
            {/* Swap only on template/person change: keyed by swapKey. */}
            <motion.div
              key={swapKey}
              initial={{ opacity: 0, y: 10, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
              style={{ height: "100%" }}
            >
              <Template {...fields} />
            </motion.div>
          </div>

          {/* footer */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 40,
              borderTop: "1px solid #2a2a45",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              padding: "0 22px",
              fontSize: 11,
              color: "#8a8aa8",
              boxSizing: "border-box",
            }}
          >
            Live preview · {template.name}
          </div>
        </div>

        {/* ------------------------------ badges ----------------------------- */}
        <div style={{ ...BADGE, left: 543, top: 71, width: 95, height: 83, padding: "14px 16px", boxSizing: "border-box" }}>
          <BadgeLabel>TEMPLATES</BadgeLabel>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              marginTop: 6,
              background: "linear-gradient(90deg,#8ad7ff,#a58bff)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
            }}
          >
            60
          </div>
        </div>

        <div style={{ ...BADGE, left: 46, top: 430, width: 181, height: 75, padding: "13px 16px", boxSizing: "border-box" }}>
          <BadgeLabel>EXPORT</BadgeLabel>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              margin: "5px 0 2px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {fileBase ? `${fileBase}_CV.pdf` : "Your_Name_CV.pdf"}
          </div>
          <div style={{ fontSize: 10, color: "#7be0a8" }}>ATS-friendly · selectable text</div>
        </div>
      </div>
    </div>
  );
}
