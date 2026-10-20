"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/field";
import { EmptyState } from "@/components/ui/feedback";
import { TemplateCard } from "@/components/templates/template-card";
import { useCreateCV } from "@/lib/cv/use-create-cv";
import { templateSelectionActions } from "@/lib/store/template-selection";
import { TEMPLATE_CATEGORIES, type TemplateCategory, type TemplateConfig } from "@/templates/types";

type SortKey = "recommended" | "name" | "category";

export function TemplatePicker({
  templates,
  initialTemplateId,
}: {
  templates: TemplateConfig[];
  initialTemplateId?: string;
}) {
  const { createCv, creating } = useCreateCV();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<TemplateCategory | "all">("all");
  const [sort, setSort] = useState<SortKey>("recommended");

  /**
   * Selection lives in the shared Zustand store, so clicking one card
   * re-renders that card only — not this grid and not the other 59 cards.
   */
  useEffect(() => {
    if (initialTemplateId) templateSelectionActions.setSelected(initialTemplateId);
  }, [initialTemplateId]);

  /** Stable handlers: one identity for the lifetime of the screen. */
  const useBlank = useCallback(
    (templateId: string) => {
      templateSelectionActions.setSelected(templateId);
      void createCv(templateId);
    },
    [createCv],
  );

  const useSample = useCallback(
    (templateId: string) => {
      templateSelectionActions.setSelected(templateId);
      void createCv(templateId, { sample: true });
    },
    [createCv],
  );

  const counts = useMemo(() => {
    const map = new Map<TemplateCategory, number>();
    for (const template of templates) map.set(template.category, (map.get(template.category) ?? 0) + 1);
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
    if (sort === "category")
      return [...result].sort(
        (a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name),
      );
    return result;
  }, [templates, query, category, sort]);

  /** Hrefs are computed once per list so card props stay referentially stable. */
  const items = useMemo(
    () =>
      filtered.map((template) => ({
        template,
        href: `/templates/select?template=${template.id}`,
      })),
    [filtered],
  );

  const reset = () => {
    setQuery("");
    setCategory("all");
    setSort("recommended");
  };

  return (
    <div>
      <div className="glass flex flex-col gap-3 rounded-2xl p-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-500"
            aria-hidden
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search templates…"
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
        <label className="sr-only" htmlFor="picker-category">
          Filter by category
        </label>
        <Select
          id="picker-category"
          value={category}
          onChange={(event) => setCategory(event.target.value as TemplateCategory | "all")}
          className="lg:w-48"
        >
          <option value="all">All categories ({templates.length})</option>
          {TEMPLATE_CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item} ({counts.get(item) ?? 0})
            </option>
          ))}
        </Select>
        <Select
          value={sort}
          onChange={(event) => setSort(event.target.value as SortKey)}
          aria-label="Sort templates"
          className="lg:w-48"
        >
          <option value="recommended">Sort: Recommended</option>
          <option value="name">Sort: Name (A–Z)</option>
          <option value="category">Sort: Category</option>
        </Select>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <p className="text-sm text-ink-400" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "template" : "templates"}
        </p>
        {(query || category !== "all" || sort !== "recommended") && (
          <button type="button" onClick={reset} className="text-sm text-cyan-300 hover:underline">
            Reset filters
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          className="mt-6"
          icon={<Sparkles className="size-7" aria-hidden />}
          title="No templates match those filters"
          description="Try a different keyword or reset the filters."
          action={
            <Button variant="secondary" onClick={reset}>
              Reset filters
            </Button>
          }
        />
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map(({ template, href }) => (
            <TemplateCard
              key={template.id}
              template={template}
              href={href}
              selectable
              busy={creating}
              onUse={useBlank}
              onUseSample={useSample}
            />
          ))}
        </div>
      )}
    </div>
  );
}
