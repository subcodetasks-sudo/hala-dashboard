<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AI Agent Guidelines for Hala Dashboard

Welcome to the **Hala Dashboard** repository. This document outlines project conventions, key architecture patterns, and guidelines for AI agents working in this codebase.

---

## 🛠 Tech Stack Overview

- **Framework**: [Next.js](https://nextjs.org/) (App Router, dynamic i18n routing under `app/[locale]`)
- **UI & Styling**: [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/) (`@base-ui/react`, Radix UI primitives, Lucide icons)
- **State Management & Data Fetching**: [TanStack React Query v5](https://tanstack.com/query)
- **Forms & Validation**: `react-hook-form`, `@hookform/resolvers`, `zod`
- **Internationalization**: `next-intl` (supporting localized routes and translations in `messages/`)
- **Backend / Authentication**: Firebase (`firebase`)

---

## 📁 Repository Structure

```
hala-dashboard/
├── app/                  # Next.js App Router root
│   ├── [locale]/        # Localized app routes (pages, layouts)
│   ├── api/             # API routes
│   └── globals.css      # Global styles & Tailwind CSS v4 directives
├── components/          # Shared & UI components (Shadcn UI elements)
├── features/            # Feature-sliced modules and business domain logic
├── hooks/               # Custom reusable React hooks
├── i18n/                # Internationalization configuration & helpers
├── lib/                 # Core utilities, API clients, and Firebase config
├── messages/            # Translation dictionary files (en.json, ar.json, etc.)
└── proxy.ts             # Route proxying / middleware handling
```

---

## ⚡ Agent Rules & Conventions

### 1. Code Style & TypeScript
- Use **TypeScript** strictly. Avoid `any` types wherever possible.
- Prefer functional components and custom hooks.
- Use explicit return types on utility functions and API handlers.

### 2. Architecture & Organization
- Keep business logic inside the `features/` directory structured by domain.
- Reserve `components/` for reusable, decoupled UI elements (e.g., buttons, dialogs, inputs).
- Reusable state and side-effects should live in `hooks/`.

### 3. Internationalization (`next-intl`)
- All user-facing strings must use `next-intl` dictionary keys.
- Add or update keys in `messages/` when introducing new UI copy.

### 4. Data Fetching & State
- Use **TanStack React Query** for server state management and asynchronous data fetching.
- Form handling should leverage `react-hook-form` paired with `zod` schema validation.

### 5. Verification & Quality Assurance
- After implementing fixes or new features, verify that the application compiles without errors (`npm run build` or `npm run lint`).
- Ensure no broken routes or broken i18n translation references are introduced.
