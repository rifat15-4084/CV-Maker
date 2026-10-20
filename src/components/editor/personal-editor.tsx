"use client";

import { newId } from "@/lib/cv/defaults";
import type { PersonalInfo, SocialLink } from "@/lib/cv/schema";
import { Field, Input, Textarea } from "@/components/ui/field";
import { SortableList } from "@/components/ui/sortable";
import { AddEntryButton, EntryCard, FieldGrid } from "./entry-card";

/** Personal details — the section every template renders, whatever the layout. */
export function PersonalEditor({
  value,
  onChange,
}: {
  value: PersonalInfo;
  onChange: (next: PersonalInfo) => void;
}) {
  const update = (patch: Partial<PersonalInfo>) => onChange({ ...value, ...patch });
  const links = value.extraLinks ?? [];
  const setLinks = (next: SocialLink[]) => update({ extraLinks: next });

  return (
    <div className="space-y-3">
      <FieldGrid>
        <Field label="First name" htmlFor="personal-first" required>
          <Input
            id="personal-first"
            value={value.firstName}
            onChange={(event) => update({ firstName: event.target.value })}
            placeholder="Alex"
            autoComplete="given-name"
          />
        </Field>
        <Field label="Last name" htmlFor="personal-last" required>
          <Input
            id="personal-last"
            value={value.lastName}
            onChange={(event) => update({ lastName: event.target.value })}
            placeholder="Morgan"
            autoComplete="family-name"
          />
        </Field>
      </FieldGrid>

      <FieldGrid>
        <Field label="Professional title" htmlFor="personal-title">
          <Input
            id="personal-title"
            value={value.jobTitle}
            onChange={(event) => update({ jobTitle: event.target.value })}
            placeholder="Senior Product Designer"
            autoComplete="organization-title"
          />
        </Field>
        <Field label="Tagline (optional)" htmlFor="personal-tagline">
          <Input
            id="personal-tagline"
            value={value.tagline}
            onChange={(event) => update({ tagline: event.target.value })}
            placeholder="Designing calm products for busy people"
          />
        </Field>
      </FieldGrid>

      <FieldGrid>
        <Field label="Email" htmlFor="personal-email">
          <Input
            id="personal-email"
            type="email"
            value={value.email}
            onChange={(event) => update({ email: event.target.value })}
            placeholder="alex@example.com"
            autoComplete="email"
          />
        </Field>
        <Field label="Phone" htmlFor="personal-phone">
          <Input
            id="personal-phone"
            type="tel"
            value={value.phone}
            onChange={(event) => update({ phone: event.target.value })}
            placeholder="+44 7700 900123"
            autoComplete="tel"
          />
        </Field>
      </FieldGrid>

      <Field label="Location" htmlFor="personal-address">
        <Input
          id="personal-address"
          value={value.address}
          onChange={(event) => update({ address: event.target.value })}
          placeholder="London, United Kingdom"
          autoComplete="address-level2"
        />
      </Field>

      <FieldGrid columns={3}>
        <Field label="Website" htmlFor="personal-website">
          <Input
            id="personal-website"
            value={value.website}
            onChange={(event) => update({ website: event.target.value })}
            placeholder="alexmorgan.dev"
          />
        </Field>
        <Field label="LinkedIn" htmlFor="personal-linkedin">
          <Input
            id="personal-linkedin"
            value={value.linkedin}
            onChange={(event) => update({ linkedin: event.target.value })}
            placeholder="linkedin.com/in/alexmorgan"
          />
        </Field>
        <Field label="GitHub / other" htmlFor="personal-github">
          <Input
            id="personal-github"
            value={value.github}
            onChange={(event) => update({ github: event.target.value })}
            placeholder="github.com/alexmorgan"
          />
        </Field>
      </FieldGrid>

      <div>
        <p className="mb-2 text-xs font-medium text-ink-300">Additional links</p>
        <div className="space-y-3">
          <SortableList
            items={links}
            onReorder={setLinks}
            label="Additional links"
            renderItem={(link) => (
              <EntryCard
                title={link.label || "New link"}
                onRemove={() => setLinks(links.filter((entry) => entry.id !== link.id))}
              >
                <FieldGrid>
                  <Field label="Label" htmlFor={`link-label-${link.id}`}>
                    <Input
                      id={`link-label-${link.id}`}
                      value={link.label}
                      onChange={(event) =>
                        setLinks(
                          links.map((entry) =>
                            entry.id === link.id ? { ...entry, label: event.target.value } : entry,
                          ),
                        )
                      }
                      placeholder="Portfolio"
                    />
                  </Field>
                  <Field label="URL" htmlFor={`link-url-${link.id}`}>
                    <Input
                      id={`link-url-${link.id}`}
                      value={link.url}
                      onChange={(event) =>
                        setLinks(
                          links.map((entry) =>
                            entry.id === link.id ? { ...entry, url: event.target.value } : entry,
                          ),
                        )
                      }
                      placeholder="https://…"
                    />
                  </Field>
                </FieldGrid>
              </EntryCard>
            )}
          />
          {links.length < 6 ? (
            <AddEntryButton
              label="Add a link"
              onClick={() => setLinks([...links, { id: newId(), label: "", url: "" }])}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** The professional summary is a single long-text field. */
export function SummaryEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const max = 1200;
  const used = value.length;
  const nearLimit = used > max * 0.9;

  return (
    <div className="space-y-2">
      <Textarea
        id="summary"
        rows={6}
        value={value}
        onChange={(event) => onChange(event.target.value.slice(0, max))}
        placeholder="Two or three lines on who you are, what you do best, and the kind of role you are looking for."
        aria-label="Professional summary"
      />
      <p className={nearLimit ? "text-xs text-amber-300" : "text-xs text-ink-500"}>
        {used}/{max} characters · aim for 40–90 words
      </p>
    </div>
  );
}
