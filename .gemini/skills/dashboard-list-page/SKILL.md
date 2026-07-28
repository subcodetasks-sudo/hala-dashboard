---
name: dashboard-list-page
description: >-
  Creates dashboard list pages (orders, tables, filters, stats cards, row
  actions) using the features/ folder pattern with React Query, mock data,
  reusable @/components, and next-intl. Use when building a new dashboard
  page from a design, scaffolding app/[locale]/(dashboard)/.../page.tsx,
  or adding a feature slice like orders/verification, pending, processed.
---

# Dashboard List Page

Scaffold list pages the way `features/orders/verification` (and siblings
`new` / `pending` / `processed`) are built. Always also apply
`brand-styles` and `project-svg-icons`.

## Workflow

1. **Read a sibling page first** — copy structure from the closest existing
   list (e.g. `processed` → verification). Do not invent a new layout.
2. **Wire the route** — thin page that only renders the feature view.
3. **Add a feature slice** under `features/<domain>/<slice>/`.
4. **Types + query keys** in shared domain files.
5. **Mock + React Query** for list / indicators / mutations.
6. **View + filters + actions + badges** — UI only in components.
7. **i18n** — add `Orders.<Slice>` (or domain) keys in `messages/en.json`
   and `messages/ar.json` together.

## Folder layout

```
app/[locale]/(dashboard)/<domain>/<slice>/
  page.tsx                 # import FeatureView only
  loading.tsx              # keep/extend existing skeleton if present

features/<domain>/
  types/index.ts           # add Row + FilterValues (+ status unions)
  query-keys.ts            # add <slice>Keys (list, indicators, …)
  <slice>/
    mock-data.ts           # DEFAULT filters, rows, filterFn — NO UI fields
    queries/use-<slice>.ts # fetch + useQuery / useMutation
    components/
      <slice>-view.tsx
      <slice>-filters.tsx
      <slice>-*-actions.tsx
      <slice>-status-badge.tsx   # if multiple statuses
```

### Page stub

```tsx
import VerificationOrdersView from "@/features/orders/verification/components/verification-orders-view";

export default function VerificationOrdersPage() {
  return <VerificationOrdersView />;
}
```

## Separate UI from state

| Belongs in mock / query | Belongs in the view |
|---|---|
| Row fields, filter defaults | `INDICATOR_CARDS` (iconSrc, bgClassName, periodKey) |
| Indicator **numbers** + change % | Status badge colors / classNames |
| `filterFn(orders, filters)` | Empty-state icon path, column cell JSX |
| Mutation payloads | Action menu labels wired via `t(...)` |

Do **not** put `iconSrc`, `bgClassName`, `periodKey`, or Tailwind classes in
`mock-data.ts` or query return shapes meant for cards.

```tsx
// view — UI config
const INDICATOR_CARDS = [
  { key: "total", periodKey: "periodToday", iconSrc: "/svg/…", bgClassName: "bg-brand-primary/10" },
  // …
] as const;

// query — data only
{ total: number; awaitingContract: number; uploadedToday: number; change: string }
```

## React Query pattern

- Query keys: nest under domain keys, e.g. `verificationOrderKeys.list(filters)`.
- In-memory store + simulated delay is fine until a real API exists (see
  `use-orders.ts` / `use-verification-orders.ts`).
- Hooks to expose: list (`useX(filters)`), indicators (`useXIndicators()`),
  mutations that `invalidateQueries` for lists + indicators.
- View: draft filters vs applied filters; only pass **applied** into
  `useQuery`.

## Reuse `@/components` first

| UI need | Use |
|---|---|
| Stats cards | `InfoCard` |
| Table | `DataTable` + `EmptyTableState` |
| Search | `SearchBar` |
| Dates | `DateField` |
| Apply filters | `ConfirmFilterButton` |
| Icons | `CustomIcon` → `/svg/…` (see `project-svg-icons`) |
| Primitives | `Button`, `Badge`, `Avatar`, `Select`, `DropdownMenu` |

Match filter bar and row-action popup styling to an existing sibling
(rounded pill selects, coral apply button, teal action trigger that turns
accent when open).

## Date filter validation

Always wire `DateField` `minDate` / `maxDate` when two (or more) date
filters are chronologically related so users cannot pick an invalid range.
`DateField` disables out-of-range days in the calendar via those props.

| Pattern | Earlier field | Later field |
|---|---|---|
| From / to range | `maxDate={value.toDate}` | `minDate={value.fromDate}` |
| Related event dates (e.g. created → contract uploaded) | `maxDate={value.<later>}` | `minDate={value.<earlier>}` |

```tsx
<DateField
  label={t("filters.fromDate")}
  value={value.fromDate}
  valueAs="date"
  maxDate={value.toDate}
  onChange={(fromDate) =>
    onChange({
      ...value,
      fromDate: fromDate instanceof Date ? fromDate : undefined,
    })
  }
/>
<DateField
  label={t("filters.toDate")}
  value={value.toDate}
  valueAs="date"
  minDate={value.fromDate}
  onChange={(toDate) =>
    onChange({
      ...value,
      toDate: toDate instanceof Date ? toDate : undefined,
    })
  }
/>
```

Rules:

1. Pass `undefined` when the paired date is empty — do not invent a bound.
2. Keep `valueAs="date"` for filter bars (siblings use `Date`, not ISO).
3. Mirror the same bounds in `filterFn` when comparing ISO row fields
   (e.g. skip rows outside `fromIso`/`toIso`), but the picker bounds are
   what prevent bad input in the UI.
4. Standalone single-date filters need no `minDate`/`maxDate` unless the
   design implies a dependency on another field.

## Action popup

Three-row dropdown (RTL-friendly): icon + label + chevron.

- Container: white, `rounded-3xl`, soft shadow, `p-3`, `gap-2`
- Items: `rounded-2xl`, `bg-brand-primary/8`, bold `text-brand-dark-blue`
- Prefer project SVGs (`receipt-item`, `maximize`, …); Lucide only if none fit
- Update EN + AR labels to match the design copy exactly

## Status badges

Local badge component mapping status → brand/token classes + translated
label. Dot + text, `rounded-xl`, soft wash background.

## i18n checklist

Under the feature namespace include at least:

- `title`, `description`, `listTitle`, `manualOrder` (if in design)
- `indicators.*`, period keys (`periodToday`, `periodWeek`, …)
- `filters.*` (dates, search, status/type, apply, pickDate)
- `table.*` (columns, statuses, action menu strings)
- `empty.title`, `empty.description`

## Design → build rules

1. Prefer the **filled** design for columns/statuses; use empty-state art
   from the empty mock when provided.
2. RTL: indicator/filter order follows design (first array item = right).
3. Do not rebuild sidebar/navbar — dashboard layout already provides them.
4. Refresh control lives in the navbar unless the design puts an extra one
   in-page.

## Checklist

- [ ] Read closest sibling feature + its page
- [ ] Types + query keys updated
- [ ] `mock-data` has data only (no icon/bg/period UI)
- [ ] React Query list + indicators (+ mutations if needed)
- [ ] View owns indicator UI config and columns
- [ ] Filters / actions / badge reuse shared components
- [ ] Related date filters use `minDate` / `maxDate` (and `filterFn` bounds)
- [ ] EN + AR messages added
- [ ] `brand-styles` + `project-svg-icons` followed
- [ ] Page route is a thin view import
