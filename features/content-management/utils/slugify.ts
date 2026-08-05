/** Builds a URL-safe slug from an English title. */
export function slugifyFromEnglishTitle(title: string): string {
  return title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 120);
}

/** Converts API `YYYY-MM-DD HH:mm:ss` to `datetime-local` value. */
export function toDatetimeLocalValue(value: string | null | undefined): string {
  if (!value?.trim()) return "";
  const normalized = value.trim().replace(" ", "T");
  const match = normalized.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})/);
  return match?.[1] ?? "";
}

/** Converts `datetime-local` value to API `YYYY-MM-DD HH:mm:ss`. */
export function toApiPublishedAt(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(trimmed)) {
    const [date, time] = trimmed.split("T");
    const hhmm = time.slice(0, 5);
    return `${date} ${hhmm}:00`;
  }
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2})?$/.test(trimmed)) {
    return trimmed.length === 16 ? `${trimmed}:00` : trimmed;
  }
  return trimmed;
}
