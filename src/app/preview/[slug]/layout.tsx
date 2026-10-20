/**
 * Bare layout for template previews.
 *
 * Deliberately renders nothing but its children (no navbar, no padding, no
 * background) so the thumbnail generator captures pure A4 artwork and the route
 * matches the print output exactly.
 */
export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
