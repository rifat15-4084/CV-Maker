import type { CVData, PersonalInfo, SectionKey } from "@/lib/cv/schema";
import { isSectionVisible, orderedSections, sectionHasContent } from "@/lib/cv/defaults";
import { formatMonthYear } from "@/lib/cv/format";

/** Should this section render for the current data + settings? */
export function show(data: CVData, key: SectionKey): boolean {
  if (!isSectionVisible(data.settings, key)) return false;
  if (key === "custom") return data.customSections.some((s) => s.items.length > 0);
  return sectionHasContent(data, key);
}

/** Visible non-personal sections in the user's preferred order. */
export function visibleSections(data: CVData): SectionKey[] {
  return orderedSections(data.settings).filter((key) => show(data, key));
}

export function fullName(personal: PersonalInfo) {
  return `${personal.firstName} ${personal.lastName}`.replace(/\s+/g, " ").trim();
}

export interface ContactItem {
  key: string;
  icon: "mail" | "phone" | "pin" | "globe" | "linkedin" | "github" | "link";
  label: string;
  value: string;
  href?: string;
}

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^[\w.-]+@[\w.-]+\.\w+$/.test(trimmed)) return `mailto:${trimmed}`;
  return `https://${trimmed}`;
}

/** Flat, icon-labelled contact list built from personal info. */
export function contactItems(personal: PersonalInfo): ContactItem[] {
  const items: ContactItem[] = [];
  if (personal.email)
    items.push({ key: "email", icon: "mail", label: "Email", value: personal.email, href: `mailto:${personal.email}` });
  if (personal.phone)
    items.push({ key: "phone", icon: "phone", label: "Phone", value: personal.phone, href: `tel:${personal.phone.replace(/[^\d+]/g, "")}` });
  if (personal.address)
    items.push({ key: "address", icon: "pin", label: "Location", value: personal.address });
  if (personal.website)
    items.push({ key: "website", icon: "globe", label: "Web", value: personal.website, href: normalizeUrl(personal.website) });
  if (personal.linkedin)
    items.push({ key: "linkedin", icon: "linkedin", label: "LinkedIn", value: personal.linkedin, href: normalizeUrl(personal.linkedin) });
  if (personal.github)
    items.push({ key: "github", icon: "github", label: "GitHub", value: personal.github, href: normalizeUrl(personal.github) });
  for (const link of personal.extraLinks) {
    if (!link.label && !link.url) continue;
    items.push({
      key: link.id,
      icon: "link",
      label: link.label || "Link",
      value: link.url,
      href: normalizeUrl(link.url),
    });
  }
  return items;
}

/** Renders **bold** and *italic* markers found in bullet text. */
export function formatInline(text: string): React.ReactNode {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_)/g).filter(Boolean);
  return parts.map((part, index) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (/^\*[^*]+\*$/.test(part)) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    if (/^_[^_]+_$/.test(part)) {
      return <u key={index}>{part.slice(1, -1)}</u>;
    }
    return <span key={index}>{part}</span>;
  });
}

export { formatMonthYear };
