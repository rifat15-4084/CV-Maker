"use client";

import {
  DEGREE_LEVELS,
  EMPLOYMENT_TYPES,
  LANGUAGE_LEVELS,
  PROFICIENCY_LEVELS,
  type AwardItem,
  type CertificationItem,
  type CustomSection,
  type EducationItem,
  type ExperienceItem,
  type HobbyItem,
  type LanguageItem,
  type ProjectItem,
  type ReferenceItem,
  type SkillItem,
} from "@/lib/cv/schema";
import {
  DEGREE_LEVEL_LABELS,
  EMPLOYMENT_TYPE_LABELS,
  LANGUAGE_LEVEL_LABELS,
  PROFICIENCY_LABELS,
} from "@/lib/cv/format";
import { newId } from "@/lib/cv/defaults";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { DateField } from "@/components/ui/fields/date-field";
import {
  RichTextArea,
  bulletsToText,
  textToBullets,
} from "@/components/ui/fields/rich-text-area";
import { SortableList } from "@/components/ui/sortable";
import { AddEntryButton, EntryCard, FieldGrid } from "./entry-card";

/* ==========================================================================
   Section editors.
   Each export owns one repeatable section: it receives the current array plus
   a setter and renders sortable entry cards with the right fields.
   ========================================================================== */

interface SectionProps<T> {
  items: T[];
  onChange: (items: T[]) => void;
}

/* ------------------------------- experience ------------------------------- */
export function ExperienceEditor({
  items,
  onChange,
}: SectionProps<ExperienceItem>) {
  const update = (id: string, patch: Partial<ExperienceItem>) =>
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));

  return (
    <div className="space-y-3">
      <SortableList
        items={items}
        onReorder={onChange}
        label="Work experience"
        renderItem={(item) => (
          <EntryCard
            title={item.role || "New role"}
            subtitle={[item.company, item.location].filter(Boolean).join(" · ")}
            onRemove={() => onChange(items.filter((entry) => entry.id !== item.id))}
          >
            <FieldGrid>
              <Field label="Job title" htmlFor={`role-${item.id}`}>
                <Input
                  id={`role-${item.id}`}
                  value={item.role}
                  onChange={(event) => update(item.id, { role: event.target.value })}
                  placeholder="Senior Product Designer"
                />
              </Field>
              <Field label="Company" htmlFor={`company-${item.id}`}>
                <Input
                  id={`company-${item.id}`}
                  value={item.company}
                  onChange={(event) => update(item.id, { company: event.target.value })}
                  placeholder="Northwind Labs"
                />
              </Field>
            </FieldGrid>
            <FieldGrid>
              <Field label="Location" htmlFor={`location-${item.id}`}>
                <Input
                  id={`location-${item.id}`}
                  value={item.location}
                  onChange={(event) => update(item.id, { location: event.target.value })}
                  placeholder="London, UK · Remote"
                />
              </Field>
              <Field label="Employment type" htmlFor={`type-${item.id}`}>
                <Select
                  id={`type-${item.id}`}
                  value={item.employmentType}
                  onChange={(event) =>
                    update(item.id, { employmentType: event.target.value as ExperienceItem["employmentType"] })
                  }
                >
                  {EMPLOYMENT_TYPES.map((value) => (
                    <option key={value} value={value}>
                      {EMPLOYMENT_TYPE_LABELS[value]}
                    </option>
                  ))}
                </Select>
              </Field>
            </FieldGrid>
            <FieldGrid>
              <DateField
                label="Start date"
                value={item.startDate}
                onChange={(value) => update(item.id, { startDate: value })}
              />
              <DateField
                label="End date"
                value={item.endDate}
                current={item.current}
                allowPresent
                onCurrentChange={(value) => update(item.id, { current: value })}
                onChange={(value) => update(item.id, { endDate: value })}
              />
            </FieldGrid>
            <RichTextArea
              label="What you did (one bullet per line)"
              value={bulletsToText(item.bullets)}
              onChange={(value) => update(item.id, { bullets: textToBullets(value) })}
              placeholder={"- Grew engagement 34% in six months\n- Led a team of four designers"}
            />
          </EntryCard>
        )}
      />
      <AddEntryButton
        label="Add another role"
        onClick={() =>
          onChange([
            ...items,
            {
              id: newId(),
              role: "",
              company: "",
              location: "",
              employmentType: "full-time",
              startDate: "",
              endDate: "",
              current: false,
              description: "",
              bullets: [],
            },
          ])
        }
      />
    </div>
  );
}

/* ------------------------------- education -------------------------------- */
export function EducationEditor({ items, onChange }: SectionProps<EducationItem>) {
  const update = (id: string, patch: Partial<EducationItem>) =>
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));

  return (
    <div className="space-y-3">
      <SortableList
        items={items}
        onReorder={onChange}
        label="Education"
        renderItem={(item) => (
          <EntryCard
            title={item.degree || "New qualification"}
            subtitle={[item.field, item.school].filter(Boolean).join(" · ")}
            onRemove={() => onChange(items.filter((entry) => entry.id !== item.id))}
          >
            <FieldGrid>
              <Field label="Qualification" htmlFor={`degree-${item.id}`}>
                <Input
                  id={`degree-${item.id}`}
                  value={item.degree}
                  onChange={(event) => update(item.id, { degree: event.target.value })}
                  placeholder="BSc Computer Science"
                />
              </Field>
              <Field label="Level" htmlFor={`degree-level-${item.id}`}>
                <Select
                  id={`degree-level-${item.id}`}
                  value={item.degreeLevel}
                  onChange={(event) =>
                    update(item.id, { degreeLevel: event.target.value as EducationItem["degreeLevel"] })
                  }
                >
                  {DEGREE_LEVELS.map((value) => (
                    <option key={value} value={value}>
                      {DEGREE_LEVEL_LABELS[value]}
                    </option>
                  ))}
                </Select>
              </Field>
            </FieldGrid>
            <FieldGrid>
              <Field label="Field of study" htmlFor={`field-${item.id}`}>
                <Input
                  id={`field-${item.id}`}
                  value={item.field}
                  onChange={(event) => update(item.id, { field: event.target.value })}
                  placeholder="Computer Science"
                />
              </Field>
              <Field label="School" htmlFor={`school-${item.id}`}>
                <Input
                  id={`school-${item.id}`}
                  value={item.school}
                  onChange={(event) => update(item.id, { school: event.target.value })}
                  placeholder="University of Manchester"
                />
              </Field>
            </FieldGrid>
            <FieldGrid>
              <DateField
                label="Start date"
                value={item.startDate}
                onChange={(value) => update(item.id, { startDate: value })}
              />
              <DateField
                label="End date"
                value={item.endDate}
                current={item.current}
                allowPresent
                onCurrentChange={(value) => update(item.id, { current: value })}
                onChange={(value) => update(item.id, { endDate: value })}
              />
            </FieldGrid>
            <FieldGrid>
              <Field label="Grade" htmlFor={`grade-${item.id}`}>
                <Input
                  id={`grade-${item.id}`}
                  value={item.grade}
                  onChange={(event) => update(item.id, { grade: event.target.value })}
                  placeholder="First class"
                />
              </Field>
              <Field label="Location" htmlFor={`edu-location-${item.id}`}>
                <Input
                  id={`edu-location-${item.id}`}
                  value={item.location}
                  onChange={(event) => update(item.id, { location: event.target.value })}
                  placeholder="Manchester, UK"
                />
              </Field>
            </FieldGrid>
            <RichTextArea
              label="Highlights (optional)"
              rows={3}
              value={bulletsToText(item.bullets)}
              onChange={(value) => update(item.id, { bullets: textToBullets(value) })}
              placeholder="- Dissertation on distributed systems"
            />
          </EntryCard>
        )}
      />
      <AddEntryButton
        label="Add another qualification"
        onClick={() =>
          onChange([
            ...items,
            {
              id: newId(),
              degree: "",
              degreeLevel: "bachelor",
              field: "",
              school: "",
              location: "",
              startDate: "",
              endDate: "",
              current: false,
              grade: "",
              description: "",
              bullets: [],
            },
          ])
        }
      />
    </div>
  );
}

/* --------------------------------- skills --------------------------------- */
export function SkillsEditor({ items, onChange }: SectionProps<SkillItem>) {
  const update = (id: string, patch: Partial<SkillItem>) =>
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));

  return (
    <div className="space-y-3">
      <SortableList
        items={items}
        onReorder={onChange}
        label="Skills"
        renderItem={(item) => (
          <EntryCard
            title={item.name || "New skill"}
            subtitle={item.category || undefined}
            onRemove={() => onChange(items.filter((entry) => entry.id !== item.id))}
          >
            <FieldGrid columns={3}>
              <Field label="Skill" htmlFor={`skill-${item.id}`}>
                <Input
                  id={`skill-${item.id}`}
                  value={item.name}
                  onChange={(event) => update(item.id, { name: event.target.value })}
                  placeholder="TypeScript"
                />
              </Field>
              <Field label="Category" htmlFor={`skill-cat-${item.id}`}>
                <Input
                  id={`skill-cat-${item.id}`}
                  value={item.category}
                  onChange={(event) => update(item.id, { category: event.target.value })}
                  placeholder="Languages"
                />
              </Field>
              <Field label="Proficiency" htmlFor={`skill-level-${item.id}`}>
                <Select
                  id={`skill-level-${item.id}`}
                  value={String(item.level)}
                  onChange={(event) => update(item.id, { level: Number(event.target.value) })}
                >
                  {PROFICIENCY_LEVELS.map((value, index) => (
                    <option key={value} value={String(index + 1)}>
                      {PROFICIENCY_LABELS[value]}
                    </option>
                  ))}
                  <option value="5">Expert</option>
                </Select>
              </Field>
            </FieldGrid>
            <label className="flex cursor-pointer items-center gap-2 text-xs text-ink-400">
              <input
                type="checkbox"
                checked={item.showBar}
                onChange={(event) => update(item.id, { showBar: event.target.checked })}
                className="size-3.5 rounded border-[var(--border-soft)] bg-white/5 accent-cyan-500"
              />
              Show a proficiency indicator where the template supports it
            </label>
          </EntryCard>
        )}
      />
      <AddEntryButton
        label="Add another skill"
        onClick={() =>
          onChange([
            ...items,
            { id: newId(), name: "", category: "", level: 3, showBar: true, extra: "" },
          ])
        }
      />
    </div>
  );
}

/* -------------------------------- projects -------------------------------- */
export function ProjectsEditor({ items, onChange }: SectionProps<ProjectItem>) {
  const update = (id: string, patch: Partial<ProjectItem>) =>
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));

  return (
    <div className="space-y-3">
      <SortableList
        items={items}
        onReorder={onChange}
        label="Projects"
        renderItem={(item) => (
          <EntryCard
            title={item.name || "New project"}
            subtitle={item.tech || undefined}
            onRemove={() => onChange(items.filter((entry) => entry.id !== item.id))}
          >
            <FieldGrid>
              <Field label="Project name" htmlFor={`project-${item.id}`}>
                <Input
                  id={`project-${item.id}`}
                  value={item.name}
                  onChange={(event) => update(item.id, { name: event.target.value })}
                  placeholder="CV Maker"
                />
              </Field>
              <Field label="Your role" htmlFor={`project-role-${item.id}`}>
                <Input
                  id={`project-role-${item.id}`}
                  value={item.role}
                  onChange={(event) => update(item.id, { role: event.target.value })}
                  placeholder="Lead developer"
                />
              </Field>
            </FieldGrid>
            <FieldGrid>
              <Field label="Link" htmlFor={`project-link-${item.id}`}>
                <Input
                  id={`project-link-${item.id}`}
                  value={item.link}
                  onChange={(event) => update(item.id, { link: event.target.value })}
                  placeholder="github.com/you/project"
                />
              </Field>
              <Field label="Tech / tools" htmlFor={`project-tech-${item.id}`}>
                <Input
                  id={`project-tech-${item.id}`}
                  value={item.tech}
                  onChange={(event) => update(item.id, { tech: event.target.value })}
                  placeholder="Next.js, TypeScript, Tailwind"
                />
              </Field>
            </FieldGrid>
            <FieldGrid>
              <DateField
                label="Start date"
                value={item.startDate}
                onChange={(value) => update(item.id, { startDate: value })}
              />
              <DateField
                label="End date"
                value={item.endDate}
                onChange={(value) => update(item.id, { endDate: value })}
              />
            </FieldGrid>
            <RichTextArea
              label="What it does / what you built"
              rows={3}
              value={bulletsToText(item.bullets)}
              onChange={(value) => update(item.id, { bullets: textToBullets(value) })}
              placeholder="- Multi-tenant CV builder serving 12k users"
            />
          </EntryCard>
        )}
      />
      <AddEntryButton
        label="Add another project"
        onClick={() =>
          onChange([
            ...items,
            {
              id: newId(),
              name: "",
              role: "",
              link: "",
              tech: "",
              startDate: "",
              endDate: "",
              description: "",
              bullets: [],
            },
          ])
        }
      />
    </div>
  );
}

/* ----------------------------- certifications ----------------------------- */
export function CertificationsEditor({
  items,
  onChange,
}: SectionProps<CertificationItem>) {
  const update = (id: string, patch: Partial<CertificationItem>) =>
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));

  return (
    <div className="space-y-3">
      <SortableList
        items={items}
        onReorder={onChange}
        label="Certifications"
        renderItem={(item) => (
          <EntryCard
            title={item.name || "New certification"}
            subtitle={item.issuer || undefined}
            onRemove={() => onChange(items.filter((entry) => entry.id !== item.id))}
          >
            <FieldGrid>
              <Field label="Certification" htmlFor={`cert-${item.id}`}>
                <Input
                  id={`cert-${item.id}`}
                  value={item.name}
                  onChange={(event) => update(item.id, { name: event.target.value })}
                  placeholder="AWS Certified Solutions Architect"
                />
              </Field>
              <Field label="Issuer" htmlFor={`cert-issuer-${item.id}`}>
                <Input
                  id={`cert-issuer-${item.id}`}
                  value={item.issuer}
                  onChange={(event) => update(item.id, { issuer: event.target.value })}
                  placeholder="Amazon Web Services"
                />
              </Field>
            </FieldGrid>
            <FieldGrid columns={3}>
              <DateField
                label="Date"
                value={item.date}
                onChange={(value) => update(item.id, { date: value })}
              />
              <Field label="Credential ID" htmlFor={`cert-id-${item.id}`}>
                <Input
                  id={`cert-id-${item.id}`}
                  value={item.credentialId}
                  onChange={(event) => update(item.id, { credentialId: event.target.value })}
                />
              </Field>
              <Field label="URL" htmlFor={`cert-url-${item.id}`}>
                <Input
                  id={`cert-url-${item.id}`}
                  value={item.url}
                  onChange={(event) => update(item.id, { url: event.target.value })}
                  placeholder="credly.com/…"
                />
              </Field>
            </FieldGrid>
          </EntryCard>
        )}
      />
      <AddEntryButton
        label="Add another certification"
        onClick={() =>
          onChange([
            ...items,
            { id: newId(), name: "", issuer: "", date: "", credentialId: "", url: "" },
          ])
        }
      />
    </div>
  );
}

/* -------------------------------- languages ------------------------------- */
export function LanguagesEditor({ items, onChange }: SectionProps<LanguageItem>) {
  const update = (id: string, patch: Partial<LanguageItem>) =>
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));

  return (
    <div className="space-y-3">
      <SortableList
        items={items}
        onReorder={onChange}
        label="Languages"
        renderItem={(item) => (
          <EntryCard
            title={item.name || "New language"}
            subtitle={LANGUAGE_LEVEL_LABELS[item.level]}
            onRemove={() => onChange(items.filter((entry) => entry.id !== item.id))}
          >
            <FieldGrid columns={3}>
              <Field label="Language" htmlFor={`lang-${item.id}`}>
                <Input
                  id={`lang-${item.id}`}
                  value={item.name}
                  onChange={(event) => update(item.id, { name: event.target.value })}
                  placeholder="Spanish"
                />
              </Field>
              <Field label="Level" htmlFor={`lang-level-${item.id}`}>
                <Select
                  id={`lang-level-${item.id}`}
                  value={item.level}
                  onChange={(event) =>
                    update(item.id, { level: event.target.value as LanguageItem["level"] })
                  }
                >
                  {LANGUAGE_LEVELS.map((value) => (
                    <option key={value} value={value}>
                      {LANGUAGE_LEVEL_LABELS[value]}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Detail" htmlFor={`lang-detail-${item.id}`}>
                <Input
                  id={`lang-detail-${item.id}`}
                  value={item.detail}
                  onChange={(event) => update(item.id, { detail: event.target.value })}
                  placeholder="DELE B2"
                />
              </Field>
            </FieldGrid>
          </EntryCard>
        )}
      />
      <AddEntryButton
        label="Add another language"
        onClick={() =>
          onChange([
            ...items,
            { id: newId(), name: "", level: "professional-working", detail: "" },
          ])
        }
      />
    </div>
  );
}

/* --------------------------------- awards --------------------------------- */
export function AwardsEditor({ items, onChange }: SectionProps<AwardItem>) {
  const update = (id: string, patch: Partial<AwardItem>) =>
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));

  return (
    <div className="space-y-3">
      <SortableList
        items={items}
        onReorder={onChange}
        label="Awards"
        renderItem={(item) => (
          <EntryCard
            title={item.title || "New award"}
            subtitle={item.issuer || undefined}
            onRemove={() => onChange(items.filter((entry) => entry.id !== item.id))}
          >
            <FieldGrid>
              <Field label="Award" htmlFor={`award-${item.id}`}>
                <Input
                  id={`award-${item.id}`}
                  value={item.title}
                  onChange={(event) => update(item.id, { title: event.target.value })}
                  placeholder="Employee of the Year"
                />
              </Field>
              <Field label="Issuer" htmlFor={`award-issuer-${item.id}`}>
                <Input
                  id={`award-issuer-${item.id}`}
                  value={item.issuer}
                  onChange={(event) => update(item.id, { issuer: event.target.value })}
                />
              </Field>
            </FieldGrid>
            <FieldGrid>
              <DateField
                label="Date"
                value={item.date}
                onChange={(value) => update(item.id, { date: value })}
              />
            </FieldGrid>
            <Field label="Description" htmlFor={`award-desc-${item.id}`}>
              <Textarea
                id={`award-desc-${item.id}`}
                rows={2}
                value={item.description}
                onChange={(event) => update(item.id, { description: event.target.value })}
              />
            </Field>
          </EntryCard>
        )}
      />
      <AddEntryButton
        label="Add another award"
        onClick={() =>
          onChange([...items, { id: newId(), title: "", issuer: "", date: "", description: "" }])
        }
      />
    </div>
  );
}

/* ------------------------------- references ------------------------------- */
export function ReferencesEditor({ items, onChange }: SectionProps<ReferenceItem>) {
  const update = (id: string, patch: Partial<ReferenceItem>) =>
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));

  return (
    <div className="space-y-3">
      <SortableList
        items={items}
        onReorder={onChange}
        label="References"
        renderItem={(item) => (
          <EntryCard
            title={item.name || "New reference"}
            subtitle={[item.role, item.company].filter(Boolean).join(" · ") || undefined}
            onRemove={() => onChange(items.filter((entry) => entry.id !== item.id))}
          >
            <FieldGrid>
              <Field label="Name" htmlFor={`ref-${item.id}`}>
                <Input
                  id={`ref-${item.id}`}
                  value={item.name}
                  onChange={(event) => update(item.id, { name: event.target.value })}
                />
              </Field>
              <Field label="Relationship" htmlFor={`ref-rel-${item.id}`}>
                <Input
                  id={`ref-rel-${item.id}`}
                  value={item.relationship}
                  onChange={(event) => update(item.id, { relationship: event.target.value })}
                  placeholder="Former manager"
                />
              </Field>
            </FieldGrid>
            <FieldGrid>
              <Field label="Job title" htmlFor={`ref-role-${item.id}`}>
                <Input
                  id={`ref-role-${item.id}`}
                  value={item.role}
                  onChange={(event) => update(item.id, { role: event.target.value })}
                />
              </Field>
              <Field label="Company" htmlFor={`ref-company-${item.id}`}>
                <Input
                  id={`ref-company-${item.id}`}
                  value={item.company}
                  onChange={(event) => update(item.id, { company: event.target.value })}
                />
              </Field>
            </FieldGrid>
            <Field label="Contact" htmlFor={`ref-contact-${item.id}`}>
              <Input
                id={`ref-contact-${item.id}`}
                value={item.contact}
                onChange={(event) => update(item.id, { contact: event.target.value })}
                placeholder="email or phone"
              />
            </Field>
          </EntryCard>
        )}
      />
      <AddEntryButton
        label="Add another reference"
        onClick={() =>
          onChange([
            ...items,
            { id: newId(), name: "", role: "", company: "", contact: "", relationship: "" },
          ])
        }
      />
    </div>
  );
}

/* -------------------------------- hobbies --------------------------------- */
export function HobbiesEditor({ items, onChange }: SectionProps<HobbyItem>) {
  const update = (id: string, patch: Partial<HobbyItem>) =>
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));

  return (
    <div className="space-y-3">
      <SortableList
        items={items}
        onReorder={onChange}
        label="Interests"
        renderItem={(item) => (
          <EntryCard
            title={item.name || "New interest"}
            onRemove={() => onChange(items.filter((entry) => entry.id !== item.id))}
          >
            <Field label="Interest" htmlFor={`hobby-${item.id}`}>
              <Input
                id={`hobby-${item.id}`}
                value={item.name}
                onChange={(event) => update(item.id, { name: event.target.value })}
                placeholder="Trail running"
              />
            </Field>
          </EntryCard>
        )}
      />
      <AddEntryButton
        label="Add another interest"
        onClick={() => onChange([...items, { id: newId(), name: "" }])}
      />
    </div>
  );
}

/* ---------------------------- custom sections ----------------------------- */
export function CustomSectionsEditor({
  items,
  onChange,
}: {
  items: CustomSection[];
  onChange: (items: CustomSection[]) => void;
}) {
  const updateSection = (id: string, patch: Partial<CustomSection>) =>
    onChange(items.map((section) => (section.id === id ? { ...section, ...patch } : section)));

  return (
    <div className="space-y-4">
      {items.map((section) => (
        <EntryCard
          key={section.id}
          title={section.title || "New section"}
          subtitle={`${section.items.length} item${section.items.length === 1 ? "" : "s"}`}
          onRemove={() => onChange(items.filter((entry) => entry.id !== section.id))}
        >
          <Field label="Section title" htmlFor={`custom-title-${section.id}`}>
            <Input
              id={`custom-title-${section.id}`}
              value={section.title}
              onChange={(event) => updateSection(section.id, { title: event.target.value })}
              placeholder="Volunteering"
            />
          </Field>

          <div className="space-y-3">
            {section.items.map((item) => {
              const updateItem = (patch: Partial<typeof item>) =>
                updateSection(section.id, {
                  items: section.items.map((entry) =>
                    entry.id === item.id ? { ...entry, ...patch } : entry,
                  ),
                });
              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-[var(--border-soft)] bg-white/[0.02] p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold text-ink-300">
                      {item.heading || "New item"}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        updateSection(section.id, {
                          items: section.items.filter((entry) => entry.id !== item.id),
                        })
                      }
                      className="rounded-lg p-1 text-ink-500 transition hover:bg-rose-500/10 hover:text-rose-300"
                      aria-label="Remove item"
                    >
                      ×
                    </button>
                  </div>
                  <div className="mt-2 space-y-3">
                    <FieldGrid>
                      <Field label="Heading" htmlFor={`ci-heading-${item.id}`}>
                        <Input
                          id={`ci-heading-${item.id}`}
                          value={item.heading}
                          onChange={(event) => updateItem({ heading: event.target.value })}
                        />
                      </Field>
                      <Field label="Subheading" htmlFor={`ci-sub-${item.id}`}>
                        <Input
                          id={`ci-sub-${item.id}`}
                          value={item.subheading}
                          onChange={(event) => updateItem({ subheading: event.target.value })}
                        />
                      </Field>
                    </FieldGrid>
                    <DateField
                      label="Date"
                      value={item.date}
                      onChange={(value) => updateItem({ date: value })}
                    />
                    <RichTextArea
                      label="Details"
                      rows={3}
                      value={bulletsToText(item.bullets)}
                      onChange={(value) => updateItem({ bullets: textToBullets(value) })}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <AddEntryButton
            label="Add item to this section"
            onClick={() =>
              updateSection(section.id, {
                items: [
                  ...section.items,
                  {
                    id: newId(),
                    heading: "",
                    subheading: "",
                    date: "",
                    description: "",
                    bullets: [],
                  },
                ],
              })
            }
          />
        </EntryCard>
      ))}

      <AddEntryButton
        label="Add a custom section"
        onClick={() =>
          onChange([...items, { id: newId(), title: "", items: [] }])
        }
      />
    </div>
  );
}
