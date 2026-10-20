"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/marketing/primitives";
import { TemplateThumbnail } from "@/components/templates/template-thumbnail";
import { Button } from "@/components/ui/button";
import { AuthSkeleton } from "@/components/auth/auth-skeleton";
import { useCreateCV } from "@/lib/cv/use-create-cv";
import { listTemplates, templateCount } from "@/templates/registry";
import { TemplatePicker } from "./template-picker";

/**
 * Template selection screen.
 *
 * Client-side because creating a CV writes to localStorage and the "already have
 * a CV?" state comes from the local session. The `useSearchParams` read sits
 * behind a Suspense boundary of its own, which is what Next's static export
 * requires for a client component.
 */
export function TemplateSelectScreen() {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <TemplateSelectContent />
    </Suspense>
  );
}

function TemplateSelectContent() {
  const searchParams = useSearchParams();
  const template = searchParams.get("template") ?? undefined;
  const { createCv, creating } = useCreateCV();

  const templates = listTemplates();
  const selected = templates.find((item) => item.id === template);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          align="left"
          eyebrow="New CV"
          title="Choose a starting template"
          description={`${templateCount()} layouts across seven categories. Not sure yet? Pick any one — switching later keeps all of your content.`}
        />
        <Link href="/dashboard" className="text-sm text-ink-400 transition hover:text-cyan-300">
          Cancel and go back
        </Link>
      </div>

      {selected ? (
        <div className="glass mt-8 flex flex-col gap-5 rounded-3xl p-5 sm:flex-row sm:items-center">
          <div className="h-32 w-[90px] shrink-0 overflow-hidden rounded-xl bg-white">
            <TemplateThumbnail template={selected} width={90} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold tracking-widest text-cyan-300 uppercase">
              Ready to start
            </p>
            <h2 className="mt-1 text-lg font-semibold">{selected.name}</h2>
            <p className="mt-0.5 text-sm text-ink-400">{selected.description}</p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button
              size="lg"
              className="w-full"
              loading={creating}
              onClick={() => void createCv(selected.id)}
            >
              {!creating ? <Sparkles className="size-4" aria-hidden /> : null}
              Start blank
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              loading={creating}
              onClick={() => void createCv(selected.id, { sample: true })}
            >
              Use sample data
            </Button>
          </div>
        </div>
      ) : null}

      <div className="mt-8">
        <TemplatePicker templates={templates} initialTemplateId={template} />
      </div>

      <p className="mt-10 text-center text-sm text-ink-400">
        Want to look before you choose?{" "}
        <Link href="/templates" className="text-cyan-300 hover:underline">
          Browse the public gallery
        </Link>
        <ArrowRight className="ml-1 inline size-3.5" aria-hidden />
      </p>
    </div>
  );
}
