# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A contact management application built with Next.js 16 (App Router), React 19, Clerk (auth), and Supabase (data). Users sign up via Clerk (built-in email verification), then manage contacts (CRUD) with image uploads. Includes an admin dashboard. Dark-first UI ("the network at night" design system).

## Commands

```bash
npm run dev       # Start dev server (port 3000)
npm run build     # Production build
npm run lint      # ESLint (flat config, extends next/core-web-vitals)
```

No test framework is configured.

## Architecture

### Tech Stack

- **Frontend**: Next.js 16.1, React 19, TypeScript, Tailwind CSS 4
- **Forms**: React Hook Form + Zod (validation schemas in `src/lib/validations.ts`)
- **UI**: Headless UI v2, Heroicons, clsx
- **Backend**: App Router route handlers (`src/app/api/`)
- **Auth**: Clerk (`@clerk/nextjs`, prebuilt SignIn/SignUp/UserButton, themed via `src/lib/clerk-appearance.ts`)
- **Database**: Shared Supabase project; this app owns the **`contacts` Postgres schema** (RLS on Clerk JWTs)
- **Storage**: Supabase Storage (`addressbook-contact-images` bucket)

### Auth Model

- `src/proxy.ts` runs `clerkMiddleware()`: public routes are `/`, `/sign-in`, `/sign-up`; everything else requires a session; `/admin(.*)` and `GET /api/users` additionally require the admin role.
- Admin role lives in Clerk `publicMetadata.role === 'admin'`, surfaced in session claims via the Clerk dashboard session-token customization (`{ "metadata": "{{user.public_metadata}}" }`). Typed in `src/types/globals.d.ts`.
- Server helpers in `src/lib/auth.ts`: `requireUser()`, `requireAdmin()` + JSON response helpers.
- No users table: admin user management (list, ban/unban as "status", edit name, delete) calls Clerk's Backend API (`clerkClient`), mapped to the UI shape in `src/lib/clerk-users.ts`.
- On user deletion, the route cleans up the user's `contacts` rows and storage folder with the secret-key client.

### Data Layer

- `src/lib/supabase.ts`: `createServerSupabaseClient()` — per-request client with `db: { schema: 'contacts' }` and `accessToken: () => (await auth()).getToken()` (Supabase third-party auth, native Clerk integration — NOT the deprecated JWT template). `createAdminSupabaseClient()` — secret key (RLS bypass), only for deleted-user cleanup.
- One table: `contacts.contacts` (`user_id TEXT` = Clerk user ID; `UNIQUE (user_id, phone)`; `updated_at` trigger).
- RLS policies compare `(SELECT auth.jwt()->>'sub')` to `user_id`. Clerk user IDs are TEXT (`user_...`), never UUIDs.
- Migration: `supabase/migrations/*_addressbook_contacts_schema.sql` — idempotent and namespaced for the shared project (app-prefixed storage policies, no `public` schema objects).
- Types in `src/types/database.ts` (`Contact`, `ContactInsert`, `ContactUpdate`).

### API Routes

All API routes use App Router route handlers at `src/app/api/`:
- `api/contacts/` + `api/contacts/[contactId]/` — CRUD, scoped by `user_id` (defense-in-depth on top of RLS)
- `api/users/` — GET admin list (Clerk Backend API)
- `api/users/[userId]/` — GET self-or-admin, PATCH ban/unban (admin), PUT name (self-or-admin), DELETE (admin + data cleanup)
- `api/upload/` — image uploads to `addressbook-contact-images/{userId}/`

### API Client Pattern

`src/lib/api.ts` exports fetch-based wrappers: `contactsApi`, `usersApi`, `uploadApi`. Auth rides on the Clerk session cookie — no token handling. Errors throw `Error(message)`.

### Component Architecture

- `src/components/ui/` — Primitives (Button, Input, Select, Badge, Card, Avatar, Modal [generic] + ConfirmModal [default export], SlideOver, ToastProvider/useToast, Spinner, EmptyState, Logo)
- `src/components/layout/` — Dashboard shell (Sidebar, TopBar, DashboardLayout with page-glow/dot-grid décor)
- `src/components/contacts/` — Contact features (ContactCard, ContactForm, ContactGrid)
- `src/components/admin/` — Admin features (UserTable)
- `src/components/landing/` — Landing page hero (HeroCards)

### Design System ("the network at night")

- Dark-first. All tokens in `src/app/globals.css` `@theme`: violet-tinted near-black surfaces (`bg`, `surface`, `surface-2/3`), low-alpha `edge` borders, `fg`/`fg-muted`/`fg-subtle` text, `primary` (violet) with `accent-2` (fuchsia) gradient pair, dark-tuned semantic colors, glow shadow tokens, `fade-up`/`toast-in` keyframes.
- Custom utilities: `page-glow`, `dot-grid`, `text-gradient`. Gradient is rationed: logo, hero headline span, sidebar active bar, primary-button glow.
- Glass (backdrop-blur) only on floating layers (TopBar, Modal, SlideOver, toasts, mobile drawer); cards are solid `surface`.
- **Typography**: Inter (body, `font-sans`), Bricolage Grotesque (display, `font-display`).
- Clerk components inherit the theme from `<ClerkProvider appearance={clerkAppearance}>` in the root layout — keep `src/lib/clerk-appearance.ts` hex values in sync with `globals.css` tokens.

## Code Style

- **Prettier**: single quotes, no semicolons, Tailwind class sorting plugin
- **TypeScript**: strict mode, target ES2022, path alias `@/*` → `./src/*`
- **Components**: server components by default; add `"use client"` only when using hooks/events/browser APIs
- **Styling**: Tailwind CSS 4 (CSS-native config in `globals.css`, no JS config file)
- **ESLint**: flat config format (`eslint.config.mjs`)

## Environment Variables

Required (set in `.env.local`, see `.env.example`):
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` — Clerk
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`, `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/contact-lists`, `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/contact-lists`
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (`sb_publishable_...`) — shared Supabase project
- `SUPABASE_SECRET_KEY` (`sb_secret_...`) — deleted-user data cleanup only

Uses the new Supabase API keys — the legacy anon/service_role JWT keys are deprecated. (The Postgres roles `anon`/`authenticated`/`service_role` in the migration SQL are unrelated and still current: the publishable key maps to `anon`, the secret key to `service_role`.)

## Manual Dashboard Setup (once per environment)

1. Clerk: enable Email+Password, activate the Supabase integration (adds `role: "authenticated"` claim), customize session token with `{ "metadata": "{{user.public_metadata}}" }`, set the first admin's `publicMetadata` to `{ "role": "admin" }`.
2. Supabase: add Clerk under Authentication → Third-Party Auth; add `contacts` to Settings → API → Exposed schemas; apply the migration.
