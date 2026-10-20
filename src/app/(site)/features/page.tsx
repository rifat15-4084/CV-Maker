import type { Metadata } from "next";
import Link from "next/link";
import {
  Accessibility,
  ArrowRight,
  CloudUpload,
  Code2,
  Download,
  FileSearch,
  Gauge,
  HardDrive,
  Image as ImageIcon,
  KeyRound,
  Languages,
  LayoutTemplate,
  ListChecks,
  Lock,
  MoveVertical,
  Palette,
  PenLine,
  RefreshCw,
  Save,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Type,
  Undo2,
  Wand2,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import {
  AuroraBackdrop,
  GridBackdrop,
  Reveal,
  SectionHeading,
  StatCard,
} from "@/components/marketing/primitives";
import { SITE_NAME } from "@/lib/site";
import { templateCount } from "@/templates/registry";

export const metadata: Metadata = {
  title: "Features — a CV builder that respects your time",
  description:
    "Live A4 preview, auto-save, drag-and-drop ordering, photo cropping, ATS-friendly PDF export, template-accurate forms, JSON import/export and private-by-default storage.",
  alternates: { canonical: "/features" },
  openGraph: {
    title: `Features | ${SITE_NAME}`,
    description:
      "Everything CV Maker does: live preview, auto-save, ATS-friendly export, per-template forms and private storage.",
    url: "/features",
  },
};

const GROUPS: {
  icon: typeof Gauge;
  eyebrow: string;
  title: string;
  description: string;
  features: { icon: typeof Gauge; title: string; body: string }[];
}[] = [
  {
    icon: PenLine,
    eyebrow: "Writing",
    title: "A form that knows your template",
    description:
      "CV Maker reads the template you picked and renders exactly the fields it uses — nothing more, nothing less. Switching templates never deletes work.",
    features: [
      {
        icon: ListChecks,
        title: "Template-accurate fields",
        body: "Single-column templates skip photo fields; timeline templates gain date-range controls. The form always matches the page.",
      },
      {
        icon: MoveVertical,
        title: "Drag-and-drop ordering",
        body: "Reorder jobs, degrees, projects and skills — plus whole sections — with the mouse or the keyboard.",
      },
      {
        icon: Type,
        title: "Bullets that stay text",
        body: "Marker-based rich text gives you bold, italic and underline while keeping every word selectable in the PDF.",
      },
      {
        icon: Languages,
        title: "Smart dropdowns",
        body: "Degrees, proficiency levels, language levels, employment types, months and years — typed once, consistent everywhere.",
      },
      {
        icon: Wand2,
        title: "Sample data & JSON tools",
        body: "Load realistic sample content to see a template at its best, then reset, import or export the whole CV as JSON.",
      },
      {
        icon: Undo2,
        title: "Undo, redo, reset",
        body: "Mistakes are cheap. Step backwards and forwards through your edits without leaving the editor.",
      },
    ],
  },
  {
    icon: Gauge,
    eyebrow: "Preview",
    title: "See the finished page while you type",
    description:
      "The right-hand panel renders a true A4 page — 210 × 297 mm — with the same fonts and spacing the printer will use.",
    features: [
      {
        icon: Sparkles,
        title: "Live A4 preview",
        body: "Every keystroke redraws the page, so you never guess how a bullet will wrap or whether a section spills over.",
      },
      {
        icon: LayoutTemplate,
        title: "Multi-page navigation",
        body: "See page count as you type, jump between pages, and keep an eye on whether you are drifting past two.",
      },
      {
        icon: Gauge,
        title: "Zoom & fit-to-screen",
        body: "Zoom in to check details or fit the whole page on screen when you want the overall impression.",
      },
      {
        icon: RefreshCw,
        title: "Change template instantly",
        body: "Swap layouts with one click and watch your content re-flow into the new design immediately.",
      },
      {
        icon: Palette,
        title: "Accent & font control",
        body: "Curated palettes and font pairings per template, all tuned so the worst case still prints beautifully.",
      },
      {
        icon: ImageIcon,
        title: "Photo upload with crop",
        body: "Add a headshot where the template supports one, crop it, and choose round or square framing.",
      },
    ],
  },
  {
    icon: Download,
    eyebrow: "Export",
    title: "A PDF that survives the robots",
    description:
      "Recruiters and applicant tracking systems both have to read your CV. CV Maker exports real text with embedded fonts.",
    features: [
      {
        icon: FileSearch,
        title: "ATS-friendly by design",
        body: "No screenshots, no text-as-image, no hidden tricks — just clean, parseable content in reading order.",
      },
      {
        icon: Download,
        title: "Clean A4 pages",
        body: "No browser headers, footers, URLs or page numbers sneak into your file.",
      },
      {
        icon: Code2,
        title: "Selectable, copyable text",
        body: "Recruiters can copy your email, and tools can extract your skills — because the text is really there.",
      },
      {
        icon: CloudUpload,
        title: "Sensible file names",
        body: "Downloads arrive as FirstName_LastName_CV.pdf, so your application looks tidy in their inbox.",
      },
    ],
  },
  {
    icon: ShieldCheck,
    eyebrow: "Reliability & privacy",
    title: "Saved, private, and there tomorrow",
    description:
      "Your CV is saved in your own browser as you type, and never uploaded anywhere — there is no server holding a copy.",
    features: [
      {
        icon: Save,
        title: "Auto-save",
        body: "Changes are written about 1.5 seconds after you stop typing, with a clear save-status indicator.",
      },
      {
        icon: HardDrive,
        title: "Works offline",
        body: "Everything runs in the browser, so you can keep editing with no connection at all.",
      },
      {
        icon: Lock,
        title: "Private by default",
        body: "There is no backend. Your CVs live in this browser's local storage and your photos in IndexedDB — nothing is transmitted to us or anyone else.",
      },
      {
        icon: KeyRound,
        title: "Local accounts",
        body: "Sign-up and sign-in are handled entirely in your browser. Passwords are salted and hashed with PBKDF2-SHA-256, never stored in plain text.",
      },
      {
        icon: ShieldCheck,
        title: "Delete on demand",
        body: "Remove individual CVs any time, or delete your whole account and everything with it from Settings.",
      },
      {
        icon: Accessibility,
        title: "Built to be usable",
        body: "Keyboard-operable drag-and-drop, focus states, landmarks, alt text and reduced-motion support throughout.",
      },
      {
        icon: Smartphone,
        title: "Works on your phone",
        body: "Split-screen on desktop, tabbed form and preview on mobile — so you can tweak a bullet on the train.",
      },
    ],
  },
];

export default function FeaturesPage() {
  const total = templateCount();

  return (
    <div className="relative overflow-hidden">
      <AuroraBackdrop className="h-[560px]" />
      <GridBackdrop />

      <section className="mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Features"
            title="Everything a job application actually needs"
            description="CV Maker is deliberately focused: fill in your history, see the real page, download a file that works. Here is what that involves."
          />
        </Reveal>
        <Reveal delay={0.08}>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/signup" size="lg">
              Start building free
              <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
            <ButtonLink href="/templates" variant="secondary" size="lg">
              Browse {total} templates
            </ButtonLink>
          </div>
        </Reveal>
      </section>

      {GROUPS.map((group, groupIndex) => (
        <section
          key={group.title}
          className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
        >
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)]">
            <Reveal>
              <div className="lg:sticky lg:top-28">
                <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium tracking-wide text-cyan-300 uppercase">
                  <group.icon className="size-3.5" aria-hidden />
                  {group.eyebrow}
                </span>
                <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">{group.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-400 sm:text-base">
                  {group.description}
                </p>
              </div>
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-2">
              {group.features.map((feature, index) => (
                <Reveal key={feature.title} delay={(index % 2) * 0.06}>
                  <div className="glass h-full rounded-2xl p-5 transition hover:border-cyan-400/40">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/25 to-fuchsia-500/20 text-cyan-300">
                      <feature.icon className="size-4.5" aria-hidden />
                    </span>
                    <h3 className="mt-3.5 text-sm font-semibold">{feature.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-400">{feature.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          {groupIndex === 1 ? (
            <Reveal>
              <div className="neon-border mt-16 rounded-3xl p-8">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <StatCard value="A4" label="Exact print geometry" hint="210 × 297 mm" />
                  <StatCard value="1.5s" label="Auto-save debounce" hint="Plus offline retry" />
                  <StatCard value="100%" label="Selectable PDF text" hint="Embedded fonts" />
                  <StatCard value="0" label="Browser headers" hint="Nothing extra printed" />
                </div>
              </div>
            </Reveal>
          ) : null}
        </section>
      ))}

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal>
          <div className="glass rounded-3xl p-8 sm:p-10">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="max-w-xl">
                <h2 className="text-2xl font-bold tracking-tight">
                  Curious how the editor feels?
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-400">
                  Create a free account and try it with sample data already filled in. You can
                  delete the CV afterwards — no strings, no card.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <ButtonLink href="/signup">
                  Create my free CV
                  <ArrowRight className="size-4" aria-hidden />
                </ButtonLink>
                <Link
                  href="/faq"
                  className="inline-flex h-10 items-center rounded-xl px-4 text-sm text-ink-300 transition hover:bg-white/5 hover:text-[var(--page-fg)]"
                >
                  Read the FAQ
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
