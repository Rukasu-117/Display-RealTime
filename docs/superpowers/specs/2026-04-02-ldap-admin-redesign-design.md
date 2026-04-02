# LDAP Admin Redesign Design

## Goal

Remodel the administrative interface to be visually very close to the `riopae-zenith-core` reference while preserving the current application architecture, keeping only the existing menus, maintaining LDAP authentication, and persisting a minimum operational user record in the database.

## Scope

This design covers:

- administrative shell redesign for existing `/admin/displays/**` routes
- login redesign aligned with the reference visual language
- LDAP-backed authentication for all admin pages and admin APIs
- 4-hour administrative session lifetime
- authenticated user menu and logout entrypoint in the admin shell
- minimum operational persistence of LDAP-authenticated users in Prisma

This design does not cover:

- new admin modules beyond the existing displays flow
- changes to the public player information architecture
- role-based access control beyond authenticated vs unauthenticated
- audit logging beyond storing user login metadata

## Constraints

- Keep Next.js App Router and server-first route composition.
- Preserve the separation between admin surfaces and the public player.
- Preserve existing behavior for:
  - `Visualizar` -> `/display/[id]`
  - `Abrir preview` -> `/admin/displays/[id]/preview`
  - upload, reorder, delete, and duration update flows
- Keep `/display/**`, `/api/display/**`, and `/api/file/**` public.
- Avoid broad runtime changes in `DisplayClient`.
- Reuse existing component patterns from `AGENTS.md`.

## Desired Outcome

The app should feel like the same product family as `riopae-zenith-core`, but adapted to this project's real scope and architecture. The result should look polished and enterprise-grade without importing irrelevant modules or forcing a different app architecture.

## Reference Interpretation

The `riopae-zenith-core` reference contributes:

- a more mature enterprise shell
- stronger sidebar hierarchy
- topbar with user controls
- richer surface styling and spacing
- more polished motion and iconography
- a more premium login experience

The implementation should borrow those visual and interaction patterns, not its unrelated routes, state model, or menu tree.

## Navigation Simplification

- The current admin sidebar should expose a single persistent navigation item: `Displays`.
- `Novo Display` remains an in-page action inside the displays listing screen and should not exist as a separate sidebar entry.
- The shell must still be structured for future menu growth, but the current visible navigation stays intentionally minimal.

## Architecture

### Overall pattern

- `src/app/**` remains route composition and server data fetching.
- `src/components/ui/**` remains the home for domain-agnostic admin shell pieces.
- `src/components/admin/displays/**` remains the home for displays feature components.
- `src/components/auth/**` remains the home for login-specific UI.
- `src/lib/auth/**` remains the home for auth, redirect, and user sync infrastructure.

### Auth flow

1. Unauthenticated request to `/admin/**` hits middleware.
2. Middleware redirects to `/login?callbackUrl=...`.
3. Login submits LDAP credentials through NextAuth credentials provider.
4. LDAP validation succeeds.
5. User is upserted into Prisma with minimum operational fields.
6. Session JWT is created with 4-hour lifetime.
7. User is redirected back to sanitized callback URL.
8. Admin shell reads session data and exposes user menu + logout.

### API protection

- `/api/admin/**` remains protected by middleware and returns `401` without session.
- No page-local duplication should be introduced unless there is a route-specific authorization rule later.

## Data Model Changes

Add a persisted user model for LDAP-backed administrative users.

### Proposed Prisma model

```prisma
model AdminUser {
  id          String   @id @default(uuid())
  username    String   @unique
  displayName String
  email       String?
  lastLoginAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Notes

- `username` is the stable LDAP identifier for now.
- `displayName` should default to the best available user-facing identity.
- `email` is optional because not every LDAP response may expose it immediately.
- `lastLoginAt` supports minimum operational tracking.

## LDAP User Sync

### Behavior

On every successful LDAP login:

- upsert the user in Prisma using `username`
- update `displayName`
- update `email` if available
- set `lastLoginAt` to `now()`

### Placement

- create a dedicated helper in `src/lib/auth/user-sync.ts`
- do not embed Prisma upsert logic directly inside visual login components

### Failure behavior

- if LDAP auth fails, user sync should not run
- if LDAP auth succeeds but user sync fails, fail the sign-in and log the issue clearly
- this keeps the persisted record trustworthy and avoids partially authenticated admin sessions

## Login Redesign

### Goals

- Keep the current LDAP flow functional.
- Move visual fidelity much closer to `riopae-zenith-core`.
- Keep the login page compatible with callback redirects and friendly errors.

### Layout structure

- decorative background layer
- branded left hero/info panel on larger screens
- premium login card on the right
- responsive single-column fallback on smaller screens

### UI characteristics

- enterprise dark/blue visual base
- stronger glow and layered background treatment
- more faithful card composition
- refined typography hierarchy
- eye toggle for password visibility
- better loading state
- polished error state

### Motion

- use subtle entrance animation for hero/card
- use restrained background motion for glows or decorative elements
- avoid excessive animation that distracts from credential entry

### Libraries

Add:

- `lucide-react` for icons
- `framer-motion` for controlled, reference-like motion

Do not bring the full shadcn ecosystem or unrelated reference dependencies.

## Admin Shell Redesign

### Goals

- Reduce the current visible navigation to a single persistent item: `Displays`.
- Make the shell visually faithful to the reference.
- Prepare for future admin growth without changing route structure again.

### Structure

- sidebar
- topbar
- main content canvas

### Sidebar

- stronger branding block
- compact but polished nav treatment
- active state consistent with reference language
- support future grouped nav sections without requiring refactor
- render only the `Displays` entry for the current scope

### Topbar

- page context on the left
- authenticated user area on the right
- dropdown user menu
- logout action in the menu

### Content surfaces

- refine panels/cards/list rows to sit naturally inside the new shell
- keep current displays components, but align spacing and styling to the new shell

## User Menu and Logout

### Requirements

- visible on authenticated admin pages
- display current user's name
- offer logout action

### Behavior

- logout should terminate the NextAuth session cleanly
- after logout, redirect to `/login`

### Placement

- new shared UI component in `src/components/ui/user-menu.tsx`
- composed by a new `src/components/ui/admin-topbar.tsx`

## Route and Component Changes

### New or updated auth files

- `src/lib/auth/ad.ts`
- `src/lib/auth/config.ts`
- `src/lib/auth/redirect.ts`
- `src/lib/auth/user-sync.ts`
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/middleware.ts`

### New or updated login files

- `src/app/login/page.tsx`
- `src/components/auth/LoginForm.tsx`
- `src/components/auth/login-shell.tsx`
- `src/components/auth/login-hero.tsx`
- `src/components/auth/login-card.tsx`

### New or updated shell files

- `src/components/ui/admin-page-shell.tsx`
- `src/components/ui/admin-topbar.tsx`
- `src/components/ui/user-menu.tsx`
- optionally `src/components/ui/admin-nav-section.tsx`

### Displays pages that will be visually adapted

- `src/app/admin/displays/page.tsx`
- `src/app/admin/displays/new/page.tsx`
- `src/app/admin/displays/[id]/page.tsx`
- `src/app/admin/displays/[id]/contents/page.tsx`
- `src/app/admin/displays/[id]/preview/page.tsx`

### Database files

- `prisma/schema.prisma`
- new migration

## Implementation Phases

### Phase 1 - Persisted LDAP users

- add Prisma model for admin users
- create migration
- add user sync helper
- wire sync into successful auth flow

### Phase 2 - Shared admin shell redesign

- redesign `AdminPageShell`
- add topbar and user menu
- wire logout
- preserve current route composition pattern

### Phase 3 - Login redesign

- refine auth visual components to align more closely with reference
- add icons and motion
- keep callback-safe login flow intact

### Phase 4 - Displays page adaptation

- recompose displays pages into the upgraded shell
- tune spacing and surfaces to match new shell
- keep domain functionality unchanged

### Phase 5 - Verification and polish

- test real LDAP login
- validate redirect/logout behavior
- validate displays CRUD and preview flows
- compare visual fidelity against reference

## Error Handling

### Login failures

- invalid LDAP credentials -> stay on login page with friendly message
- LDAP connectivity error -> still show generic safe error in UI, log more precise server detail
- user sync error -> deny login, log server-side reason

### Session failures

- expired session -> redirect to login again for admin pages
- expired session on admin API -> `401`

## Testing Strategy

### Required verification

- `npx tsc --noEmit`
- `npm run build`

### Manual and Playwright validation

- unauthenticated access to `/admin/displays` redirects to `/login?callbackUrl=...`
- unauthenticated access to `/api/admin/display` returns `401`
- successful LDAP login reaches original callback URL
- logout returns user to login and blocks admin pages again
- public `/display/[displayId]` remains accessible
- displays listing, create, edit, contents, and preview remain functional
- login and admin shell look visually aligned with the reference

### Database validation

- first login creates `AdminUser`
- later login updates `lastLoginAt`
- username uniqueness is enforced

## Risks

### Visual risk

- chasing the reference too literally could overfit irrelevant patterns

Mitigation:
- copy the visual language, not the full product structure

### Functional risk

- admin shell refactor could disturb existing action buttons and page composition

Mitigation:
- keep domain feature components intact and refactor shell first

### Auth risk

- LDAP auth and DB sync together can introduce new login failure points

Mitigation:
- isolate sync logic, add debug logging, verify with real credential before finishing

### Scope risk

- introducing too many new libraries can blur the current project pattern

Mitigation:
- limit additions to `lucide-react` and `framer-motion`

## Non-Goals

- broad RBAC/permission system
- new admin dashboard modules
- migration to the reference project's routing or state architecture
- changes to public display runtime design language

## Success Criteria

- admin pages and APIs remain LDAP-protected
- session remains 4 hours
- login becomes visually much closer to `riopae-zenith-core`
- admin shell becomes visually closer to the reference and ready for future growth
- user menu and logout work correctly
- LDAP users are persisted minimally in Prisma
- displays workflows continue working without regression
