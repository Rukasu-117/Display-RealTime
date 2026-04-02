# AGENTS

## Project Snapshot

- Framework: Next.js 14 App Router with React 18 and TypeScript strict mode.
- Styling: Tailwind CSS plus global CSS in `src/app/globals.css`.
- Data layer: Prisma with PostgreSQL.
- Auth: NextAuth credentials provider backed by LDAP via `ldapjs`.
- Realtime: admin mutations emit events through `src/lib/ws.ts`; display clients listen through the separate `ws-server` process.
- Test tooling available: Playwright and `@playwright/mcp`.

## Global Application Pattern

- Treat the app as two separate surfaces:
  - admin app under `/admin/**`
  - public player under `/display/[displayId]`
- All admin pages and admin APIs now require LDAP-backed authentication.
- Admin sessions last 4 hours; after that, users must authenticate again.
- The admin can be restyled and reorganized, but the public player is runtime-sensitive and should remain isolated.
- Keep `page.tsx` files server-first; fetch data there and pass props to feature components.
- Use client components only where browser APIs, form state, navigation, upload, reorder, confirm dialogs, or imperative refresh logic are required.
- Preserve current behavior unless explicitly refactoring it:
  - `router.push`
  - `router.refresh`
  - `window.location.reload()`
  - `window.confirm()`
- CRUD that changes player output must continue to emit WS events.

## Global Styling Pattern

- Global tokens live in `src/app/globals.css`.
- Fonts are registered in `src/app/layout.tsx` using `Inter` as body and `Space Grotesk` as heading.
- Admin UI uses these tokens from Pencil:
  - `--color-page`
  - `--color-sidebar`
  - `--color-surface`
  - `--color-surface-alt`
  - `--color-border`
  - `--color-accent`
  - `--color-accent-hover`
  - `--color-text`
  - `--color-text-muted`
  - `--color-text-soft`
- Public runtime is protected by `.display-runtime` in `src/app/globals.css`; keep fullscreen and black-background behavior there rather than on `body`.
- If adding new global tokens, prefer extending the existing variable set instead of hardcoding colors repeatedly.

## Domain Model

### Display

- `id: string`
- `name: string`
- `rotation: number`
- `aspectRatio: string`
- `createdAt: Date`
- `updatedAt: Date`

### Content

- `id: string`
- `displayId: string`
- `type: "image" | "video" | "pdf"`
- `filePath: string`
- `order: number`
- `duration: number | null`

## Folder-By-Folder Rules

### `src/app/`

- Contains route entrypoints, global layout, and route-local server composition only.
- Do not accumulate repeated UI markup in route files.
- Thin route wrappers are acceptable while migrating, but new work should target shared components under `src/components`.

#### `src/app/layout.tsx`

- Owns metadata and global font registration.
- Update this file only for true application-wide concerns.

#### `src/app/globals.css`

- Owns root tokens, element resets, and the `.display-runtime` utility.
- Be careful: global changes can still affect admin and public player at the same time.

#### `src/app/admin/displays/**`

- These routes are now composition layers for the displays admin flow.
- Current pages:
  - `src/app/admin/displays/page.tsx` -> listing
  - `src/app/admin/displays/new/page.tsx` -> create
  - `src/app/admin/displays/[id]/page.tsx` -> edit
  - `src/app/admin/displays/[id]/contents/page.tsx` -> content management
  - `src/app/admin/displays/[id]/preview/page.tsx` -> admin embedded preview
- Pattern:
  - fetch with Prisma in the page
  - render `AdminPageShell`
  - render `PageHeader`
  - render feature components from `src/components/admin/displays`
- Navigation rule:
  - sidebar currently exposes only `Displays`
  - `Novo Display` lives as an in-page action, not a persistent sidebar item
- These routes are protected by `src/middleware.ts`; do not add duplicate page-local auth unless intentionally layering authorization.
- Important behavior rules:
  - `Visualizar` from list items still opens `/display/[id]`
  - `Abrir preview` from contents opens `/admin/displays/[id]/preview`
  - admin preview embeds the real player with an `iframe`; do not replace it with a custom player clone unless intentionally refactoring runtime behavior

#### `src/app/display/[displayId]/**`

- Public player route.
- `src/app/display/[displayId]/page.tsx` fetches `DisplayWithContents` and renders `DisplayClient`.
- `src/app/display/[displayId]/DisplayClient.tsx` owns:
  - rotation handling
  - timed playback
  - WS subscription
  - refresh after content/display changes
- This area is runtime-sensitive. Avoid coupling admin UI concerns here.

#### `src/app/login/**`

- Administrative sign-in entrypoint.
- `src/app/login/page.tsx` is server-first and redirects authenticated users back to their safe callback URL.
- Keep this page public even when `/admin/**` is protected.
- Login visual language follows the Pencil-selected layout, but must remain compatible with the actual LDAP credential flow.

#### `src/app/api/**`

- API handlers write to Prisma and often emit WS events or invalidate caches.
- Keep handlers small and explicit.
- Existing important handlers:
  - `src/app/api/admin/display/route.ts` -> create display
  - `src/app/api/admin/display/[id]/route.ts` -> update/delete display
  - `src/app/api/admin/display/[id]/content/route.ts` -> create/list content for a display
  - `src/app/api/admin/display/[id]/content/reorder/route.ts` -> reorder contents
  - `src/app/api/admin/content/[contentId]/route.ts` -> update duration/delete content
  - `src/app/api/admin/upload/route.ts` -> file upload
  - `src/app/api/display/[displayId]/route.ts` -> public display payload
  - `src/app/api/file/[...path]/route.ts` -> serves uploaded files
  - `src/app/api/ws/route.ts` -> related WS access
- If a mutation affects playback, make sure the matching WS event is still emitted.
- `src/app/api/admin/**` is protected by middleware and should be treated as authenticated-only surface.
- `src/app/api/display/**` and `src/app/api/file/**` remain public-facing for the player runtime.

### `src/components/`

- Shared React components live here.
- Prefer adding new work here instead of duplicating route-local JSX.

#### `src/components/auth/`

- Authentication-specific UI lives here.
- Current components:
  - `LoginForm.tsx`
  - `login-shell.tsx`
  - `login-hero.tsx`
  - `login-card.tsx`
- Responsibility breakdown:
  - `LoginForm.tsx` owns credential submit flow, inline errors, loading state, and callback redirect handling
  - `login-shell.tsx` owns the full-screen login composition and decorative background structure
  - `login-hero.tsx` owns the institutional/marketing side of the login screen
  - `login-card.tsx` owns the translucent card container around the form
- Rules:
  - keep LDAP/auth logic out of purely visual auth components
  - keep callback URL sanitization in shared auth helpers, not inline in multiple components
  - prefer Tailwind + global CSS animations before introducing heavy animation libraries

#### `src/components/ui/`

- Generic UI primitives only.
- Current primitives:
  - `admin-page-shell.tsx`
  - `admin-topbar.tsx`
  - `user-menu.tsx`
  - `page-header.tsx`
  - `button.tsx`
  - `confirm-action-button.tsx`
  - `empty-state.tsx`
- Form primitives live in `src/components/ui/form/`:
  - `text-field.tsx`
  - `select-field.tsx`
  - `submit-button.tsx`
- Rules:
  - keep these domain-agnostic
  - use variants and props before creating new button components
  - pass actions/content via props or children, not hardcoded route logic

#### `src/components/admin/displays/`

- Feature components specific to the displays admin area.
- Current components:
  - `display-form.tsx`
  - `display-fields.tsx`
  - `display-identity-card.tsx`
  - `displays-list.tsx`
  - `display-list-item.tsx`
  - `display-actions.tsx`
  - `content-upload-form.tsx`
  - `content-playlist.tsx`
  - `content-playlist-item.tsx`
  - `duration-field.tsx`
  - `reorder-controls.tsx`
  - `media-type-badge.tsx`
  - `display-preview-frame.tsx`
- Responsibility breakdown:
  - `display-form.tsx` owns create/edit mutation flow via `mode`
  - `display-fields.tsx` owns only field rendering
  - `display-actions.tsx` owns list row actions and delete confirm
  - `content-upload-form.tsx` owns upload + create content flow
  - `content-playlist.tsx` owns reorder/remove/duration update orchestration
  - `duration-field.tsx` preserves the `name="duration"` semantics
  - `display-preview-frame.tsx` embeds the public player in admin preview pages
- Rules:
  - do not split create/edit into separate feature components when the fields are the same
  - preserve current fetch endpoints and browser behaviors unless intentionally refactoring
  - keep route strings in feature-level components only when the action is inherently feature-specific

### `src/types/`

- Shared domain types live here.
- Current files:
  - `src/types/display.ts`
  - `src/types/content.ts`
- Never redefine the same domain interfaces inside route-local files if they already exist here.

### `src/lib/`

- Cross-cutting infrastructure helpers live here.
- Current important files:
  - `src/lib/prisma.ts` -> Prisma singleton
  - `src/lib/ws.ts` -> admin-to-WS bridge emitter
  - `src/lib/auth/ad.ts` -> LDAP auth helper
  - `src/lib/auth/config.ts` -> shared NextAuth configuration and session policy
  - `src/lib/auth/redirect.ts` -> safe callback URL helpers for auth redirects
  - `src/lib/auth/user-sync.ts` -> persists LDAP-authenticated admin users into Prisma
- Rules:
  - keep infra helpers side-effect-focused and reusable
  - avoid pushing UI concerns into `src/lib`

### `prisma/`

- Source of truth for the database schema and migrations.
- `prisma/schema.prisma` defines the `Display`, `Content`, and `AdminUser` models.
- If new UI requires new persisted data, update Prisma first and then propagate to types, API handlers, and UI.

### `ws-server/`

- Separate Express + WS process for realtime display updates.
- `ws-server/server.js` maintains display rooms and broadcasts events.
- Do not casually change event names or connection behavior; the public player depends on this contract.

## Active Functional Flows

### Displays Listing

- Route: `/admin/displays`
- Fetches displays and content counts.
- Uses `DisplaysList` and `DisplayActions`.
- `Visualizar` goes directly to `/display/[id]`.

### LDAP Login

- Route: `/login`
- Uses the Pencil-inspired login shell and `LoginForm`.
- Accepts `callbackUrl` and redirects back after successful login.
- Invalid credentials stay on the same page with friendly error feedback.

### Admin Route Protection

- `src/middleware.ts` protects:
  - `/admin/**`
  - `/api/admin/**`
- Unauthenticated page access redirects to `/login?callbackUrl=...`
- Unauthenticated API access returns `401`
- Public display routes remain accessible without login

### Create Display

- Route: `/admin/displays/new`
- Uses shared `DisplayForm mode="create"`.
- On success: redirects to `/admin/displays` and refreshes.

### Edit Display

- Route: `/admin/displays/[id]`
- Uses shared `DisplayForm mode="edit"` plus `DisplayIdentityCard`.
- On success: redirects to `/admin/displays`.

### Content Management

- Route: `/admin/displays/[id]/contents`
- Uses `ContentUploadForm`, `ContentPlaylist`, `DisplayIdentityCard`.
- Current preserved behaviors:
  - upload in two steps
  - duration update through `name="duration"`
  - reorder through ordered ID array
  - delete with page reload

### Admin Preview

- Route: `/admin/displays/[id]/preview`
- Uses `DisplayPreviewFrame` and `DisplayIdentityCard`.
- Embeds `/display/[id]` in an `iframe`.
- Only the contents page preview action points here.
- This page is an admin wrapper, not a replacement for the real player.

### Public Player

- Route: `/display/[displayId]`
- Uses `DisplayClient`.
- Must continue to:
  - autoplay content
  - respect rotation
  - reload from WS-driven changes
- Must remain publicly accessible even after admin authentication changes.

## Component Recognition Rules

Before creating a new React component, inspect both the current code and the Pencil screens/components and normalize them into reusable pieces.

### Pencil Components Already Recognized

- `Component/Primary Button` -> primary button variant
- `Component/Secondary Button` -> secondary button variant
- `Component/Danger Button` -> destructive button variant
- `Component/Ghost Button` -> ghost/subtle button variant
- `Component/Text Field` -> labeled text/select field wrapper
- `Component/Display Row` -> display list row item
- `Component/Content Row` -> content playlist row item

### Screen Structures Already Recognized

- Admin shell: sidebar + main content area
- Page header: title + subtitle + optional action area
- Display listing card/container
- Display form card/container
- Content management summary/upload/list area
- Embedded admin preview page with display summary + preview surface

### Anti-Duplication Rules

- Do not create separate create/edit form components if the fields are the same; prefer a single component with `mode` and props.
- Do not keep route-local copies of the same domain interfaces; centralize shared types.
- Do not hardcode route strings inside low-level UI primitives; pass `href`s or callbacks from feature components.
- Do not create one-off buttons for each page; use variants of shared button components.
- Do not recreate the same shell/header/card markup across route files; extract shared UI components.
- Prefer composition and variants over near-duplicate files.
- If a preview can reuse the public runtime safely via `iframe`, prefer that over cloning player logic in admin.

## Current File Structure To Reuse

```text
src/
  app/
    admin/displays/
      page.tsx
      new/page.tsx
      [id]/page.tsx
      [id]/contents/page.tsx
      [id]/preview/page.tsx
    api/
      admin/**/route.ts
      display/[displayId]/route.ts
      file/[...path]/route.ts
    display/[displayId]/
      page.tsx
      DisplayClient.tsx
    globals.css
    layout.tsx

  components/
    ui/
      admin-page-shell.tsx
      page-header.tsx
      button.tsx
      confirm-action-button.tsx
      empty-state.tsx
      form/
        text-field.tsx
        select-field.tsx
        submit-button.tsx
    admin/displays/
      display-form.tsx
      display-fields.tsx
      display-identity-card.tsx
      displays-list.tsx
      display-list-item.tsx
      display-actions.tsx
      content-upload-form.tsx
      content-playlist.tsx
      content-playlist-item.tsx
      duration-field.tsx
      reorder-controls.tsx
      media-type-badge.tsx
      display-preview-frame.tsx

  lib/
    prisma.ts
    ws.ts
    auth/ad.ts

  types/
    display.ts
    content.ts
```

## How To Implement New Work Safely

### If adding a new admin screen

- Start in `src/app/.../page.tsx` as a server component.
- Compose with `AdminPageShell` and `PageHeader`.
- Add new feature UI under the narrowest folder in `src/components`.
- Reuse existing cards, buttons, and field components before creating new ones.
- New admin routes automatically fall under LDAP protection if they live under `/admin/**`; preserve that behavior.

### If changing authentication

- Keep LDAP validation centralized in `src/lib/auth/ad.ts`.
- Keep session policy centralized in `src/lib/auth/config.ts`.
- Keep callback URL sanitization centralized in `src/lib/auth/redirect.ts`.
- If protecting new administrative APIs, prefer extending middleware coverage over duplicating guards inside each handler.
- Do not accidentally protect `/display/**`, `/api/display/**`, or `/api/file/**`.

### If adding new display-related interactions

- First check whether the behavior belongs in:
  - `display-form.tsx`
  - `display-actions.tsx`
  - `content-upload-form.tsx`
  - `content-playlist.tsx`
- Keep semantic requirements stable, especially `name="duration"`.
- If the interaction changes player output, verify the matching API still emits WS events.

### If changing preview behavior

- Distinguish clearly between:
  - admin preview page
  - public player page
- Keep `Visualizar` for direct public player access unless product direction changes.
- Keep `Abrir preview` on contents as the admin preview entrypoint.

### If changing the public player

- Treat it as a high-risk area.
- Verify playback timer, websocket refresh, rotation, image/video/pdf rendering, and fullscreen behavior.
- Avoid introducing admin layout assumptions into `DisplayClient`.

### If adding new persisted fields

- Update `prisma/schema.prisma`
- create or run the migration
- update `src/types/*`
- update API handlers
- update admin forms and display payloads
- validate public player impact

## Validation Rules

- Always run `npx tsc --noEmit` after structural changes.
- Run `npm run build` after route/layout changes.
- Use Playwright smoke checks when admin interactions are touched.
- Re-validate login and auth redirect flows whenever `next-auth`, middleware, or `/login` changes.
- For displays-related work, validate all of these when relevant:
  - `/admin/displays`
  - `/admin/displays/new`
  - `/admin/displays/[id]`
  - `/admin/displays/[id]/contents`
  - `/admin/displays/[id]/preview`
  - `/display/[displayId]`
  - `/login`
  - `/api/admin/**` unauthenticated access

## Important Existing Constraints

- Several admin mutations rely on `router.push`, `router.refresh`, or `window.location.reload()`; preserve behavior until intentionally refactored.
- `duration-field.tsx` must preserve the form field named `duration`.
- `Visualizar` should continue opening `/display/[id]` directly.
- `Abrir preview` from contents should continue opening `/admin/displays/[id]/preview`.
- `/admin/**` and `/api/admin/**` must remain LDAP-protected.
- Login session duration is 4 hours.
- CRUD operations that affect display playback must continue emitting WS events.
- Avoid broad changes to auth or display runtime while restyling the admin flow.

## Working Rules For Future Agents

- Start by mapping requested UI to existing recognized components before adding files.
- If a requested element differs only by label, action, or color variant, reuse the component.
- If a requested element differs by behavior but not structure, prefer prop-driven composition.
- If a requested element introduces a truly new structure, add a new component under the narrowest correct scope.
- Keep the public display runtime isolated from admin redesign churn.
- Document new folder-level conventions in this file when introducing new patterns.
- Validate behavior with TypeScript, build, and Playwright whenever admin interactions are touched.
