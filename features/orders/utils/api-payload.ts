function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toFiniteNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return undefined;
}

/**
 * Reads a collection out of an API `data` field. List endpoints return a
 * paginator (`{ data: [...] }`), option endpoints return a bare array.
 */
export function extractCollection(
  data: unknown,
  keys: readonly string[] = ["data", "lists"],
): unknown[] {
  if (Array.isArray(data)) {
    return data;
  }

  if (!isRecord(data)) {
    return [];
  }

  for (const key of keys) {
    const nested = data[key];
    if (Array.isArray(nested)) {
      return nested;
    }
  }

  return [];
}

export type PaginationMeta = {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

/**
 * Reads Laravel-style pagination fields from a list payload.
 * Supports paginator objects, nested `meta`, and top-level `meta`.
 */
export function extractPaginationMeta(
  data: unknown,
  options: {
    fallbackPage?: number;
    fallbackPerPage?: number;
    itemCount?: number;
    topLevelMeta?: unknown;
  } = {},
): PaginationMeta {
  const fallbackPage = options.fallbackPage ?? 1;
  const fallbackPerPage = options.fallbackPerPage ?? 10;
  const itemCount = options.itemCount ?? 0;

  const sources: Record<string, unknown>[] = [];

  if (isRecord(data)) {
    sources.push(data);
    if (isRecord(data.meta)) {
      sources.push(data.meta);
    }
  }

  if (isRecord(options.topLevelMeta)) {
    sources.push(options.topLevelMeta);
  }

  const read = (key: string) => {
    for (const source of sources) {
      const value = toFiniteNumber(source[key]);
      if (value != null) {
        return value;
      }
    }
    return undefined;
  };

  const perPage = read("per_page") ?? fallbackPerPage;
  const currentPage = read("current_page") ?? fallbackPage;
  const total = read("total") ?? itemCount;
  const explicitLastPage = read("last_page");

  let lastPage =
    explicitLastPage ??
    Math.max(1, Math.ceil(total / Math.max(perPage, 1)));

  // If the API omitted totals but returned a full page, assume another page exists.
  if (explicitLastPage == null && total === itemCount && itemCount >= perPage) {
    lastPage = Math.max(lastPage, currentPage + 1);
  }

  return {
    currentPage,
    lastPage: Math.max(1, lastPage),
    perPage,
    total,
  };
}

/** Reads a string field from an unknown record, trying each key in order. */
export function readStringField(
  entry: unknown,
  keys: readonly string[],
): string | undefined {
  if (!isRecord(entry)) {
    return undefined;
  }

  for (const key of keys) {
    const value = entry[key];
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return undefined;
}
