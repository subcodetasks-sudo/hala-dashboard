/**
 * Turns API media paths into browser-loadable URLs.
 * Absolute (`http(s):`, `blob:`, `data:`) values are returned as-is.
 */
export function resolveMediaUrl(
  path: string | null | undefined,
): string | undefined {
  if (!path) return undefined;

  const trimmed = path.trim();
  if (!trimmed) return undefined;

  if (
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("data:") ||
    /^https?:\/\//i.test(trimmed)
  ) {
    return trimmed;
  }

  const apiBase = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");
  const origin = apiBase.replace(/\/api$/i, "");
  if (!origin) {
    return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  }

  const normalized = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${origin}${normalized}`;
}
