"use client";

import { useEffect, useRef, useState } from "react";
import {
  EMPTY_FIELDS,
  FIELD_ORDER,
  SAMPLE_PEOPLE,
  TYPE_BASE,
} from "./samplePeople";
import type { FieldKey } from "./samplePeople";
import { MINI_TEMPLATES } from "./MiniTemplates";

export interface TypingDemoState {
  fields: Record<FieldKey, string>;
  /** Field currently being typed — gets the glow + caret. */
  activeField: FieldKey | null;
  /** Index into MINI_TEMPLATES. */
  templateIndex: number;
  /** Index into SAMPLE_PEOPLE. */
  personIndex: number;
  /** Increments whenever the preview should replay its swap animation. */
  swapKey: number;
}

const INITIAL: TypingDemoState = {
  fields: { ...EMPTY_FIELDS },
  activeField: null,
  templateIndex: 0,
  personIndex: 0,
  swapKey: 0,
};

const WAIT_AFTER_FIELD = 250;
const WAIT_AFTER_PERSON = 1400;
const WAIT_AFTER_SWAP = 2300;
const WAIT_BEFORE_TYPING = 600;
const SWAPS_BEFORE_NEXT_PERSON = 3;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Drives the hero mockup's typing loop.
 *
 * Design notes:
 * - One async loop with a cancel token, so a re-render or a Strict Mode
 *   double-effect can never leave two loops typing into the same state.
 * - Nothing starts until `useEffect`, so the server-rendered HTML and the first
 *   client render agree (no hydration mismatch).
 * - The loop waits on `gate` while the tab is hidden or the mockup is off
 *   screen, so it doesn't burn timers in a background tab.
 * - Reduced motion short-circuits to a static, fully typed first person on
 *   Atlas — no typing, no swapping, no caret.
 */
export function useTypingDemo(active: boolean) {
  const [state, setState] = useState<TypingDemoState>(INITIAL);
  const activeRef = useRef(active);

  // Kept in a ref so the running loop reads the current value without the
  // effect (and therefore the loop) restarting on every visibility change.
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    if (prefersReducedMotion()) {
      const person = SAMPLE_PEOPLE[0];
      // setTimeout(0) rather than a bare setState: the lint rule
      // react-hooks/set-state-in-effect rejects synchronous setState here.
      const id = setTimeout(() => {
        setState({
          fields: {
            name: person.name,
            title: person.title,
            summary: person.summary,
            email: person.email,
            phone: person.phone,
          },
          activeField: null,
          templateIndex: 0,
          personIndex: 0,
          swapKey: 0,
        });
      }, 0);
      return () => clearTimeout(id);
    }

    let cancelled = false;

    const settle = (ms: number) =>
      new Promise<void>((resolve) => {
        let remaining = ms;
        let last = Date.now();
        const tick = () => {
          if (cancelled) return resolve();
          const now = Date.now();
          // Only count time while we're actually allowed to run.
          if (activeRef.current) remaining -= now - last;
          last = now;
          if (remaining <= 0) resolve();
          else setTimeout(tick, 40);
        };
        setTimeout(tick, 40);
      });

    const hasFocus = () => typeof document === "undefined" || !document.hidden;

    (async () => {
      let person = 0;
      let template = 0;

      for (;;) {
        if (cancelled) return;
        if (MINI_TEMPLATES.length === 0 || SAMPLE_PEOPLE.length === 0) return;

        const p = SAMPLE_PEOPLE[person];

        // 1. Clear every field and show placeholders, then swap in.
        setState((s) => ({
          fields: { ...EMPTY_FIELDS },
          activeField: null,
          templateIndex: template,
          personIndex: person,
          swapKey: s.swapKey + 1,
        }));
        await settle(WAIT_BEFORE_TYPING);
        if (cancelled) return;

        // 2. Type each field one character at a time.
        for (const field of FIELD_ORDER) {
          setState((s) => ({ ...s, activeField: field }));
          const target = p[field];

          for (let i = 1; i <= target.length; i++) {
            if (cancelled) return;
            if (!hasFocus()) await settle(120);
            if (cancelled) return;
            const value = target.slice(0, i);
            setState((s) => ({ ...s, fields: { ...s.fields, [field]: value } }));
            await settle(TYPE_BASE[field] + Math.random() * 25);
          }

          await settle(WAIT_AFTER_FIELD);
          if (cancelled) return;
        }

        // 3. Done typing: drop the caret and let the finished CV sit.
        setState((s) => ({ ...s, activeField: null }));
        await settle(WAIT_AFTER_PERSON);
        if (cancelled) return;

        // 4. Cycle through the other templates with the data left in place.
        for (let n = 0; n < SWAPS_BEFORE_NEXT_PERSON; n++) {
          template = (template + 1) % MINI_TEMPLATES.length;
          setState((s) => ({ ...s, templateIndex: template, swapKey: s.swapKey + 1 }));
          await settle(WAIT_AFTER_SWAP);
          if (cancelled) return;
        }

        // 5. One more advance lands on the next person's starting template.
        template = (template + 1) % MINI_TEMPLATES.length;
        person = (person + 1) % SAMPLE_PEOPLE.length;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
