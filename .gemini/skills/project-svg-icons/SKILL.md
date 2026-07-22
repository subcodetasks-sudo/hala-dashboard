---
name: project-svg-icons
description: >-
  Uses CustomIcon from components/custom-svg.tsx with SVGs from public/svg for
  any UI that needs icons; falls back to lucide-react when no project SVG
  matches. Use when creating or updating UI, components, layouts, dashboards,
  navbars, sidebars, buttons, menus, empty states, or any interface that
  includes icons, icon buttons, or decorative glyphs.
---

# Project SVG Icons

## Rule

For **any** UI create/update that includes icons:

1. **Search** `public/svg/` for an existing `.svg` (list the folder; do not rely on memory).
2. If a project SVG matches (or a close match exists), **render** it with `CustomIcon` from `@/components/custom-svg` (default export).
3. **Prefer project SVGs** — do not default to Lucide/`next/image`/inline SVG/`<img>` when a project SVG exists or a close match is available.
4. If **no** icon in `public/svg/` fits, **fall back to `lucide-react`** (already a project dependency). Do not invent a `/svg/...` path. Do not add a new file under `public/svg/` unless the user asks for a custom asset.

## Component (project SVG)

```tsx
import CustomIcon from "@/components/custom-svg";

<CustomIcon src="/svg/home.svg" size={20} className="text-brand-primary" />
```

| Prop | Notes |
|------|--------|
| `src` | Public path, e.g. `/svg/name.svg` |
| `size` | Uniform px size (default `24`). Overridden by `width` / `height` |
| `width` / `height` | Optional; number or CSS length |
| `className` | Prefer Tailwind `text-*` for color (`currentColor` is injected onto fills/strokes) |
| `color` | Optional inline color; prefer `className` |
| `title` / `aria-label` | For meaningful icons; omit for decorative |

Multi-color logos (e.g. `/logo.svg`) stay as `next/image` or `<img>` — `CustomIcon` recolors fills/strokes to `currentColor`.

## Fallback (`lucide-react`)

Use only after confirming nothing suitable exists in `public/svg/`:

```tsx
import { Settings } from "lucide-react";

<Settings className="size-5 text-brand-gris" strokeWidth={1.75} />
```

- Import the named icon from `lucide-react`.
- Size/color via Tailwind (`size-*`, `text-*`) to match surrounding UI; keep `strokeWidth` consistent with nearby Lucide usage when present.
- Do not wrap Lucide icons in `CustomIcon`.

## Search workflow

Before writing icon JSX:

```bash
# list icons
ls public/svg/*.svg

# find by name/meaning
rg -l -i "home|user|receipt|search" public/svg
```

1. Pick by **filename meaning**, not by inventing a path. Paths are always `/svg/<filename>.svg`.
2. If the search finds nothing usable → import from `lucide-react`.

## Snapshot catalog

Re-list `public/svg` if this looks stale:

| File | Typical use |
|------|-------------|
| `home.svg` | Home / dashboard |
| `search.svg` | Search |
| `notification.svg` | Notifications / bell |
| `person.svg` | Account / profile |
| `profile-2user.svg` | Users / employees / people group |
| `profile-tick.svg` | Permissions / verified user |
| `receipt-item.svg` | New orders / document list |
| `receipt-2.svg` | Invoices / receipt |
| `check.svg` | Document / pending-style list |
| `refresh-2.svg` | Refresh / verification / refunds |
| `dollar-circle.svg` | Payment |
| `shield-tick.svg` | Completed / success shield |
| `forbidden-2.svg` | Cancelled / blocked |
| `tag-2.svg` | Tracking / tags |
| `brush.svg` | Content management / edit |
| `logout.svg` | Log out |
| `export.svg` | Export / external |

## Checklist

- [ ] Listed or searched `public/svg` in this session
- [ ] Used `CustomIcon` with `/svg/...` when a project SVG matched
- [ ] Fell back to `lucide-react` only when nothing in `public/svg/` fit
- [ ] Colored via `text-*` / brand utilities, not hardcoded SVG fills in JSX
- [ ] Did not invent a missing `/svg/...` path
