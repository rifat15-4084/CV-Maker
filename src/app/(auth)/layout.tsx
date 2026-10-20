import Link from "next/link";
import { ArrowLeft, BadgeCheck } from "lucide-react";
import { AuroraBackdrop, GridBackdrop } from "@/components/marketing/primitives";
import { TemplateThumbnail } from "@/components/templates/template-thumbnail";
import { Wordmark } from "@/components/layout/wordmark";
import { SITE_NAME } from "@/lib/site";
import { listTemplates } from "@/templates/registry";

/** Shared split-screen chrome for every authentication page. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const showcase = listTemplates().slice(0, 4);
  const points = [
    "60 print-ready templates",
    "Live A4 preview as you type",
    "Automatic saving in your browser",
    "Clean, ATS-friendly PDFs",
  ];

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <AuroraBackdrop />
      <GridBackdrop />

      <div className="mx-auto grid min-h-dvh max-w-7xl lg:grid-cols-2">
        {/* ------------------------------- form side ------------------------------ */}
        <div className="flex flex-col px-4 py-8 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between">
            <Wordmark />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-ink-400 transition hover:text-cyan-300"
            >
              <ArrowLeft className="size-4" aria-hidden />
              Back to site
            </Link>
          </div>

          <main className="flex flex-1 items-center justify-center py-10">
            <div className="w-full max-w-md">{children}</div>
          </main>

          <p className="text-center text-xs text-ink-600">
            By continuing you agree to our{" "}
            <Link href="/terms-of-service" className="text-ink-400 hover:text-cyan-300">
              terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className="text-ink-400 hover:text-cyan-300">
              privacy policy
            </Link>
            .
          </p>
        </div>

        {/* ----------------------------- showcase side ---------------------------- */}
        <aside className="relative hidden items-center justify-center border-l border-[var(--border-soft)] lg:flex">
          <div className="w-full max-w-md px-10">
            <h2 className="text-2xl font-bold tracking-tight">
              A CV you will be glad to send
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-400">
              Join {SITE_NAME} and build a recruiter-ready CV in minutes — no design skills, no
              formatting fights.
            </p>

            <ul className="mt-6 space-y-2.5">
              {points.map((point) => (
                <li key={point} className="flex items-center gap-2.5 text-sm text-ink-300">
                  <BadgeCheck className="size-4 shrink-0 text-cyan-300" aria-hidden />
                  {point}
                </li>
              ))}
            </ul>

            <div className="mt-10 grid grid-cols-2 gap-4">
              {showcase.map((template, index) => (
                <div
                  key={template.id}
                  className="glass overflow-hidden rounded-2xl p-1.5"
                  style={{ transform: `rotate(${(index % 2 === 0 ? -1 : 1) * 1.5}deg)` }}
                >
                  <div className="aspect-[210/297] overflow-hidden rounded-xl bg-white">
                    <TemplateThumbnail template={template} width={320} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
