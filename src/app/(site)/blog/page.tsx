import type { Metadata } from "next";
import { AuroraBackdrop, GridBackdrop, Reveal, SectionHeading } from "@/components/marketing/primitives";
import { BlogList } from "@/components/blog/blog-list";
import { ButtonLink } from "@/components/ui/button";
import { listPosts } from "@/lib/blog";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog — CV writing tips, ATS advice and job-search guides",
  description:
    "Practical guides on writing CV bullet points, choosing one page or two, tailoring applications and making sure your CV survives applicant tracking systems.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: `Blog | ${SITE_NAME}`,
    description: SITE_DESCRIPTION,
    url: "/blog",
  },
};

export default function BlogPage() {
  const posts = listPosts();

  return (
    <div className="relative overflow-hidden">
      <AuroraBackdrop className="h-[440px]" />
      <GridBackdrop />

      <section className="mx-auto max-w-7xl px-4 pt-16 pb-6 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Blog"
            title="Short guides that make your CV better today"
            description="No filler listicles. Each article is a routine you can apply to the CV you already have."
          />
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <BlogList posts={posts} />

        <Reveal delay={0.1}>
          <div className="glass mt-14 flex flex-wrap items-center justify-between gap-6 rounded-3xl p-8">
            <div className="max-w-xl">
              <h2 className="text-xl font-semibold">Ready to apply the advice?</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-400">
                Open the editor, load sample data, and rewrite your bullets while watching the live
                A4 page update.
              </p>
            </div>
            <ButtonLink href="/signup">
              Start building free
            </ButtonLink>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
