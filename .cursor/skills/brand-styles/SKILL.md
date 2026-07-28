---
name: brand-styles
description: >-
  Applies this project's brand color tokens from CSS variables prefixed with
  --brand- in app/globals.css. Use when building, restyling, or reviewing UI,
  components, layouts, dashboards, buttons, sidebars, charts, or any visual
  styling so colors stay on-brand and no raw hex/rgb values duplicate a token.
---

# Brand Styles

## Source of truth

Always read `app/globals.css` before choosing colors. Use only CSS custom
properties that start with `--brand-`. Do **not** invent brand colors or
hardcode RGB/hex values that duplicate those tokens.

If tokens were added or renamed in `globals.css`, prefer the file over any
snapshot in this skill.

## Current `--brand-*` tokens

| CSS variable | Tailwind utility | Value | Role |
|---|---|---|---|
| `--brand-primary` | `brand-primary` | `rgb(68 150 171)` | Main brand / interactive teal |
| `--brand-accent` | `brand-accent` | `rgb(219 86 92)` | Emphasis, alerts, CTAs (coral/red) |
| `--brand-black` | `brand-black` | `rgb(20 20 20)` | Strong text / high contrast |
| `--brand-dark-blue` | `brand-dark-blue` | `rgb(0 49 66)` | Dark teal — section headings, dark surfaces |
| `--brand-white` | `brand-white` | `rgb(255 255 255)` | Light text / surfaces on dark |
| `--brand-success` | `brand-success` | `hsla(153, 66%, 31%, 1)` | Positive / success states |
| `--brand-success-light` | `brand-success-light` | `rgb(224 255 239)` | Soft success wash / badge bg |
| `--brand-light-yellow` | `brand-light-yellow` | `rgb(255 251 235)` | Soft warning / highlight wash |
| `--brand-warning` | `brand-warning` | `rgb(219 119 6)` | Warning / caution states |
| `--brand-background` | `brand-background` | `rgb(235 246 247)` | Page / soft brand wash, table header bg |
| `--brand-gris` | `brand-gris` | `rgb(120 120 120)` | Secondary / muted text |

## Hex → token mapping (common substitutions)

When reviewing existing code, replace these hard-coded values with tokens:

| Hard-coded value | Replace with |
|---|---|
| `#003143` / `rgb(0 49 66)` | `brand-dark-blue` |
| `#288296` / `rgb(40 130 150)` / `#0F6873` | `brand-dark-blue` (closest teal) or `brand-primary` |
| `#4496AB` / `rgb(68 150 171)` | `brand-primary` |
| `#DB565C` / `rgb(219 86 92)` | `brand-accent` |
| `#141414` / `rgb(20 20 20)` | `brand-black` |
| `#787878` / `rgb(120 120 120)` | `brand-gris` |
| `#21C45D` / `rgb(33 196 93)` | `brand-success` |
| `#E0FFEF` / `rgb(224 255 239)` | `brand-success-light` |
| `#FFFBEB` / `rgb(255 251 235)` | `brand-light-yellow` |
| `#EBF6F7` / `#E6F3F5` / `rgb(235 246 247)` | `brand-background` |
| `#FFFFFF` / `rgb(255 255 255)` | `brand-white` or `white` |

If a hex value is **not** in this table and has no brand semantic equivalent,
keep it as-is and leave a comment.

## Usage rules

1. **Tailwind (preferred)** — tokens are mapped in `@theme inline` as
   `--color-brand-*` so opacity modifiers work:
   `bg-brand-primary/60`, `text-brand-gris/80`, `border-brand-primary/10`.
2. **Raw CSS** — `color: var(--brand-primary)`. For alpha:
   `rgb(from var(--brand-primary) r g b / 0.6)`.
3. **No bare hex in JSX** — before writing any `#xxxxxx` or `rgb(…)` in a
   className, check the table above. Only use hex when no brand token covers
   the colour (e.g. a one-off status badge tint that is not part of the brand
   palette).
4. **Keep tokens in sync** — when changing a brand color, update both
   `:root --brand-*` and `@theme inline --color-brand-*` in `globals.css`.
5. **Do not** replace shadcn semantic tokens (`--primary`, `--muted`, etc.)
   globally unless the task specifically asks to wire them to brand. For
   product UI use `--brand-*` / `brand-*` utilities.
6. **Contrast** — text on `brand-primary` / `brand-accent` / `brand-success`
   → `brand-white`. Body text on `brand-background` → `brand-black` or
   `brand-gris`. Avoid `brand-gris` on teal/primary surfaces (too low contrast).
7. If brand utilities seem missing in the browser, restart `next dev` so
   Tailwind regenerates the CSS.

## Checklist before shipping UI

- [ ] Re-read `app/globals.css` for `--brand-*` tokens
- [ ] Grep the file for `#[0-9a-fA-F]` and `rgb(` — replace any that match the table above
- [ ] No hardcoded brand RGB/hex that already exists as a token
- [ ] Status / accent colors map to the correct `--brand-*` role
- [ ] Contrast is readable on every brand surface
