# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A contact management application built with Next.js 16 (App Router), React 19, and Supabase. Users register with email verification, then manage contacts (CRUD) with image uploads. Includes an admin dashboard with a modern violet-themed UI.

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
- **Database**: Supabase (PostgreSQL with RLS)
- **Auth**: Supabase Auth with email verification via SendGrid
- **Storage**: Supabase Storage (`contact-images` bucket)

### API Routes

All API routes use App Router route handlers at `src/app/api/`:
- `api/contacts/` — CRUD for contacts (auth required)
- `api/users/` — User management + registration
- `api/verify/[verificationId]/` — Email verification
- `api/upload/` — Image uploads (auth required)

Shared auth helper: `src/lib/auth.ts` (getUserFromAuth, response helpers)

### Authentication Flow

1. User registers → Supabase creates auth user → app inserts `contact_users` table row → SendGrid sends verification email
2. User clicks verification link → `/verify` page confirms → `contact_users.verified` set to true
3. On login, checks `verified` status and `admin_users` table for role detection
4. `AuthContext` (`src/contexts/AuthContext.tsx`) provides `useAuth()` hook with `user`, `session`, `userType`, `signIn`, `signOut`
5. `v3Api` axios instance (`src/config/v3Api.config.ts`) auto-attaches Bearer tokens and handles 401 refresh

### Data Layer

- **Supabase** is the sole database (managed PostgreSQL with Row Level Security)
- Tables: `contact_users`, `contacts`, `admin_users`
- RLS enforces per-user contact isolation
- File uploads go to Supabase Storage
- Types defined in `src/config/supabase.config.ts`

### API Client Pattern

`src/config/v3Api.config.ts` exports typed wrappers: `contactsApi`, `usersApi`, `uploadApi`. Components use these instead of raw axios/fetch.

### Component Architecture

- `src/components/ui/` — Reusable UI primitives (Button, Input, Select, Badge, Card, Avatar, Modal, SlideOver, Toast, Spinner, EmptyState)
- `src/components/layout/` — Dashboard layout (Sidebar, TopBar, DashboardLayout)
- `src/components/contacts/` — Contact features (ContactCard, ContactForm, ContactGrid)
- `src/components/admin/` — Admin features (UserTable)
- `src/components/auth/` — Auth forms (LoginForm, RegisterForm)

### Key Directories

- `src/app/` — Pages, layouts, and API route handlers
- `src/components/` — Organized by feature (ui/, layout/, contacts/, admin/, auth/)
- `src/contexts/` — React Context (auth state)
- `src/config/` — Supabase client, API client
- `src/lib/` — Auth helpers, Zod validations, SendGrid mailer
- `.claude/agents/` — Custom agent prompts for security, code review, architecture, UI review

### Design System

- **Colors**: slate-50 background, white surfaces, violet-600 primary accent, emerald-500 success, rose-500 danger
- **Typography**: Inter (body, `font-sans`), DM Sans (headings, `font-display`)
- **Layout**: Sidebar navigation (collapsible on mobile) + main content area

## Code Style

- **Prettier**: single quotes, no semicolons, Tailwind class sorting plugin
- **TypeScript**: strict mode, target ES2022, path alias `@/*` → `./src/*`
- **Components**: server components by default; add `"use client"` only when using hooks/events/browser APIs
- **Styling**: Tailwind CSS 4 (CSS-native config in `globals.css`, no JS config file)
- **ESLint**: flat config format (`eslint.config.mjs`)

## Environment Variables

Required (set in `.env.local`):
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase client
- `SENDGRID_API_KEY`, `FROM_EMAIL` — email verification
- `NEXT_PUBLIC_BASE_URL` — base URL for verification links
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase admin operations (user deletion)
