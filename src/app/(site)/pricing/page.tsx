import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Minus, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Accordion } from "@/components/marketing/accordion";
import {
  AuroraBackdrop,
  GridBackdrop,
  Reveal,
  SectionHeading,
} from "@/components/marketing/primitives";
import { SUPPORT_EMAIL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing — free forever, no card required",
  description:
    "CV Maker is free: all templates, unlimited CVs, live preview, saving in your browser and PDF downloads. No credit card, no trial, no watermark.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: `Pricing | ${SITE_NAME}`,
    description:
      "All templates, unlimited CVs, live preview, saving in your browser and PDF downloads — free, with no card required.",
    url: "/pricing",
  },
};

const INCLUDED = [
  "All 60 templates across 7 categories",
  "Unlimited CVs, kept in your own browser",
  "Live A4 preview with zoom and page navigation",
  "Automatic saving in your browser with offline retry",
  "Drag-and-drop ordering for entries and sections",
  "Accent colour and font selection per template",
  "Photo upload with cropping",
  "ATS-friendly PDF downloads with selectable text",
  "Sample data, reset, and JSON import/export",
  "Section show/hide and reordering",
  "Private storage — nothing leaves your device",
  "No watermarks, no per-download fees",
];

const NOT_INCLUDED = [
  "Cover letters (use a plain document for now)",
  "Multiple CV versions side by side",
  "Team or recruiter seats",
];

const PLANS = [
  {
    name: "Free",
    price: "£0",
    cadence: "forever",
    description: "Everything you need to apply for a job with confidence.",
    highlight: true,
    cta: "Create my free account",
    href: "/signup",
    features: INCLUDED,
  },
  {
    name: "Pro",
    price: "Coming soon",
    cadence: "",
    description:
      "For power users who want versioning, cover letters and shareable links. The Free plan stays free.",
    highlight: false,
    cta: "Tell us what you need",
    href: "/contact",
    features: [
      "Everything in Free",
      "Multiple tailored versions of one CV",
      "Cover letter builder",
      "Shareable read-only links",
      "Priority email support",
    ],
  },
];

const PRICING_FAQ = [
  {
    question: "Is the Free plan really free?",
    answer:
      "Yes. There is no trial period, no card required and no feature gate on downloading your PDF. You only need an account so your CV is stored safely and you can come back to edit it.",
  },
  {
    question: "Do you put a watermark on the PDF?",
    answer:
      "No. Downloads are clean A4 pages with your content only — no watermarks, no branding, no browser headers or footers.",
  },
  {
    question: "How many CVs can I create?",
    answer:
      "As many as you like. Keep one master CV and tailor copies for specific roles — each one is stored separately in your account.",
  },
  {
    question: "What happens if I stop using CV Maker?",
    answer:
      "Your CVs stay in your account until you delete them. Download the PDFs any time, and export the raw data as JSON if you ever want to take it elsewhere.",
  },
  {
    question: "Will there be a paid plan?",
    answer:
      "A Pro plan is planned for versioning, cover letters and shareable links. The features you have today will remain available free.",
  },
];

export default function PricingPage() {
  return (
    <div className="relative overflow-hidden">
      <AuroraBackdrop className="h-[520px]" />
      <GridBackdrop />

      <section className="mx-auto max-w-7xl px-4 pt-16 pb-8 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Pricing"
            title="Free, and honest about it"
            description="No trial countdowns, no locked templates, no surprise charge when you download. CV Maker exists to get you interviews, not to nickel-and-dime you."
          />
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {PLANS.map((plan, index) => (
            <Reveal key={plan.name} delay={index * 0.08}>
              <div
                className={
                  plan.highlight
                    ? "neon-border relative h-full overflow-hidden rounded-3xl p-7 sm:p-9"
                    : "glass relative h-full rounded-3xl p-7 sm:p-9"
                }
              >
                {plan.highlight ? (
                  <span className="absolute top-6 right-6 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 px-3 py-1 text-xs font-semibold text-white">
                    <Sparkles className="size-3.5" aria-hidden />
                    Most popular
                  </span>
                ) : null}
                <h2 className="text-lg font-semibold">{plan.name}</h2>
                <p className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gradient">{plan.price}</span>
                  {plan.cadence ? (
                    <span className="text-sm text-ink-500">{plan.cadence}</span>
                  ) : null}
                </p>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-400">
                  {plan.description}
                </p>
                <ButtonLink
                  href={plan.href}
                  size="lg"
                  variant={plan.highlight ? "primary" : "secondary"}
                  className="mt-6 w-full sm:w-auto"
                >
                  {plan.cta}
                  <ArrowRight className="size-4" aria-hidden />
                </ButtonLink>
                <ul className="mt-7 space-y-2.5 border-t border-[var(--border-soft)] pt-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-ink-300">
                      <Check
                        className={
                          plan.highlight ? "mt-0.5 size-4 shrink-0 text-cyan-300" : "mt-0.5 size-4 shrink-0 text-emerald-400"
                        }
                        aria-hidden
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
                {plan.highlight ? (
                  <div className="mt-7 border-t border-[var(--border-soft)] pt-5">
                    <p className="text-xs font-semibold tracking-widest text-ink-500 uppercase">
                      Not included
                    </p>
                    <ul className="mt-3 space-y-2.5">
                      {NOT_INCLUDED.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2.5 text-sm text-ink-500"
                        >
                          <Minus className="mt-0.5 size-4 shrink-0" aria-hidden />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Reveal>
          <div className="glass rounded-3xl p-8 sm:p-10">
            <SectionHeading
              align="left"
              eyebrow="Comparison"
              title="What is in every account"
              description="Every item below is included on the Free plan, for every user, from day one."
            />
            <div className="mt-8 grid gap-2.5 sm:grid-cols-2">
              {INCLUDED.map((feature) => (
                <div
                  key={feature}
                  className="flex items-start gap-2.5 rounded-2xl border border-[var(--border-soft)] bg-white/[0.03] p-3.5 text-sm text-ink-300"
                >
                  <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" aria-hidden />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Pricing FAQ"
            title="Questions about cost, answered plainly"
          />
        </Reveal>
        <Reveal delay={0.06}>
          <Accordion items={PRICING_FAQ} className="mt-10" />
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-8 text-center text-sm text-ink-400">
            Still unsure?{" "}
            <Link href="/contact" className="text-cyan-300 hover:underline">
              Ask us directly
            </Link>{" "}
            or email{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-cyan-300 hover:underline">
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-[var(--border-soft)] bg-gradient-to-br from-cyan-500/15 via-violet-500/15 to-fuchsia-500/15 p-10 text-center sm:p-14">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Start at £0, stay at £0
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink-300">
              Make an account, build the CV, download the PDF. No card, no trial, no catch.
            </p>
            <div className="mt-8 flex justify-center">
              <ButtonLink href="/signup" size="lg">
                Create my free CV
                <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
