"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTypingDemo } from "./useTypingDemo";
import { MINI_TEMPLATES } from "./MiniTemplates";
import { PLACEHOLDERS } from "./samplePeople";
import type { FieldKey } from "./samplePeople";

/* ==========================================================================
   Hero editor mockup (fluid).

   Transparent, fills its parent with aspect-ratio preserving the original
   682x561 proportions. All internal sizes are scaled via container query
   units so the mockup remains legible at any width without horizontal overflow.
   ========================================================================== */

const ASPECT_W = 682;
const ASPECT_H = 561;

const ACTIVE_SHADOW = "0 0 0 1.5px #8a7bff, 0 0 14px rgba(138,123,255,.35)";

function Caret() {
  return (
    <>
      <style>{`@keyframes cv-caret{0%,50%{opacity:1}50.01%,100%{opacity:0}}`}</style>
      <span
        style={{
          display: "inline-block",
          width: "0.22cqw",
          height: "1.76cqw",
          background: "#cfc9ff",
          marginLeft: "0.15cqw",
          verticalAlign: "middle",
          animation: "cv-caret 1s steps(1) infinite",
        }}
      />
    </>
  );
}

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

  const labelStyle: React.CSSProperties = {
    fontSize: "1.32cqw",
    color: "#8a8aa8",
    letterSpacing: ".03em",
    marginBottom: "0.59cqw",
  };

  const inputBase: React.CSSProperties = {
    height: "3.81cqw",
    background: "#34344d",
    borderRadius: "1.17cqw",
    padding: "0 1.32cqw",
    fontSize: "1.54cqw",
    lineHeight: "3.81cqw",
    color: "#e8e8f5",
    whiteSpace: "nowrap",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
  };

  return (
    <div>
      <div style={labelStyle}>{label}</div>
      {multiline ? (
        <div
          style={{
            ...inputBase,
            height: "9.38cqw",
            paddingTop: "1.03cqw",
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
            ...inputBase,
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

const BADGE: React.CSSProperties = {
  position: "absolute",
  background: "#171730",
  border: "1px solid #33335a",
  borderRadius: "2.35cqw",
  boxShadow: "0 2.05cqw 5.87cqw rgba(0,0,0,.45)",
  backdropFilter: "blur(1.17cqw)",
  boxSizing: "border-box",
  maxWidth: "calc(100% - 2cqw)",
};

function BadgeLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: "1.32cqw", letterSpacing: ".08em", fontWeight: 600, color: "#a5a5c4" }}>
      {children}
    </div>
  );
}

export function HeroEditorMockup() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  const { fields, activeField, templateIndex, swapKey } = useTypingDemo(visible);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
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
      ref={rootRef}
      data-hero-mockup=""
      style={{
        width: "100%",
        maxWidth: 640,
        height: "auto",
        position: "relative",
        containerType: "inline-size",
        containerName: "hero-mockup",
      }}
      aria-hidden="true"
    >
      <div
        ref={stageRef}
        style={{
          width: "100%",
          aspectRatio: `${ASPECT_W} / ${ASPECT_H}`,
          position: "relative",
          fontFamily: "var(--font-app-sans), system-ui, sans-serif",
          color: "#e8e8f5",
          overflow: "visible",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            fontSize: "1.1cqw",
            lineHeight: 1.45,
            color: "#e8e8f5",
          }}
        >
          {/* browser window */}
          <div
            style={{
              position: "absolute",
              left: "9.09cqw",
              top: "16.4cqw",
              width: "82.7cqw",
              height: "69.16cqw",
              background: "#14142a",
              border: "0.15cqw solid #2a2a45",
              borderRadius: "2.64cqw",
              boxShadow: "0 4.4cqw 11.73cqw rgba(0,0,0,.45)",
              boxSizing: "border-box",
            }}
          >
            {/* title bar */}
            <div
              style={{
                height: "6.45cqw",
                display: "flex",
                alignItems: "center",
                gap: "1.03cqw",
                padding: "0 2.35cqw",
                borderBottom: "0.15cqw solid #2a2a45",
                fontSize: "1.76cqw",
                color: "#b4b4cf",
                boxSizing: "border-box",
              }}
            >
              {["#b8566a", "#c9a227", "#4fb07a"].map((c) => (
                <span
                  key={c}
                  style={{
                    width: "1.61cqw",
                    height: "1.61cqw",
                    borderRadius: "50%",
                    background: c,
                    flexShrink: 0,
                  }}
                />
              ))}
              <span style={{ marginLeft: "1.47cqw" }}>cvmaker.app/editor — {template.name}</span>
            </div>

            {/* form panel */}
            <div
              style={{
                position: "absolute",
                left: "2.35cqw",
                top: "8.8cqw",
                width: "38.97cqw",
                height: "39.89cqw",
                background: "#1b1b33",
                borderRadius: "2.35cqw",
                padding: "1.76cqw",
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
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.17cqw" }}>
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
                left: "43.26cqw",
                top: "8.8cqw",
                width: "37.1cqw",
                height: "39.89cqw",
                background: "#fff",
                borderRadius: "2.93cqw",
                overflow: "hidden",
                boxShadow: "0 0 0 0.15cqw rgba(255,255,255,.06)",
                fontSize: "1.1cqw",
                lineHeight: 1.45,
                color: "#222",
                boxSizing: "border-box",
              }}
            >
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
                height: "5.87cqw",
                borderTop: "0.15cqw solid #2a2a45",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                padding: "0 3.23cqw",
                fontSize: "1.61cqw",
                color: "#8a8aa8",
                boxSizing: "border-box",
              }}
            >
              Live preview · {template.name}
            </div>
          </div>

          {/* badges - positioned relative to browser window with percentage offsets */}
          <div
            style={{
              ...BADGE,
              left: "max(calc(9.09cqw + 82.7cqw - 13.93cqw), 1cqw)",
              top: "max(calc(16.4cqw - 12.17cqw), 0.5cqw)",
              width: "13.93cqw",
              height: "12.17cqw",
              padding: "2.05cqw 2.35cqw",
            }}
          >
            <BadgeLabel>TEMPLATES</BadgeLabel>
            <div
              style={{
                fontSize: "3.23cqw",
                fontWeight: 700,
                marginTop: "0.88cqw",
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

          <div
            style={{
              ...BADGE,
              left: "max(calc(9.09cqw - 26.54cqw), 0.5cqw)",
              top: "min(calc(16.4cqw + 69.16cqw - 10.99cqw), calc(100% - 10.99cqw - 0.5cqw))",
              width: "26.54cqw",
              height: "10.99cqw",
              padding: "1.91cqw 2.35cqw",
            }}
          >
            <BadgeLabel>EXPORT</BadgeLabel>
            <div
              style={{
                fontSize: "2.05cqw",
                fontWeight: 700,
                margin: "0.73cqw 0 0.29cqw",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {fileBase ? `${fileBase}_CV.pdf` : "Your_Name_CV.pdf"}
            </div>
            <div style={{ fontSize: "1.47cqw", color: "#7be0a8" }}>ATS-friendly · selectable text</div>
          </div>
        </div>
      </div>
    </div>
  );
}
