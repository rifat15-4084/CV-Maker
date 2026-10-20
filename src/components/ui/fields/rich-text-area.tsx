"use client";

import { useRef, useState } from "react";
import { Bold, Italic, List, ListOrdered, Underline } from "lucide-react";
import { Textarea } from "../field";
import { cn } from "@/lib/utils";

type Marker = "**" | "*" | "_";

/**
 * Lightweight rich-text editor for bullet points.
 *
 * Deliberately marker-based (`**bold**`, `*italic*`, `_underline_`) so the
 * stored value stays plain text: templates can render it with `formatInline`
 * and the exported PDF keeps real, selectable text.
 */
export function RichTextArea({
  value,
  onChange,
  placeholder,
  label,
  rows = 6,
  className,
  onBlur,
  name,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  rows?: number;
  className?: string;
  onBlur?: () => void;
  name?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [mode, setMode] = useState<"bullets" | "numbered" | "plain">("bullets");

  function wrap(marker: Marker) {
    const element = ref.current;
    if (!element) return;
    const { selectionStart, selectionEnd } = element;
    const selected = value.slice(selectionStart, selectionEnd) || "text";
    const next = `${value.slice(0, selectionStart)}${marker}${selected}${marker}${value.slice(selectionEnd)}`;
    onChange(next);
    requestAnimationFrame(() => {
      element.focus();
      element.setSelectionRange(selectionStart + marker.length, selectionStart + marker.length + selected.length);
    });
  }

  function prefixLines(prefix: (index: number) => string) {
    const element = ref.current;
    if (!element) return;
    const { selectionStart, selectionEnd } = element;
    const start = value.lastIndexOf("\n", Math.max(0, selectionStart - 1)) + 1;
    const end = value.indexOf("\n", selectionEnd) === -1 ? value.length : value.indexOf("\n", selectionEnd);
    const block = value.slice(start, end);
    const lines = block.split("\n").map((line, index) => {
      const stripped = line.replace(/^(\s*)([-•*]|\d+\.)\s+/, "$1");
      return `${prefix(index)}${stripped}`;
    });
    const next = `${value.slice(0, start)}${lines.join("\n")}${value.slice(end)}`;
    onChange(next);
    requestAnimationFrame(() => element.focus());
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        {label ? (
          <span className="text-xs font-medium text-ink-300">{label}</span>
        ) : (
          <span className="text-xs text-ink-500">Formatting</span>
        )}
        <div className="flex items-center gap-1 rounded-lg border border-[var(--border-soft)] bg-white/5 p-0.5">
          <ToolbarButton label="Bold (Ctrl+B)" onClick={() => wrap("**")}>
            <Bold className="size-3.5" aria-hidden />
          </ToolbarButton>
          <ToolbarButton label="Italic (Ctrl+I)" onClick={() => wrap("*")}>
            <Italic className="size-3.5" aria-hidden />
          </ToolbarButton>
          <ToolbarButton label="Underline" onClick={() => wrap("_")}>
            <Underline className="size-3.5" aria-hidden />
          </ToolbarButton>
          <span className="mx-0.5 h-4 w-px bg-[var(--border-soft)]" />
          <ToolbarButton
            label="Bullet list"
            active={mode === "bullets"}
            onClick={() => {
              setMode("bullets");
              prefixLines(() => "- ");
            }}
          >
            <List className="size-3.5" aria-hidden />
          </ToolbarButton>
          <ToolbarButton
            label="Numbered list"
            active={mode === "numbered"}
            onClick={() => {
              setMode("numbered");
              prefixLines((index) => `${index + 1}. `);
            }}
          >
            <ListOrdered className="size-3.5" aria-hidden />
          </ToolbarButton>
        </div>
      </div>

      <Textarea
        ref={ref}
        name={name}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        onKeyDown={(event) => {
          if (!(event.metaKey || event.ctrlKey)) return;
          if (event.key.toLowerCase() === "b") {
            event.preventDefault();
            wrap("**");
          } else if (event.key.toLowerCase() === "i") {
            event.preventDefault();
            wrap("*");
          } else if (event.key.toLowerCase() === "u") {
            event.preventDefault();
            wrap("_");
          }
        }}
      />
      <p className="text-[11px] leading-relaxed text-ink-500">
        One point per line. Start a line with <code className="text-ink-400">-</code> for a bullet.
        Use <code className="text-ink-400">**bold**</code>, <code className="text-ink-400">*italic*</code> or{" "}
        <code className="text-ink-400">_underline_</code> for emphasis — the PDF keeps this as
        selectable text.
      </p>
    </div>
  );
}

function ToolbarButton({
  label,
  onClick,
  active,
  children,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={cn(
        "rounded-md p-1.5 transition",
        active ? "bg-cyan-500/20 text-cyan-200" : "text-ink-400 hover:bg-white/10 hover:text-[var(--page-fg)]",
      )}
    >
      {children}
    </button>
  );
}

/** Splits an editor textarea value into bullet strings for the CV schema. */
export function textToBullets(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.replace(/^(\s*)([-•*]|\d+\.)\s+/, "$1").trim())
    .filter((line) => line.length > 0);
}

/** Inverse of `textToBullets` — used to seed the editor from stored data. */
export function bulletsToText(bullets: string[]): string {
  return bullets.map((bullet) => `- ${bullet}`).join("\n");
}
