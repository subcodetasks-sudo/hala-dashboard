function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
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
