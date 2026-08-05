---
name: api-endpoint-wiring
description: >-
  Wires a backend API endpoint into the dashboard: types from the response,
  App Router proxy route using lib/api, client-side form/hook call, cookie
  session handling, and i18n error messages. Use when connecting a new API
  endpoint, adding a POST/PUT/PATCH/DELETE route handler, calling the backend
  from a feature, or wiring a form submission to an external API.
---

# API Endpoint Wiring

Connect backend endpoints to the dashboard through the shared `lib/api.ts`
helper. Never call `NEXT_PUBLIC_API_URL` directly from client components —
always go through an App Router route handler (`app/api/`).

## Architecture overview

```
Client component (form / hook)
  ↓  fetch("/api/...")
App Router route handler (app/api/.../route.ts)
  ↓  api.get / api.post / ... (lib/api.ts)
External backend (NEXT_PUBLIC_API_URL)
```

- **Client → App Route**: plain `fetch("/api/...")` with JSON body and
  `Accept-Language: ar|en` from `useLocale()`.
- **App Route → Backend**: uses `api.get/post/put/patch/delete` from
  `@/lib/api` which reads `NEXT_PUBLIC_API_URL` and always sends
  `Accept-Language` (`ar` or `en`).
- **Auth**: route handlers that need a token import helpers from
  `@/features/auth/lib/session` (server-only, uses `cookies()`).

## Workflow

### 1. Define types from the API response

Create or update `features/<domain>/types/index.ts` with the response shape.
Type every field from the backend JSON — do not use `any`.

```ts
// features/<domain>/types/index.ts
export type SomeItem = {
  id: number;
  name: string;
  // ... match the backend response fields
};

export type SomeItemResponse = {
  success: boolean;
  message: string;
  data: SomeItem;
};
```

### 2. Create the App Router route handler

Place it at `app/api/<domain>/<action>/route.ts`.

```ts
// app/api/<domain>/<action>/route.ts
import { api, ApiError, normalizeApiLocale } from "@/lib/api";
import type { SomeItemResponse } from "@/features/<domain>/types";
import arMessages from "@/messages/ar.json";
import enMessages from "@/messages/en.json";

export async function POST(request: Request) {
  const locale = normalizeApiLocale(request.headers.get("accept-language"));
  const t =
    (locale === "en" ? enMessages : arMessages).Feature.Namespace.route;

  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json(
      { success: false, message: t.invalidJson },
      { status: 400 },
    );
  }

  // Validate required fields
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) {
    return Response.json(
      { success: false, message: t.required },
      { status: 400 },
    );
  }

  try {
    const result = await api.post<SomeItemResponse>("/backend/endpoint", {
      locale,
      body: { name },
    });

    return Response.json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return Response.json(
        { success: false, message: error.message, data: error.data },
        { status: error.status || 500 },
      );
    }

    console.error("Request failed:", error);
    return Response.json(
      { success: false, message: t.unableToComplete },
      { status: 500 },
    );
  }
}
```

**Key rules for route handlers:**

- Read `Accept-Language` with `normalizeApiLocale(...)` and pass `locale`
  into every `api.*` call so the backend returns localized messages.
- Localize hard-coded route messages via `messages/en.json` +
  `messages/ar.json` (e.g. `Auth.Login.route.*`) — never hard-code English
  only.
- Parse body defensively — cast to unknown, then validate.
- Map camelCase client fields to the backend's naming convention in the
  `body` object (e.g. `idNumber` → `id_number`).
- Catch `ApiError` separately to forward the backend's status and message.
- Prefer the backend `error.message` (already localized via
  `Accept-Language`); fall back to a translated route message.

### 3. Add authenticated requests (when needed)

If the endpoint requires a Bearer token:

```ts
import { getAuthToken, getAuthTokenType } from "@/features/auth/lib/session";

// Inside the route handler, before calling api.*:
const token = await getAuthToken();
const tokenType = await getAuthTokenType();

if (!token) {
  return Response.json(
    { success: false, message: "Unauthorized" },
    { status: 401 },
  );
}

const result = await api.get<SomeResponse>("/protected/endpoint", {
  headers: {
    Authorization: `${tokenType} ${token}`,
  },
});
```

Session helpers live in `@/features/auth/lib/session` and use
`cookies()` from `next/headers` — they only work in server contexts
(route handlers, server components).

Cookie name constants live in `@/features/auth/lib/constants` — safe to
import anywhere including `proxy.ts`.

### 4. Wire the client component

From a `"use client"` component, call the local API route:

```ts
const locale = useLocale(); // "ar" | "en"

const response = await fetch("/api/<domain>/<action>", {
  method: "POST",
  headers: {
    Accept: "application/json",
    "Accept-Language": locale,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ name: values.name }),
});

const payload = await response.json().catch(() => null);

if (!response.ok || !payload?.success) {
  toast.error(payload?.message || t("errorToast"));
  return;
}

// Handle success
toast.success(t("successToast"));
router.replace("/");
router.refresh();
```

**Key rules for client calls:**

- Import `useRouter` from `@/i18n/navigation` (not from `next/navigation`).
- Always send `Accept-Language` from `useLocale()` so App Routes and the
  backend return messages in the active UI language.
- Always `.catch(() => null)` on `response.json()` — the response may not
  be JSON on network errors.
- Prefer the backend/route `payload.message` (localized); fall back to a
  translated toast key.
- Call `router.refresh()` after mutations that change server state.

### 5. Add i18n messages

Add toast keys and any route-handler fallback strings in both
`messages/en.json` and `messages/ar.json` under the feature namespace.
Always update both files together.

```json
"Feature": {
  "Action": {
    "errorToast": "...",
    "successToast": "...",
    "route": {
      "invalidJson": "...",
      "required": "...",
      "unableToComplete": "..."
    }
  }
}
```

## Using `lib/api.ts`

The shared helper at `@/lib/api` wraps native `fetch` around
`NEXT_PUBLIC_API_URL` and always sets `Accept-Language` to `ar` or `en`.

```ts
import { api, ApiError, normalizeApiLocale } from "@/lib/api";

// GET — Accept-Language is set automatically (or pass locale explicitly)
const items = await api.get<Item[]>("/items", {
  locale: "ar",
  params: { status: "active", page: 1 },
});

// POST with JSON body
const created = await api.post<ItemResponse>("/items", {
  locale,
  body: { name: "New" },
});

// PUT / PATCH / DELETE
await api.put<ItemResponse>("/items/1", { locale, body: { name: "Updated" } });
await api.patch<ItemResponse>("/items/1", { locale, body: { status: "done" } });
await api.delete<void>("/items/1", { locale });

// FormData (Content-Type set automatically)
const formData = new FormData();
formData.append("file", file);
await api.post<UploadResponse>("/upload", { locale, body: formData });
```

- Always sends `Accept-Language: ar|en` (explicit `locale` option, else
  active next-intl locale / `document.documentElement.lang`, else `ar`).
- In App Router handlers, prefer
  `locale: normalizeApiLocale(request.headers.get("accept-language"))`.
- Throws `ApiError` on non-2xx responses with `.status`, `.message`,
  `.data`.
- JSON bodies are auto-serialized; `FormData` is passed through.
- Query params support arrays: `{ ids: [1, 2] }` → `?ids=1&ids=2`.

## React Query integration

When fetching data for display (not form submissions), use React Query
hooks under a `queries/` folder:

```ts
// features/<domain>/<slice>/queries/use-items.ts
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function fetchItems(filters: ItemFilters) {
  return api.get<ItemsResponse>("/items", { params: filters });
}

export function useItems(filters: ItemFilters) {
  return useQuery({
    queryKey: itemKeys.list(filters),
    queryFn: () => fetchItems(filters),
  });
}
```

For authenticated queries, pass the token via a route handler the same
way — or call `api.get` from a server component and pass data as props.

### Where the hook file lives

Pick the folder from the **feature slice that owns the hook**, never from
the endpoint URL. Hooks hitting the same backend path routinely land in
different folders, and one folder holds hooks for many endpoints.

```
features/<domain>/queries/            # shared across the whole domain
features/<domain>/<slice>/queries/    # owned by a single slice
```

Put it in `features/<domain>/<slice>/queries/` when it only concerns that
slice:

| Hook | Folder |
|---|---|
| That slice's list or stats card data | `pending/queries/use-renewal-request-held-stats.ts` |
| A lookup only that slice's filters or badges read | `cancelled/queries/use-cancellation-reasons.ts` |
| A mutation only that slice's UI can trigger | `verification/queries/use-upload-final-contract.ts` |

Keep it in `features/<domain>/queries/` when:

- Two or more slices call it — e.g. `use-process-renewal-request.ts` is
  triggered from both `new` and `pending`.
- It feeds the shared detail view or shared components — `use-orders.ts`,
  `use-update-renewal-request-worker.ts`.
- It is a domain-wide lookup — `use-cities.ts`, `use-order-statuses.ts`,
  `use-passport-issue-places.ts`.
- It is the generic list each slice filters differently —
  `use-renewal-requests.ts`.

Two rules that survive the move:

1. **Query keys stay shared.** `features/<domain>/query-keys.ts` keeps
   every key (`orderKeys.renewalRequestHeldStats()`) even when the hook
   sits in a slice, so any slice can invalidate another slice's cache
   after a state transition.
2. **Re-export from the domain barrel.** `features/<domain>/queries/index.ts`
   re-exports slice hooks so cross-domain consumers import one path:

```ts
// features/orders/queries/index.ts
export * from "./use-renewal-requests";
export * from "../pending/queries/use-renewal-request-held-stats";
export * from "../verification/queries/use-upload-final-contract";
```

Name the file after the hook it exports (`use-hold-reasons.ts`), not after
the route it calls.

## Checklist

- [ ] Types created in `features/<domain>/types/index.ts`
- [ ] Hook placed by owning slice, not by endpoint URL — slice-only hooks
      in `features/<domain>/<slice>/queries/`, shared ones in
      `features/<domain>/queries/`
- [ ] Slice hooks re-exported from `features/<domain>/queries/index.ts`
      and their keys kept in `features/<domain>/query-keys.ts`
- [ ] Route handler at `app/api/<domain>/<action>/route.ts`
- [ ] Route handler uses `api.*` from `@/lib/api` (not raw `fetch`)
- [ ] Route handler passes `locale` from `Accept-Language`
- [ ] Route handler catches `ApiError` and forwards status/message
- [ ] Client calls `/api/...` (not `NEXT_PUBLIC_API_URL` directly)
- [ ] Client sends `Accept-Language` from `useLocale()`
- [ ] Client uses `useRouter` from `@/i18n/navigation`
- [ ] Error/success toast + route fallback messages added to EN + AR
- [ ] Auth token attached via session helpers when endpoint requires it
