# CV Maker

Pick a template, fill in your details with a live A4 preview, and download a clean, ATS-friendly PDF. Built with Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, React Hook Form + Zod and Zustand.

**This build runs entirely in the browser — there is no backend and no Supabase.** Accounts, CVs and photos live in the visitor's own browser (localStorage + IndexedDB), so the app deploys anywhere static with **no environment variables** and no database. Data access is hidden behind two small service interfaces, so swapping in a real backend later means writing two classes — see [Adding a backend later](#adding-a-backend-later).

---

## Features

- **Marketing site** — home, templates gallery, features, how-it-works, pricing, about, contact, FAQ, blog (Markdown/MDX), privacy policy, terms of service, custom 404 and error pages.
- **Templates** — a growing library of print-safe A4 layouts, each a genuinely different layout (header structure, column model, sidebar treatment, typography, section chrome). Per-template accent colours, fonts, optional sections and template-specific fields.
- **Editor** — split-screen form + live preview (tabs on mobile), section show/hide and reorder, drag-and-drop reordering of entries, dropdowns everywhere, photo upload with crop, marker-based rich text for bullets, template switching that preserves hidden data, undo/redo, JSON import/export, sample data, and debounced auto-save with a storage-full warning.
- **PDF export** — dedicated `/print/[cvId]` route with clean print CSS: A4, selectable text, no browser headers/footers, file named `FullName_CV.pdf`.
- **Local accounts** — sign up with name, email and password and you are logged in instantly (no email verification). Passwords are hashed with PBKDF2-SHA-256 and a per-user random salt via the Web Crypto API; the session persists across reloads and "Keep me signed in" survives a browser restart.
- **Dashboard & settings** — create/rename/duplicate/archive/delete CVs, change your name and password, upload an avatar, delete your account. Export/import **all** your CVs as a JSON backup.
- **Design system** — futuristic dark theme, neon cyan/violet/magenta, glassmorphism, animated gradients, Framer Motion transitions, light/dark toggle, responsive, skeletons, toasts, empty states, confirm modals and accessible components.
- **SEO** — metadata, Open Graph image, `sitemap.xml`, `robots.txt`, semantic HTML.
- **Tests** — Vitest suites (111 tests) for the CV schema, defaults, formatting helpers, editor store, auth validation, and the local auth/storage/repository services.

---

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (`@theme` tokens) + inline styles inside templates |
| Motion | Framer Motion |
| Forms | React Hook Form + Zod |
| State | Zustand |
| Drag & drop | dnd-kit |
| Storage | `localStorage` (accounts + CVs) and IndexedDB via [`idb`](https://github.com/jakearchibald/idb) (photos) |
| Auth | Custom, browser-only (`src/services/local/`) |
| Tests | Vitest |

> **Note on templates:** template components use **inline styles**, not Tailwind classes. This keeps them immune to Tailwind purging and guarantees the print pipeline renders correct colours and typography.

> **Note on this build:** there is no server-side data layer. Everything is client-rendered after hydration, which is why the "no flicker" approach is a skeleton rather than a server-rendered signed-in state.

---

## Getting started

### 1. Prerequisites

- Node.js 20+
- npm (the repo ships an `.npmrc` with `legacy-peer-deps=true`)

That is the whole list. There is no database, no API keys and no third-party account to create.

### 2. Install

```bash
npm install
```

### 3. Run the dev server

```bash
npm run dev
```

The `dev` script regenerates the template registry first, then starts Next.js. Open <http://localhost:3000>.

> **No environment variables are needed.** There is no `.env.local` in this build, and nothing to configure before the app works.

> **Smoke test:** sign up → you are signed in straight away → `/dashboard`. Create a CV, edit it, refresh the page and your changes are still there. Sign out → sign in again.

---

## Where your data lives

CV Maker has no server, so all data is stored **in the visitor's own browser**:

| What | Where | Key / store | Notes |
| --- | --- | --- | --- |
| Accounts (hashed passwords) | `localStorage` | `cvforge_users` | `{ id, fullName, email, passwordHash, salt, createdAt }` |
| Session | `localStorage` (or `sessionStorage`) | `cvforge_session` | `{ userId, expiresAt }`. "Keep me signed in" writes it to `localStorage` for 30 days; otherwise it lives in `sessionStorage` and ends with the tab. |
| CV documents | `localStorage` | `cvforge_cvs_<userId>` | Small JSON, keyed per user so two accounts in one browser never see each other's work. |
| Photos & avatars | IndexedDB | `cvforge` database | Large base64 blobs live here so a single photo cannot blow the localStorage quota. |
| Contact messages | `localStorage` | `cvforge_contact_messages` | Last 50 messages, kept only as a local draft before the `mailto:` handoff. |

Local storage is a *single origin* space. "Signing in" on another device, or in another browser, will not find your CVs — that is what the **Export backup** button on the dashboard is for. Import the JSON file on the new device and everything comes back.

### Passwords

Passwords are hashed with **PBKDF2-SHA-256** (210,000 iterations, 256-bit key, per-user 16-byte random salt) using the Web Crypto API, and only the derived hash is ever written to storage.

This protects against casual inspection of `localStorage` — it is **not** a defence against someone with access to the device, who can read and modify the whole store. Do not reuse an important password here.

### Storage limits

`localStorage` holds roughly 5 MB per origin. The dashboard shows a live usage meter and warns once you pass 80%. When the store is genuinely full, saving fails with a clear message instead of silently losing edits, and the editor keeps your changes in memory so you can export a backup and free space.

---

## Authentication

Custom, entirely client-side, session-based auth. There is no email service and no OAuth.

### Flows

| Flow | Route | Notes |
| --- | --- | --- |
| Sign up | `/signup` → `/dashboard` | Full name, email, password (min 6), confirm password. Duplicate emails get a friendly message. You are signed in immediately — there is no verification step. |
| Log in | `/login` → `next` or `/dashboard` | Show/hide password and "Keep me signed in". A wrong password and an unknown email produce the *same* message, so the form cannot be used to discover which emails have accounts. |
| Forgot password | `/forgot-password` | A three-step inline flow (request → reset → done). Since there is no mail server, the reset happens in the browser. |
| Log out | navbar menu, `/logout` | Clears the session and redirects to `/login`. |
| Delete account | `/settings` | Requires your password, then removes the account, its CVs and its stored photos. |

### How it fits together

- **Everything goes through two interfaces.** `AuthService` and `CvRepository` are defined in [`src/services/types.ts`](./src/services/types.ts) and implemented for the browser in [`src/services/local/`](./src/services/local/). UI code imports the ready-made instances from [`src/services/index.ts`](./src/services/index.ts) and never touches `localStorage` directly.
- **Route protection is client-side.** A browser-only app cannot protect routes in middleware, because the server never sees `localStorage`. [`ProtectedRoute`](./src/components/auth/protected-route.tsx) wraps the `(chrome)` and `editor` layouts: unauthenticated visitors are sent to `/login?next=<original path>` and returned there after signing in. `GuestOnlyRoute` does the inverse for `/login` and `/signup`.
- **No hydration mismatch.** The session is only read inside `useEffect`, so the server and the first client render agree. While `isLoading`, protected content shows a skeleton and the navbar shows a neutral placeholder — never the wrong menu.
- **Redirect safety.** `next` is honoured only when it is a same-origin relative path (`safeNext()` in [`src/lib/auth-validation.ts`](./src/lib/auth-validation.ts)), so `/login?next=https://evil.com` cannot be used as an open redirect.
- **Cross-tab sync.** The `AuthProvider` listens for the `storage` event, so signing out in one tab signs you out in the others.
- **Auto-save** in the editor is debounced ~1s and writes through `CvRepository.update`, showing "Saving… / Saved". A full store is reported with its own message and stops auto-retrying.

### Testing the flows

1. **Signup → dashboard.** Sign up and you land on `/dashboard`, already signed in.
2. **Refresh keeps the session.** Reload any protected page and stay signed in.
3. **Logout → login.** Use the avatar menu → **Sign out** → you land on `/login`.
4. **Wrong password.** Log in with a bad password → a single "Email or password is incorrect" message, with no raw error.
5. **Duplicate email.** Sign up twice with the same address → a friendly "account already exists" message.
6. **Create → edit → autosave → reload.** Create a CV, type into it, watch "Saved", then reload — your changes persist.
7. **Two accounts, one browser.** Sign out, create a second account and check the dashboard: you only ever see that account's CVs.
8. **PDF download.** Open a CV → **Download PDF** → the print route opens with the A4 page and the browser's print dialog, proposing `FullName_CV.pdf`.
9. **Backup round-trip.** Export a backup from the dashboard, sign in as a different account and import it — the CVs are copied across.

---

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Regenerate the template registry, then start the dev server |
| `npm run build` | Regenerate the registry (`prebuild`) and build for production |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Run the Vitest suite once |
| `npm run test:watch` | Vitest in watch mode |
| `npm run templates:registry` | Regenerate `manifest.ts`, `registry.ts` and `registry.client.ts` |
| `npm run templates:scaffold` | Generate any missing templates from the archetype definitions, then regenerate the registry |
| `npm run thumbnails` | Screenshot every template into `public/thumbnails/<slug>.webp` |
| `npm run thumbnails:force` | Same, but regenerate images that already exist |
| `npm run build:thumbnails` | Build, then regenerate every thumbnail against the production server |

### Generating thumbnails

Template cards show a real screenshot of the template, not a shared placeholder.
The stills are captured from `/preview/<slug>` — the same component the editor
and print route render — so a card can never show a different design's artwork.

Thumbnails need a running server and a Chromium binary:

```bash
npm i -D playwright
npx playwright install chromium

npm run dev          # terminal 1
npm run thumbnails   # terminal 2
```

`npm run thumbnails` skips images that already exist; pass `--force` (or use
`npm run thumbnails:force`) after changing a template's layout. Point the script
at another origin with `THUMBNAIL_BASE_URL=https://example.com`.

**If a thumbnail is missing, nothing breaks.** `TemplateThumbnail` falls back to
rendering the template's real component scaled into the card, so a new template
looks correct the moment it is created — it is simply slower than a still. The
fallback only mounts once the card scrolls into view.

---

## Rendering behaviour

Worth knowing before changing anything in the gallery or editor:

- **Template artwork is per-template.** `TemplateThumbnail` prefers
  `public/thumbnails/<slug>.webp` and falls back to a live scaled render of the
  template component. There is no shared placeholder image anywhere.
- **The dashboard previews your own CV.** Passing `data` to `TemplateThumbnail`
  renders that content live through the real template component — there is no
  stored image of a user's CV, and a sample render would be misleading. Cards
  therefore always show what will actually print.
- **Live previews measure their card.** A `ResizeObserver` feeds the real
  container width into the A4 scale, so the sheet fits exactly at any breakpoint
  instead of drifting at a hardcoded size.
- **Cards are memoised.** `TemplateCard` is wrapped in `React.memo` and receives
  only stable props: the template object from the registry, a `href` string
  computed once per list, and handler references that never change identity.
  Handlers are created with `useCallback` in the picker, never inline in `map`.
  The dashboard's `CVCard` follows the same rule, because each card embeds a
  live render and the grid re-renders on every search keystroke.
- **Selection lives outside the grid.** Hovering or selecting a template writes
  to a small Zustand store (`src/lib/store/template-selection.ts`). Each card
  subscribes to its own id via a boolean selector, so interacting with one card
  re-renders that card only — not the grid, and not the other 59 cards.
- **No entrance animation on the grid.** Cards used to be wrapped in a
  `motion.div` with `initial`/`animate`, which re-ran on every parent render and
  read as "the gallery reloaded". There is no per-card animation now.
- **Template code is code-split.** `registry.client.ts` creates one
  `next/dynamic` component per template, cached by id so its identity is stable
  (a fresh component type on each render would remount and re-fetch the chunk).
  The gallery itself never imports template components.
- **Switching templates in the editor swaps only the preview.** `CVRenderer` is
  keyed by `templateId` and wrapped in `PreviewGuard` (error boundary +
  Suspense skeleton), so form state and the rest of the editor stay mounted.
- **Verify with the Profiler.** In React DevTools, record while hovering and
  selecting a card: only that card and (on selection) the preview should appear
  in the commit list.

---

## Project structure

```
src/
  app/
    (site)/            Public marketing, legal, blog and contact pages
    (auth)/            Signup, login, forgot-password, logout
    (app)/
      (chrome)/        Dashboard, template picker, settings (with the site shell)
      editor/          Full-bleed CV editor
    print/[cvId]/      Dedicated print / Save-as-PDF route
    preview/[slug]/    Chrome-free A4 render of one template (thumbnail source)
  components/
    auth/              ProtectedRoute, GuestOnlyRoute, skeletons
    editor/            Editor panels (topbar, preview, appearance, data tools…)
    providers/         AuthProvider (session context) and ToastProvider
    templates/         CV renderer, memoised card, thumbnail, preview guard
    ui/                Buttons, fields, modal, skeletons, toasts…
    layout/            Navbar, footer, site shell
  content/blog/        Markdown blog posts
  lib/
    cv/                CVData Zod schema, defaults, formatting, sample personas
    editor/            Zustand editor store + auto-save hook
    store/             UI state kept out of React (template selection)
  services/
    types.ts           AuthService / CvRepository / PhotoStore interfaces
    index.ts           The single swap point — names the concrete instances
    local/             Browser implementations: crypto, storage, auth, cvs, photos
  templates/
    _kit/              Shared, print-safe template primitives (inline styles)
    <slug>/            One folder per template: config.ts + index.tsx
    registry*.ts       Auto-generated — do not edit by hand
public/thumbnails/     Generated per-template stills (committed)
scripts/               Registry generator, thumbnail capture, template scaffolder
```

---

## Adding a template

A template is just a folder under `src/templates/<slug>/` containing two files.

### 1. Create the folder

```
src/templates/my-template/
  config.ts
  index.tsx
```

The folder name **is** the template id, so it must be kebab-case (`my-template`).

### 2. `config.ts`

```ts
import { SECTION_KEYS } from "@/lib/cv/schema";
import { fontsFor } from "../_kit/fonts";
import type { TemplateConfig } from "@/templates/types";

export const config: TemplateConfig = {
  id: "my-template",            // must equal the folder name
  name: "My Template",
  category: "Modern",           // Modern | Creative | Minimal | Professional | Tech | Academic | Executive
  thumbnail: null,              // null → the registry draws an SVG preview from `preview`
  defaultAccent: "#0ea5e9",
  accentOptions: ["#0ea5e9", "#6366f1", "#10b981", "#f43f5e"],
  fonts: fontsFor("inter", "dmsans", "source"),   // ids from src/templates/_kit/fonts.ts
  supportedSections: [...SECTION_KEYS],           // or filter some out
  extraFields: [
    { key: "showPhoto", label: "Show photo", type: "toggle" },
  ],
  hasPhoto: true,
  description: "One or two sentences shown in the templates gallery.",
  preview: { header: "split", sidebar: "left", photo: true, photoShape: "circle", density: "normal", accentRule: "underline" },
};
```

`extraFields` defines template-specific controls; their values live under `data.extra.<key>` and are written by the editor's extras form without clobbering other templates' data.

### 3. `index.tsx`

```tsx
import { config } from "./config";
import { createTheme } from "../_kit/theme";
import { pickFont } from "../_kit/fonts";
import { fullName } from "../_kit/helpers";
import { SectionBlock, type SectionStyleOptions } from "../_kit/sections";
import { Sheet } from "../_kit/primitives";
import type { TemplateProps } from "../types";

export { config };

export function Template({ data }: TemplateProps) {
  const theme = createTheme(data, { font: pickFont(data.settings.font, config.fonts) });
  const personal = data.personal;
  const options: SectionStyleOptions = { titleVariant: "underline", entryLayout: "row" };

  return (
    <Sheet theme={theme} style={{ padding: "14mm 15mm" }}>
      <h1 style={{ margin: 0 }}>{fullName(personal) || "Your Name"}</h1>
      <SectionBlock data={data} section="summary" theme={theme} options={options} />
      <SectionBlock data={data} section="experience" theme={theme} options={options} />
      <SectionBlock data={data} section="education" theme={theme} options={options} />
    </Sheet>
  );
}
```

The shared `_kit` provides everything you need: `Sheet`, `SheetSection`, `SectionBlock`, `SectionContent`, `SectionStack`, `Entry`, `InfoRows`, `BulletList`, `ContactBlock`, `ContactList`, `Chip`, `Photo`, `SkillBars`, `SkillDots`, `SkillChips`, `SkillColumns`, `DefinitionRows`, `Icon`. Use **inline styles** for anything custom so it survives the print pipeline.

### 4. Regenerate the registry

```bash
npm run templates:registry
```

This scans `src/templates/*` and rewrites `manifest.ts`, `registry.ts` (server, static imports) and `registry.client.ts` (client, code-split dynamic imports). That's it — the template appears in the gallery, the picker and the editor automatically. (This also runs automatically on `dev` and `build`, so you can't forget it.)

### Scaffolding many templates at once

To generate templates from the archetype definitions in `scripts/template-archetypes.mjs`:

```bash
npm run templates:scaffold
```

It creates a folder for every archetype that doesn't exist yet, then regenerates the registry. Existing templates are never overwritten.

---

## Deploying to Vercel

Because there is no backend, deploying is just "build the Next.js app".

1. **Push the repo** to GitHub/GitLab/Bitbucket.
2. **Import the project** in [Vercel](https://vercel.com/new). Next.js is detected automatically; no build settings need changing (`npm run build` is correct).
3. **Deploy.** There are **no environment variables to add** — skip this step entirely.
4. **Verify.** Sign up on the production URL, create a CV, and reload the page. Everything should behave exactly as it does locally.

Any static host works equally well: `npm run build && npm run start` on your own infrastructure, Netlify, Cloudflare Pages, GitHub Pages (with `output: "export"`, though the dynamic `/editor/[cvId]` and `/print/[cvId]` routes would need adjusting), or even a folder on a USB stick.

> **Data is per-origin.** Visitors on `https://your-app.vercel.app` get their own fresh browser storage. If you later move to a custom domain, their old data stays behind on the old origin — which is exactly why the dashboard has an export/import backup.

---

## Adding a backend later

The whole point of the service layer is that this is a small, contained job.

1. Implement `AuthService` and `CvRepository` (and optionally `PhotoStore`) from [`src/services/types.ts`](./src/services/types.ts) — for example `src/services/supabase/auth-service.ts` and `src/services/supabase/cv-repository.ts`. The interfaces cover: signup, login, logout, the current user, profile updates, password changes, account deletion, and per-user CV create/read/list/update/duplicate/remove/export/import.
2. Point [`src/services/index.ts`](./src/services/index.ts) at your new classes. That file is the **single swap point** — it is the only place the concrete implementations are named.
3. Migrate existing browser data in if you want it: `cvRepository.exportAll(userId)` gives you a JSON bundle whose shape (`{ version, exportedAt, cvs }`) is a natural import format for a server-side table.

Because no UI component imports `localStorage` directly, nothing else needs to change. The route guards would want to move back into middleware once cookies exist — `ProtectedRoute` and `GuestOnlyRoute` can stay as a first-line check or be removed.

---

## Security notes

- **No secrets exist in this codebase.** Nothing is read from the environment and nothing is hardcoded, because there is nothing to authenticate.
- **Passwords are never stored in plain text.** They are salted and stretched with PBKDF2-SHA-256 (210,000 iterations) via the Web Crypto API; see [`src/services/local/crypto.ts`](./src/services/local/crypto.ts). This is protection against casual inspection, not against someone with access to the device.
- **Accounts are isolated by key.** CVs are stored under `cvforge_cvs_<userId>`, and every repository method takes the `userId` and refuses to read another user's record.
- **No account enumeration.** A wrong password and an unknown email return the identical error message. The one deliberate exception is password reset, which must tell you the address is unknown — otherwise the flow could not work at all without an email service.
- **The contact form has no server.** It validates the input, keeps a local copy and hands the visitor a pre-filled `mailto:` link, which is stated plainly on the form.
- **Redirects are same-origin only** (`safeNext()`), so `?next=` cannot be used as an open redirect.

---

## License

Private project. All rights reserved.
