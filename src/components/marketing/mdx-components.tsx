import type { MDXComponents } from "mdx/types";
import Link from "next/link";

/**
 * Typography for rendered MDX. Kept explicit rather than relying on a
 * `prose` plugin so the dark theme stays under our control.
 */
export const mdxComponents: MDXComponents = {
  h2: ({ children, id, ...props }) => (
    <h2
      id={id}
      className="mt-10 scroll-mt-28 text-2xl font-semibold tracking-tight text-[var(--page-fg)]"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, id, ...props }) => (
    <h3
      id={id}
      className="mt-8 scroll-mt-28 text-xl font-semibold tracking-tight text-[var(--page-fg)]"
      {...props}
    >
      {children}
    </h3>
  ),
  p: ({ children, ...props }) => (
    <p className="mt-4 text-base leading-relaxed text-ink-300" {...props}>
      {children}
    </p>
  ),
  a: ({ href = "#", children, ...props }) => {
    const external = href.startsWith("http");
    const className =
      "font-medium text-cyan-300 underline decoration-cyan-400/40 underline-offset-4 transition hover:decoration-cyan-300";
    if (external) {
      return (
        <a href={href} target="_blank" rel="noreferrer noopener" className={className} {...props}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={className} {...props}>
        {children}
      </Link>
    );
  },
  ul: ({ children, ...props }) => (
    <ul className="mt-4 space-y-2 pl-5" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="mt-4 list-decimal space-y-2 pl-5 text-ink-300" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li
      className="text-base leading-relaxed text-ink-300 marker:text-cyan-400/70 [ul_&]:list-disc"
      {...props}
    >
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="mt-6 rounded-r-2xl border-l-2 border-cyan-400/50 bg-white/[0.03] py-3 pr-4 pl-5 text-ink-300 italic"
      {...props}
    >
      {children}
    </blockquote>
  ),
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-[var(--page-fg)]" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }) => (
    <em className="italic" {...props}>
      {children}
    </em>
  ),
  hr: (props) => <hr className="my-10 border-[var(--border-soft)]" {...props} />,
  code: ({ children, ...props }) => (
    <code
      className="rounded-md border border-[var(--border-soft)] bg-white/5 px-1.5 py-0.5 text-[0.85em] text-cyan-200"
      {...props}
    >
      {children}
    </code>
  ),
  pre: ({ children, ...props }) => (
    <pre
      className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border-soft)] bg-white/[0.04] p-4 text-sm"
      {...props}
    >
      {children}
    </pre>
  ),
  table: ({ children, ...props }) => (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="border-b border-[var(--border-soft)]" {...props}>
      {children}
    </thead>
  ),
  th: ({ children, ...props }) => (
    <th className="px-3 py-2.5 text-left font-semibold text-[var(--page-fg)]" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td
      className="border-b border-[var(--border-soft)] px-3 py-2.5 align-top text-ink-300"
      {...props}
    >
      {children}
    </td>
  ),
  img: ({ src, alt, ...props }) => (
    // Markdown images in posts are decorative; use a plain <img> to avoid
    // needing remote patterns configured for every external host.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={typeof src === "string" ? src : undefined} alt={alt ?? ""} className="mt-6 rounded-2xl" {...props} />
  ),
};
