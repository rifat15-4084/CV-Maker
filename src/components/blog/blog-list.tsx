"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, Clock, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { EmptyState } from "@/components/ui/feedback";
import { cn } from "@/lib/utils";
import type { BlogPostMeta } from "@/lib/blog";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function BlogList({ posts }: { posts: BlogPostMeta[] }) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | "all">("all");

  const tags = useMemo(() => {
    const set = new Set<string>();
    for (const post of posts) for (const item of post.tags) set.add(item);
    return Array.from(set).sort();
  }, [posts]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return posts.filter((post) => {
      if (tag !== "all" && !post.tags.includes(tag)) return false;
      if (!needle) return true;
      return (
        post.title.toLowerCase().includes(needle) ||
        post.description.toLowerCase().includes(needle) ||
        post.tags.some((item) => item.toLowerCase().includes(needle))
      );
    });
  }, [posts, query, tag]);

  const reset = () => {
    setQuery("");
    setTag("all");
  };

  return (
    <div>
      <div className="glass flex flex-col gap-3 rounded-3xl p-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-500"
            aria-hidden
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search articles…"
            aria-label="Search articles"
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

        <div className="flex flex-wrap gap-2">
          <TagChip active={tag === "all"} onClick={() => setTag("all")} label="All topics" />
          {tags.map((item) => (
            <TagChip
              key={item}
              active={tag === item}
              onClick={() => setTag(item)}
              label={item}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-sm text-ink-400" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "article" : "articles"}
        </p>
        {(query || tag !== "all") && (
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
          icon={<Search className="size-7" aria-hidden />}
          title="No articles match those filters"
          description="Try a different keyword, or reset to see everything published so far."
          action={
            <Button variant="secondary" onClick={reset}>
              Reset filters
            </Button>
          }
        />
      ) : (
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: Math.min(index, 8) * 0.04 }}
              className="glass group flex h-full flex-col rounded-3xl p-6 transition hover:-translate-y-1 hover:border-cyan-400/40"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs text-ink-500">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="size-3.5" aria-hidden />
                  <time dateTime={post.date}>{dateFormatter.format(new Date(post.date))}</time>
                </span>
                <span aria-hidden>·</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-3.5" aria-hidden />
                  {post.readingTime}
                </span>
              </div>

              <h2 className="mt-3 text-lg font-semibold leading-snug">
                <Link href={`/blog/${post.slug}`} className="transition group-hover:text-cyan-300">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-400">
                {post.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {post.tags.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[var(--border-soft)] bg-white/5 px-2 py-0.5 text-[11px] text-ink-400"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <Link
                href={`/blog/${post.slug}`}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-300 transition group-hover:gap-2"
              >
                Read article
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}

function TagChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition",
        active
          ? "border-cyan-400/60 bg-cyan-400/15 text-cyan-200"
          : "border-[var(--border-soft)] bg-white/5 text-ink-300 hover:border-cyan-400/30 hover:text-[var(--page-fg)]",
      )}
    >
      {label}
    </button>
  );
}
