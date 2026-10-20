"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/field";
import { EmptyState } from "@/components/ui/feedback";
import { useAuth } from "@/components/providers/auth-provider";
import { TemplateThumbnail } from "@/components/templates/template-thumbnail";
import { TemplateCard } from "@/components/templates/template-card";
import { cn } from "@/lib/utils";
import { TEMPLATE_CATEGORIES, type TemplateCategory, type TemplateConfig } from "@/templates/types";

type SortKey = "recommended" | "name" | "category";

const SORTS: { value: SortKey; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "name", label: "Name (A–Z)" },
  { value: "category", label: "Category" },
];

export function TemplateGallery({
  templates,
  initialTemplateId,
}: {
  templates: TemplateConfig[];
  initialTemplateId?: string;
}) {
  const { user } = useAuth();
  const signedIn = Boolean(user);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<TemplateCategory | "all">("all");
  const [sort, setSort] = useState<SortKey>("recommended");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const counts = useMemo(() => {
    const map = new Map<TemplateCategory, number>();
    for (const template of templates) {
      map.set(template.category, (map.get(template.category) ?? 0) + 1);
    }
    return map;
  }, [templates]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const result = templates.filter((template) => {
      if (category !== "all" && template.category !== category) return false;
      if (!needle) return true;
      return (
        template.name.toLowerCase().includes(needle) ||
        template.category.toLowerCase().includes(needle) ||
        template.description.toLowerCase().includes(needle)
      );
    });

    if (sort === "name") return [...result].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "category") {
      return [...result].sort(
        (a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name),
      );
    }
    return result;
  }, [templates, query, category, sort]);

  /**
   * Hrefs are derived once per (list, auth state) and looked up by id, so every
   * card receives a plain, referentially stable string instead of a value
   * recomputed inside `map` on each render.
   */
  const hrefById = useMemo(() => {
    const map = new Map<string, string>();
    for (const template of filtered) {
      map.set(
        template.id,
        signedIn ? `/templates/select?template=${template.id}` : `/signup?template=${template.id}`,
      );
    }
    return map;
  }, [filtered, signedIn]);

  const highlighted = initialTemplateId
    ? templates.find((template) => template.id === initialTemplateId)
    : undefined;

  const reset = () => {
    setQuery("");
    setCategory("all");
    setSort("recommended");
  };

  return (
    <div>
      {highlighted ? (
        <div className="glass mb-8 flex flex-col gap-4 rounded-3xl p-5 sm:flex-row sm:items-center">
          <div className="h-24 w-[68px] shrink-0 overflow-hidden rounded-xl bg-white">
            <TemplateThumbnail template={highlighted} width={68} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold tracking-widest text-cyan-300 uppercase">
              Selected template
            </p>
            <h2 className="mt-1 text-lg font-semibold">{highlighted.name}</h2>
            <p className="mt-0.5 text-sm text-ink-400">{highlighted.description}</p>
          </div>
          <Link
            href={signedIn ? `/templates/select?template=${highlighted.id}` : `/signup?template=${highlighted.id}`}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 px-5 text-sm font-medium text-white transition hover:brightness-110"
          >
            Use this template
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      ) : null}

      {/* ------------------------------- controls ------------------------------ */}
      <div className="glass sticky top-[4.5rem] z-20 rounded-3xl p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-500"
              aria-hidden
            />
            <Input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search templates by name, style or category…"
              aria-label="Search templates"
              className="pl-9"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-lg p-1 text-ink-500 transition hover:bg-white/10 hover:text-[var(--page-fg)]"
              >
                <X className="size-4" aria-hidden />
              </button>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <label className="sr-only" htmlFor="gallery-sort">
              Sort templates
            </label>
            <Select
              id="gallery-sort"
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              className="w-full lg:w-48"
            >
              {SORTS.map((option) => (
                <option key={option.value} value={option.value}>
                  Sort: {option.label}
                </option>
              ))}
            </Select>
            <Button
              variant="secondary"
              size="icon"
              className="lg:hidden"
              aria-expanded={filtersOpen}
              aria-controls="gallery-categories"
              onClick={() => setFiltersOpen((open) => !open)}
            >
              <SlidersHorizontal className="size-4" aria-hidden />
              <span className="sr-only">Toggle category filters</span>
            </Button>
          </div>
        </div>

        <div
          id="gallery-categories"
          className={cn("mt-3 flex-wrap gap-2 lg:flex", filtersOpen ? "flex" : "hidden")}
        >
          <CategoryChip
            active={category === "all"}
            onClick={() => setCategory("all")}
            label={`All templates`}
            count={templates.length}
          />
          {TEMPLATE_CATEGORIES.map((item) => (
            <CategoryChip
              key={item}
              active={category === item}
              onClick={() => setCategory(item)}
              label={item}
              count={counts.get(item) ?? 0}
              disabled={(counts.get(item) ?? 0) === 0}
            />
          ))}
        </div>
      </div>

      {/* -------------------------------- results ------------------------------ */}
      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-sm text-ink-400" aria-live="polite">
          Showing <span className="font-semibold text-[var(--page-fg)]">{filtered.length}</span>{" "}
          {filtered.length === 1 ? "template" : "templates"}
          {category !== "all" ? ` in ${category}` : ""}
          {query ? ` matching “${query}”` : ""}
        </p>
        {(query || category !== "all" || sort !== "recommended") && (
          <button
            type="button"
            onClick={reset}
            className="text-sm text-cyan-300 transition hover:underline"
          >
            Reset filters
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon={<Sparkles className="size-7" aria-hidden />}
          title="No templates match those filters"
          description="Try a different keyword, or reset the filters to see the full gallery again."
          action={
            <Button variant="secondary" onClick={reset}>
              Reset filters
            </Button>
          }
        />
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              href={hrefById.get(template.id) ?? "#"}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryChip({
  label,
  count,
  active,
  disabled,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition",
        active
          ? "border-cyan-400/60 bg-cyan-400/15 text-cyan-200"
          : "border-[var(--border-soft)] bg-white/5 text-ink-300 hover:border-cyan-400/30 hover:text-[var(--page-fg)]",
        disabled && "cursor-not-allowed opacity-40 hover:border-[var(--border-soft)]",
      )}
    >
      {label}
      <span className="rounded-full bg-white/10 px-1.5 text-xs text-ink-400">{count}</span>
    </button>
  );
}
