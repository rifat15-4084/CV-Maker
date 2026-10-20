import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { ArrowLeft, ArrowRight, CalendarDays, Clock, User } from "lucide-react";
import { AuroraBackdrop } from "@/components/marketing/primitives";
import { mdxComponents } from "@/components/marketing/mdx-components";
import { ButtonLink } from "@/components/ui/button";
import { getPost, listSlugs, relatedPosts } from "@/lib/blog";
import { SITE_NAME } from "@/lib/site";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function generateStaticParams() {
  return listSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Article not found" };

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = relatedPosts(slug, 3);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Organization", name: post.author },
    publisher: { "@type": "Organization", name: SITE_NAME },
    keywords: post.tags.join(", "),
  };

  return (
    <article className="relative overflow-hidden">
      <AuroraBackdrop className="h-[420px]" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <div className="mx-auto max-w-3xl px-4 pt-14 pb-24 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-ink-400 transition hover:text-cyan-300"
        >
          <ArrowLeft className="size-4" aria-hidden />
          All articles
        </Link>

        <header className="mt-6">
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[var(--border-soft)] bg-white/5 px-2.5 py-0.5 text-[11px] text-ink-400"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem]">
            {post.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink-400 sm:text-lg">
            {post.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-[var(--border-soft)] py-4 text-xs text-ink-500">
            <span className="inline-flex items-center gap-1.5">
              <User className="size-3.5" aria-hidden />
              {post.author}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-3.5" aria-hidden />
              <time dateTime={post.date}>{dateFormatter.format(new Date(post.date))}</time>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" aria-hidden />
              {post.readingTime}
            </span>
          </div>
        </header>

        <div className="mt-2">
          <MDXRemote
            source={post.content}
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeSlug],
              },
            }}
          />
        </div>

        <div className="mt-14 rounded-3xl border border-[var(--border-soft)] bg-gradient-to-br from-cyan-500/12 via-violet-500/12 to-fuchsia-500/12 p-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight">Put this into practice</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-ink-300">
            Open the CVForge editor, pick a template, and rewrite your bullets with the live A4
            preview watching every change.
          </p>
          <div className="mt-6 flex justify-center">
            <ButtonLink href="/signup">
              Start building free
              <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          </div>
        </div>

        {related.length ? (
          <section className="mt-14">
            <h2 className="text-lg font-semibold">Keep reading</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className="glass group flex h-full flex-col rounded-2xl p-4 transition hover:border-cyan-400/40"
                >
                  <h3 className="text-sm font-semibold transition group-hover:text-cyan-300">
                    {item.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-ink-500">
                    {item.description}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-cyan-300">
                    Read
                    <ArrowRight className="size-3" aria-hidden />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </article>
  );
}
