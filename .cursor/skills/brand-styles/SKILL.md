---
name: brand-styles
description: >-
  Applies this project's brand color tokens from CSS variables prefixed with
  --brand- in app/globals.css. Use when building, restyling, or reviewing UI,
  components, layouts, dashboards, buttons, sidebars, charts, or any visual
  styling so colors stay on-brand.
---

# Brand Styles

## Source of truth

Always read `app/globals.css` before choosing colors. Use only CSS custom properties that start with `--brand-`. Do not invent brand colors or hardcode RGB/hex that duplicate those tokens.

If tokens were added or renamed in `globals.css`, prefer the file over any snapshot in this skill.

## Current `--brand-*` tokens

| Token | Role |
|-------|------|
| `--brand-primary` | Main brand / interactive (teal) |
| `--brand-accent` | Emphasis, alerts, CTAs (coral/red) |
| `--brand-black` | Strong text / high contrast |
| `--brand-white` | Light text / surfaces on dark |
| `--brand-success` | Positive / success states |
| `--brand-background` | Page / soft brand wash |
| `--brand-gris` | Secondary / muted text |

## Usage rules

1. **Tailwind (preferred)** — tokens are mapped in `@theme inline` as literal `--color-brand-*` values (not `var(--brand-*)`), so opacity modifiers work: `bg-brand-primary/60`, `text-brand-gris/80`.
2. **Raw CSS** — `color: var(--brand-primary)`, `background: var(--brand-background)`. For alpha in raw CSS use `rgb(from var(--brand-primary) r g b / 0.6)`.
3. **Keep tokens in sync** — when changing a brand color, update both `:root --brand-*` and `@theme inline --color-brand-*`.
4. **Do not** replace shadcn semantic tokens (`--primary`, `--muted`, etc.) globally unless the task asks to wire them to brand. For branded product UI, use `--brand-*` / `brand-*` utilities.
5. **Contrast** — text on `--brand-primary` / `--brand-accent` / `--brand-success` → `--brand-white`. Body text on `--brand-background` → `--brand-black` or `--brand-gris`. Avoid `brand-gris` on teal/primary surfaces (too low contrast).
6. If brand utilities seem missing in the browser, restart `next dev` so Tailwind regenerates CSS.

## Checklist before shipping UI

- [ ] Re-read `app/globals.css` for `--brand-*`
- [ ] No hardcoded brand RGB/hex that already exists as a token
- [ ] Accents and status colors map to the correct `--brand-*` role
- [ ] Contrast is readable on brand surfaces
