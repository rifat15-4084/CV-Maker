import type { ReactNode } from "react";
import { Reveal } from "@/components/marketing/primitives";
import { cn } from "@/lib/utils";
import type { LegalSection } from "@/lib/content/legal";

/**
 * Shared long-form document layout for legal pages: a sticky contents list
 * and readable prose sections with anchor headings.
 */
export function LegalDocument({
  title,
  eyebrow,
  intro,
  updatedLabel,
  sections,
  footer,
}: {
  title: string;
  eyebrow: string;
  intro: ReactNode;
  updatedLabel: string;
  sections: LegalSection[];
  footer?: ReactNode;
}) {
  const slug = (heading: string) =>
    heading
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <Reveal>
        <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium tracking-wide text-cyan-300 uppercase">
          {eyebrow}
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-400 sm:text-base">{intro}</p>
        <p className="mt-4 text-xs tracking-wide text-ink-500 uppercase">
          Last updated {updatedLabel}
        </p>
      </Reveal>

      <div className="mt-12 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav aria-label="On this page" className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-xs font-semibold tracking-widest text-ink-500 uppercase">Contents</p>
          <ol className="mt-3 space-y-1.5">
            {sections.map((section, index) => (
              <li key={section.heading}>
                <a
                  href={`#${slug(section.heading)}`}
                  className="flex gap-2 rounded-lg px-2 py-1.5 text-sm text-ink-400 transition hover:bg-white/5 hover:text-cyan-300"
                >
                  <span className="text-ink-600">{index + 1}.</span>
                  {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-10">
          {sections.map((section) => (
            <section
              key={section.heading}
              id={slug(section.heading)}
              className="scroll-mt-28"
            >
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                {section.heading}
              </h2>
              {section.paragraphs?.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className={cn("mt-3 text-sm leading-relaxed text-ink-400 sm:text-base")}
                >
                  {paragraph}
                </p>
              ))}
              {section.bullets ? (
                <ul className="mt-4 space-y-2">
                  {section.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex gap-3 text-sm leading-relaxed text-ink-400 sm:text-base"
                    >
                      <span
                        aria-hidden
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-cyan-400/70"
                      />
                      {bullet}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}

          {footer ? (
            <div className="glass rounded-3xl p-6 sm:p-8">{footer}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
