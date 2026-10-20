"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  Briefcase,
  FileText,
  GraduationCap,
  Heart,
  Languages,
  Layers,
  Palette,
  Sparkles,
  Trophy,
  User,
  Users,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { SECTION_LABELS, sectionHasContent } from "@/lib/cv/defaults";
import type { CVData, SectionKey } from "@/lib/cv/schema";
import { useEditorStore } from "@/lib/editor/editor-store";
import { useAutoSave } from "@/lib/editor/use-auto-save";
import { cn } from "@/lib/utils";
import { PhotoUploader } from "./photo-uploader";
import { PersonalEditor, SummaryEditor } from "./personal-editor";
import {
  AwardsEditor,
  CertificationsEditor,
  CustomSectionsEditor,
  EducationEditor,
  ExperienceEditor,
  HobbiesEditor,
  LanguagesEditor,
  ProjectsEditor,
  ReferencesEditor,
  SkillsEditor,
} from "./section-editors";
import { SectionManager } from "./section-manager";
import { TemplateExtrasForm } from "./template-extras-form";
import { AppearancePanel } from "./appearance-panel";
import { DataTools } from "./data-tools";
import { PreviewPanel } from "./preview-panel";
import { EditorTopBar } from "./editor-topbar";
import { getTemplateConfigOrFallback, listTemplates } from "@/templates/registry.client";

const AUTOSAVE_DELAY = 1500;

const SECTION_ICONS: Record<SectionKey, typeof User> = {
  summary: FileText,
  experience: Briefcase,
  education: GraduationCap,
  skills: Wrench,
  projects: Layers,
  certifications: BadgeCheck,
  languages: Languages,
  awards: Trophy,
  references: Users,
  hobbies: Heart,
  custom: Sparkles,
};

interface Step {
  key: SectionKey;
  label: string;
}

/**
 * The editor's working surface: a stepped form on the left writes straight into
 * the Zustand document, a debounced effect persists it, and the right panel
 * re-renders the live A4 preview from the same document.
 */
export function EditorClient({
  initialTemplateId,
  userId,
}: {
  initialTemplateId: string;
  userId: string;
}) {
  const data = useEditorStore((state) => state.data);
  const templateId = useEditorStore((state) => state.templateId);
  const saveStatus = useEditorStore((state) => state.saveStatus);
  const changeToken = useEditorStore((state) => state.changeToken);
  const update = useEditorStore((state) => state.update);
  const setSectionOrder = useEditorStore((state) => state.setSectionOrder);
  const toggleSection = useEditorStore((state) => state.toggleSection);

  const templates = useMemo(() => listTemplates(), []);
  const template = useMemo(
    () => getTemplateConfigOrFallback(templateId || initialTemplateId),
    [templateId, initialTemplateId],
  );

  const [step, setStep] = useState<SectionKey | "personal" | "layout">("personal");
  const [styleOpen, setStyleOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<"form" | "preview">("form");

  /* --------------------------------- saving -------------------------------- */

  const { save: persist, offline } = useAutoSave(userId);

  // Debounced auto-save: every committed change bumps `changeToken`.
  useEffect(() => {
    if (!changeToken || saveStatus === "saved") return;
    const timer = setTimeout(persist, AUTOSAVE_DELAY);
    return () => clearTimeout(timer);
  }, [changeToken, saveStatus, persist]);

  // Ctrl/⌘ + S saves immediately.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        persist();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [persist]);

  /* ------------------------------ download PDF ----------------------------- */

  // Save first so the print route always renders the latest document, then open
  // it in a new tab (the route triggers the browser's print dialog itself).
  const downloadPdf = useCallback(() => {
    persist();
    const state = useEditorStore.getState();
    window.open(`/print/${state.cvId}`, "_blank", "noopener,noreferrer");
  }, [persist]);

  /* -------------------------------- sections ------------------------------- */

  const steps: Step[] = useMemo(() => {
    const order = data.settings.sectionOrder;
    return order.map((key) => ({ key, label: SECTION_LABELS[key] }));
  }, [data.settings.sectionOrder]);

  const available = template.supportedSections;
  const currentHasContent = step === "personal" || step === "layout" ? true : sectionHasContent(data, step);

  const goNext = () => {
    const sequence: (SectionKey | "personal" | "layout")[] = ["personal", ...steps.map((s) => s.key), "layout"];
    const index = sequence.indexOf(step);
    setStep(sequence[Math.min(sequence.length - 1, index + 1)]);
    document.getElementById("editor-form-scroll")?.scrollTo({ top: 0 });
  };

  const goPrev = () => {
    const sequence: (SectionKey | "personal" | "layout")[] = ["personal", ...steps.map((s) => s.key), "layout"];
    const index = sequence.indexOf(step);
    setStep(sequence[Math.max(0, index - 1)]);
  };

  const setSection = (key: SectionKey, next: unknown) => {
    update((draft: CVData) => {
      if (key === "summary") draft.summary = next as string;
      else if (key === "experience") draft.experience = next as CVData["experience"];
      else if (key === "education") draft.education = next as CVData["education"];
      else if (key === "skills") draft.skills = next as CVData["skills"];
      else if (key === "projects") draft.projects = next as CVData["projects"];
      else if (key === "certifications") draft.certifications = next as CVData["certifications"];
      else if (key === "languages") draft.languages = next as CVData["languages"];
      else if (key === "awards") draft.awards = next as CVData["awards"];
      else if (key === "references") draft.references = next as CVData["references"];
      else if (key === "hobbies") draft.hobbies = next as CVData["hobbies"];
      else if (key === "custom") draft.customSections = next as CVData["customSections"];
    });
  };

  /* ---------------------------------- render ------------------------------- */

  return (
    <div className="flex min-h-[calc(100dvh-4rem)] flex-col">
      <EditorTopBar
        templates={templates}
        currentTemplate={template}
        onSaveNow={persist}
        onDownload={downloadPdf}
        onOpenAppearance={() => setStyleOpen(true)}
      />

      {offline ? (
        <div className="no-print flex items-center gap-2 border-b border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs text-amber-200">
          <span className="size-1.5 animate-pulse rounded-full bg-amber-400" aria-hidden />
          Saving failed — your browser store may be full. Changes are kept here; free some space or
          export a backup and they will save automatically.
        </div>
      ) : null}

      {/* Mobile: switch between the form and the preview. */}
      <div className="no-print flex gap-2 px-4 py-3 lg:hidden">
        <Button
          variant={mobileTab === "form" ? "primary" : "outline"}
          size="sm"
          fullWidth
          onClick={() => setMobileTab("form")}
        >
          Edit
        </Button>
        <Button
          variant={mobileTab === "preview" ? "primary" : "outline"}
          size="sm"
          fullWidth
          onClick={() => setMobileTab("preview")}
        >
          Preview
        </Button>
      </div>

      <div className="grid min-h-0 flex-1 gap-6 px-4 pb-8 lg:grid-cols-[minmax(0,1fr)_minmax(380px,42%)] lg:px-6">
        {/* ---------------------------------- form --------------------------- */}
        <div
          className={cn(
            "flex min-h-0 flex-col",
            mobileTab === "form" ? "flex" : "hidden lg:flex",
          )}
        >
          <nav
            aria-label="Editor sections"
            className="no-print -mx-1 flex gap-2 overflow-x-auto px-1 pb-3 scrollbar-thin"
          >
            <StepChip
              active={step === "personal"}
              onClick={() => setStep("personal")}
              icon={User}
              label="Personal"
            />
            {steps.map((item) => (
              <StepChip
                key={item.key}
                active={step === item.key}
                onClick={() => setStep(item.key)}
                icon={SECTION_ICONS[item.key]}
                label={item.label}
                muted={!sectionHasContent(data, item.key)}
                dimmed={!available.includes(item.key)}
              />
            ))}
            <StepChip
              active={step === "layout"}
              onClick={() => setStep("layout")}
              icon={Palette}
              label="Layout"
            />
          </nav>

          <div
            id="editor-form-scroll"
            className="min-h-0 flex-1 overflow-y-auto rounded-3xl border border-[var(--border-soft)] bg-white/[0.02] p-4 scrollbar-thin sm:p-5"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="space-y-5"
              >
                <header className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-[var(--page-fg)]">
                      {step === "personal"
                        ? "Personal details"
                        : step === "layout"
                          ? "Layout & sections"
                          : SECTION_LABELS[step]}
                    </h2>
                    <p className="mt-0.5 text-xs text-ink-500">
                      {step === "personal"
                        ? "The header every template shows at the top of your CV."
                        : step === "layout"
                          ? "Reorder sections, hide what you do not need, and tune the template."
                          : "Everything here appears in the matching section of your CV."}
                    </p>
                  </div>
                </header>

                {step === "personal" ? (
                  <div className="space-y-5">
                    {template.hasPhoto ? <PhotoUploader hasPhoto={template.hasPhoto} /> : null}
                    <PersonalEditor
                      value={data.personal}
                      onChange={(next) =>
                        update((draft) => {
                          draft.personal = next;
                        })
                      }
                    />
                  </div>
                ) : step === "layout" ? (
                  <div className="space-y-6">
                    <SectionManager
                      order={steps.map((s) => s.key)}
                      visibility={data.settings.sectionVisibility}
                      onOrderChange={setSectionOrder}
                      onVisibilityChange={toggleSection}
                      hasContent={(key) => sectionHasContent(data, key)}
                      available={available}
                    />
                    <div>
                      <h3 className="mb-2 text-sm font-semibold text-[var(--page-fg)]">
                        Template options
                      </h3>
                      <TemplateExtrasForm
                        fields={template.extraFields}
                        values={data.extra}
                        accentOptions={template.accentOptions}
                        onChange={(key, value) =>
                          update((draft) => {
                            draft.extra = { ...draft.extra, [key]: value };
                          })
                        }
                      />
                    </div>
                    <div>
                      <h3 className="mb-2 text-sm font-semibold text-[var(--page-fg)]">
                        Appearance
                      </h3>
                      <AppearancePanel template={template} />
                    </div>
                  </div>
                ) : (
                  <SectionBody
                    section={step}
                    data={data}
                    onChange={(next) => setSection(step, next)}
                  />
                )}

                <div className="flex items-center justify-between gap-3 border-t border-[var(--border-soft)] pt-4">
                  <Button variant="ghost" size="sm" onClick={goPrev} disabled={step === "personal"}>
                    Back
                  </Button>
                  {step === "layout" ? (
                    <Button size="sm" onClick={() => setStyleOpen(true)}>
                      Done editing
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" onClick={goNext}>
                      Next:{" "}
                      {(() => {
                        const sequence = ["personal", ...steps.map((s) => s.key), "layout"];
                        const index = sequence.indexOf(step);
                        const next = sequence[index + 1];
                        return next === "layout"
                          ? "Layout"
                          : next === "personal"
                            ? "Personal"
                            : SECTION_LABELS[next as SectionKey];
                      })()}
                    </Button>
                  )}
                </div>

                {!currentHasContent ? (
                  <div className="rounded-2xl border border-dashed border-[var(--border-soft)] px-4 py-6 text-center">
                    <p className="text-sm text-ink-400">
                      This section is empty â€” it will not appear on your CV until you add something.
                    </p>
                  </div>
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="no-print mt-4">
            <DataTools />
          </div>
        </div>

        {/* -------------------------------- preview -------------------------- */}
        <div
          className={cn(
            "min-h-[60vh] lg:sticky lg:top-24 lg:h-[calc(100dvh-8rem)]",
            mobileTab === "preview" ? "block" : "hidden lg:block",
          )}
        >
          <PreviewPanel />
        </div>
      </div>

      <Modal
        open={styleOpen}
        onClose={() => setStyleOpen(false)}
        title="Appearance"
        description="Accent colour, typeface and density for this template."
        size="md"
      >
        <AppearancePanel template={template} />
      </Modal>
    </div>
  );
}

/* ------------------------------ helper pieces ----------------------------- */

function StepChip({
  active,
  onClick,
  icon: Icon,
  label,
  muted,
  dimmed,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof User;
  label: string;
  muted?: boolean;
  dimmed?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "step" : undefined}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition",
        active
          ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-200"
          : "border-[var(--border-soft)] text-ink-400 hover:border-cyan-400/30 hover:text-[var(--page-fg)]",
        dimmed && !active && "opacity-50",
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      {label}
      {muted && !active ? (
        <span className="size-1.5 rounded-full bg-ink-500" aria-label="empty" />
      ) : null}
    </button>
  );
}

function SectionBody({
  section,
  data,
  onChange,
}: {
  section: SectionKey;
  data: CVData;
  onChange: (next: unknown) => void;
}) {
  switch (section) {
    case "summary":
      return <SummaryEditor value={data.summary} onChange={onChange} />;
    case "experience":
      return <ExperienceEditor items={data.experience} onChange={onChange} />;
    case "education":
      return <EducationEditor items={data.education} onChange={onChange} />;
    case "skills":
      return <SkillsEditor items={data.skills} onChange={onChange} />;
    case "projects":
      return <ProjectsEditor items={data.projects} onChange={onChange} />;
    case "certifications":
      return <CertificationsEditor items={data.certifications} onChange={onChange} />;
    case "languages":
      return <LanguagesEditor items={data.languages} onChange={onChange} />;
    case "awards":
      return <AwardsEditor items={data.awards} onChange={onChange} />;
    case "references":
      return <ReferencesEditor items={data.references} onChange={onChange} />;
    case "hobbies":
      return <HobbiesEditor items={data.hobbies} onChange={onChange} />;
    case "custom":
      return <CustomSectionsEditor items={data.customSections} onChange={onChange} />;
    default:
      return null;
  }
}
