import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Brush,
  Check,
  Save,
  Download,
  FileText,
  Gauge,
  LayoutTemplate,
  Lock,
  PenLine,
  Sparkles,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import {
  AuroraBackdrop,
  GridBackdrop,
  Reveal,
  SectionHeading,
} from "@/components/marketing/primitives";
import { SITE_NAME } from "@/lib/site";
import { templateCount } from "@/templates/registry";

export const metadata: Metadata = {
  title: "How it works — from blank page to PDF in three steps",
  description:
    "Pick a template, fill the smart form while watching the live A4 preview, then download a clean ATS-friendly PDF. Here is the full walkthrough.",
  alternates: { canonical: "/how-it-works" },
  openGraph: {
    title: `How it works | ${SITE_NAME}`,
    description:
      "Pick a template, fill the smart form, download a clean PDF. The complete CV Maker walkthrough.",
    url: "/how-it-works",
  },
};

const STEPS = [
  {
    icon: LayoutTemplate,
    step: "01",
    title: "Choose a template",
    lede: "Seven categories, one honest preview each.",
    body: "Filter the gallery by Modern, Creative, Minimal, Professional, Tech, Academic or Executive. Hover any card to see the layout at a glance, then open it to read what the template supports — photo, sidebar, timeline, section dividers. You are not locked in: templates can be swapped later without losing a single word.",
    bullets: [
      "Filter by category or search by keyword",
      "See photo, sidebar and density at a glance",
      "Switch templates any time from the editor",
    ],
  },
  {
    icon: PenLine,
    step: "02",
    title: "Fill the smart form",
    lede: "Only the fields your template actually uses.",
    body: "The editor reads your chosen template and shows exactly the inputs it needs. Repeatable entries for jobs, education, projects and skills can be dragged into any order. Reorder entire sections too, hide the ones a particular application does not need, and watch the A4 page on the right update on every keystroke.",
    bullets: [
      "Live A4 preview with zoom and multi-page navigation",
      "Drag-and-drop entries and sections",
      "Dropdowns for degrees, proficiency, dates and more",
      "Inline validation so nothing important is blank",
    ],
  },
  {
    icon: Download,
    step: "03",
    title: "Save and download",
    lede: "Stored in your account, exported as clean text.",
    body: "Everything auto-saves about a second and a half after you stop typing — with offline retry if the connection drops. When you are happy, download an A4 PDF with real selectable text, embedded fonts and no browser headers or footers. Come back next month, tweak a bullet, download again.",
    bullets: [
      "Debounced auto-save with a visible save status",
      "ATS-friendly, text-based PDF export",
      "Named FirstName_LastName_CV.pdf",
      "Edit forever — your CV never expires",
    ],
  },
];

const DETAILS = [
  {
    icon: Gauge,
    title: "Live preview, not a guess",
    body: "The right-hand panel is a genuine A4 page rendered with the template's real fonts and spacing, so line breaks and page counts are honest.",
  },
  {
    icon: Save,
    title: "Saves while you think",
    body: "A debounce timer writes your changes roughly 1.5 seconds after the last edit. The top bar tells you when it is saving or saved.",
  },
  {
    icon: FileText,
    title: "Template-accurate data",
    body: "Each template declares the sections and extra options it supports. Fields you cannot see right now stay saved, so switching back restores them.",
  },
  {
    icon: Brush,
    title: "Accent and typography",
    body: "Choose from hand-picked accent colours and font pairings for your template. Every combination is checked against print legibility.",
  },
  {
    icon: Lock,
    title: "Private by default",
    body: "There is no server. Your CVs and photos are stored only in this browser, so they are never uploaded, shared or visible to anyone else.",
  },
  {
    icon: Sparkles,
    title: "Sample data to start fast",
    body: "Load realistic sample content to see how a template handles a full career history, then replace it with your own details.",
  },
];

export default function HowItWorksPage() {
  const total = templateCount();

  return (
    <div className="relative overflow-hidden">
      <AuroraBackdrop className="h-[520px]" />
      <GridBackdrop />

      <section className="mx-auto max-w-7xl px-4 pt-16 pb-8 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="How it works"
            title="Three steps from blank page to interview"
            description="No design skills required, no formatting rabbit holes. CV Maker handles layout, spacing and typography so you can focus on the words."
          />
        </Reveal>
        <Reveal delay={0.08}>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/signup" size="lg">
              Start step one
              <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
            <ButtonLink href="/templates" variant="secondary" size="lg">
              Look at {total} templates
            </ButtonLink>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <ol className="space-y-6">
          {STEPS.map((step, index) => (
            <Reveal key={step.step} delay={index * 0.06}>
              <li className="glass relative overflow-hidden rounded-3xl p-7 sm:p-9">
                <div
                  className="pointer-events-none absolute -top-24 -right-16 size-64 rounded-full bg-gradient-to-br from-cyan-500/15 via-violet-500/10 to-transparent blur-3xl"
                  aria-hidden
                />
                <div className="relative grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.3fr)]">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/25 to-violet-500/25 text-cyan-300">
                        <step.icon className="size-5.5" aria-hidden />
                      </span>
                      <span className="text-xs font-semibold tracking-[0.2em] text-ink-500">
                        STEP {step.step}
                      </span>
                    </div>
                    <h2 className="mt-5 text-2xl font-bold tracking-tight">{step.title}</h2>
                    <p className="mt-2 text-sm font-medium text-cyan-300">{step.lede}</p>
                    <p className="mt-4 text-sm leading-relaxed text-ink-400 sm:text-base">
                      {step.body}
                    </p>
                  </div>

                  <ul className="grid content-start gap-3 sm:grid-cols-2">
                    {step.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-start gap-2.5 rounded-2xl border border-[var(--border-soft)] bg-white/[0.03] p-3.5 text-sm text-ink-300"
                      >
                        <BadgeCheck className="mt-0.5 size-4 shrink-0 text-cyan-300" aria-hidden />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Under the hood"
            title="The details that make it feel effortless"
            description="Small decisions that add up to an editor you do not have to fight."
          />
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DETAILS.map((detail, index) => (
            <Reveal key={detail.title} delay={(index % 3) * 0.05}>
              <div className="glass h-full rounded-2xl p-5 transition hover:border-cyan-400/40">
                <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/25 to-fuchsia-500/20 text-cyan-300">
                  <detail.icon className="size-4.5" aria-hidden />
                </span>
                <h3 className="mt-3.5 text-sm font-semibold">{detail.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-400">{detail.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <Reveal>
          <div className="glass rounded-3xl p-8 sm:p-10">
            <SectionHeading
              align="left"
              eyebrow="Checklist"
              title="Before you hit download"
              description="A quick pass that catches most avoidable mistakes."
            />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                "Contact details are correct and clickable",
                "Every role has at least two outcome-led bullets",
                "Dates are consistent (month + year everywhere)",
                "Skills match words used in the job advert",
                "No orphaned headings at the bottom of page one",
                "File named with your actual first and last name",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-ink-300">
                  <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-[var(--border-soft)] bg-gradient-to-br from-cyan-500/15 via-violet-500/15 to-fuchsia-500/15 p-10 text-center sm:p-14">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready for step one?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink-300">
              Create a free account and you will be looking at a finished A4 page within a few
              minutes.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/signup" size="lg">
                Create my free CV
                <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
              <Link
                href="/pricing"
                className="inline-flex h-12 items-center rounded-xl px-6 text-base text-ink-200 transition hover:bg-white/5"
              >
                See what it costs
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
