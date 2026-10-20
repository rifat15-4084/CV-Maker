import fs from "node:fs";
import path from "node:path";

/**
 * Minimal frontmatter + Markdown reader for the blog.
 * Posts live in `src/content/blog/*.md` and are read at build time, so the
 * blog ships as static HTML with no runtime parsing cost.
 */

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  readingTime: string;
  tags: string[];
  featured: boolean;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
}

const BLOG_DIR = path.join(process.cwd(), "src", "content", "blog");

function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!match) return { data: {}, content: raw };

  const [, block, content] = match;
  const data: Record<string, unknown> = {};

  for (const line of block.split(/\r?\n/)) {
    const separator = line.indexOf(":");
    if (separator < 0) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();

    // Strip surrounding quotes.
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (value.startsWith("[") && value.endsWith("]")) {
      data[key] = value
        .slice(1, -1)
        .split(",")
        .map((part) => part.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else if (value === "true" || value === "false") {
      data[key] = value === "true";
    } else {
      data[key] = value;
    }
  }

  return { data, content };
}

function toMeta(slug: string, data: Record<string, unknown>): BlogPostMeta {
  return {
    slug,
    title: String(data.title ?? "Untitled"),
    description: String(data.description ?? ""),
    date: String(data.date ?? "1970-01-01"),
    author: String(data.author ?? "The CVForge team"),
    readingTime: String(data.readingTime ?? "5 min read"),
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    featured: data.featured === true,
  };
}

let cache: BlogPost[] | null = null;

function loadAll(): BlogPost[] {
  if (cache) return cache;

  let files: string[] = [];
  try {
    files = fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith(".md"));
  } catch {
    files = [];
  }

  const posts = files.map((file) => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
    const { data, content } = parseFrontmatter(raw);
    const slug = file.replace(/\.md$/, "");
    return { ...toMeta(slug, data), content };
  });

  cache = posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return cache;
}

export function listPosts(): BlogPostMeta[] {
  return loadAll().map(({ content: _content, ...meta }) => meta);
}

export function getPost(slug: string): BlogPost | undefined {
  return loadAll().find((post) => post.slug === slug);
}

export function listSlugs(): string[] {
  return loadAll().map((post) => post.slug);
}

export function relatedPosts(slug: string, limit = 3): BlogPostMeta[] {
  const all = listPosts();
  const current = all.find((post) => post.slug === slug);
  if (!current) return all.slice(0, limit);

  return all
    .filter((post) => post.slug !== slug)
    .sort((a, b) => {
      const overlap = (post: BlogPostMeta) =>
        post.tags.filter((tag) => current.tags.includes(tag)).length;
      return overlap(b) - overlap(a);
    })
    .slice(0, limit);
}
