import { routing } from "@/i18n/routing";

type QueryValue = string | number | boolean | null | undefined;
type QueryParams = Record<string, QueryValue | QueryValue[]>;

export type ApiLocale = (typeof routing.locales)[number];

export type ApiRequestOptions = Omit<RequestInit, "body" | "method"> & {
  params?: QueryParams;
  /** JSON-serializable body, or FormData / Blob / string when needed */
  body?: unknown;
  /** Overrides Accept-Language (`ar` | `en`). Defaults to the active app locale. */
  locale?: ApiLocale;
};

export class ApiError extends Error {
  readonly status: number;
  readonly statusText: string;
  readonly data: unknown;

  constructor(status: number, statusText: string, data: unknown) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof (data as { message: unknown }).message === "string"
        ? (data as { message: string }).message
        : `Request failed with status ${status}`;

    super(message);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

/** Normalize any Accept-Language / locale string to `ar` or `en`. */
export function normalizeApiLocale(
  value: string | null | undefined,
): ApiLocale {
  if (!value) {
    return routing.defaultLocale;
  }

  const primary = value.split(",")[0]?.trim().toLowerCase() ?? "";

  if (primary.startsWith("en")) {
    return "en";
  }

  if (primary.startsWith("ar")) {
    return "ar";
  }

  return routing.defaultLocale;
}

async function resolveLocale(explicit?: ApiLocale): Promise<ApiLocale> {
  if (explicit === "ar" || explicit === "en") {
    return explicit;
  }

  try {
    if (typeof window === "undefined") {
      const { getLocale } = await import("next-intl/server");
      return normalizeApiLocale(await getLocale());
    }

    return normalizeApiLocale(document.documentElement.lang);
  } catch {
    return routing.defaultLocale;
  }
}

function getBaseUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }

  return baseUrl.replace(/\/+$/, "");
}

function buildUrl(path: string, params?: QueryParams) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${getBaseUrl()}${normalizedPath}`);

  if (!params) {
    return url.toString();
  }

  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) {
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        if (item !== null && item !== undefined) {
          url.searchParams.append(key, String(item));
        }
      }
      continue;
    }

    url.searchParams.set(key, String(value));
  }

  return url.toString();
}

function isBodyInit(body: unknown): body is BodyInit {
  return (
    typeof body === "string" ||
    body instanceof Blob ||
    body instanceof FormData ||
    body instanceof URLSearchParams ||
    body instanceof ArrayBuffer ||
    ArrayBuffer.isView(body)
  );
}

async function parseResponseBody(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return undefined;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text.length > 0 ? text : undefined;
}

async function request<T>(
  method: string,
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { params, body, headers, locale: localeOption, ...rest } = options;
  const url = buildUrl(path, params);

  const finalHeaders = new Headers(headers);
  const locale = await resolveLocale(localeOption);

  let resolvedBody: BodyInit | undefined;

  if (body !== undefined && body !== null) {
    if (isBodyInit(body)) {
      resolvedBody = body;
      // Let the browser set multipart boundary for FormData
    } else {
      if (!finalHeaders.has("Content-Type")) {
        finalHeaders.set("Content-Type", "application/json");
      }
      resolvedBody = JSON.stringify(body);
    }
  }

  if (!finalHeaders.has("Accept")) {
    finalHeaders.set("Accept", "application/json");
  }

  if (!finalHeaders.has("Accept-Language")) {
    finalHeaders.set("Accept-Language", locale);
  }

  const response = await fetch(url, {
    method,
    headers: finalHeaders,
    body: resolvedBody,
    ...rest,
  });

  const data = await parseResponseBody(response);

  if (response.status === 401) {
    await logoutOnUnauthorized();
  }

  if (!response.ok) {
    throw new ApiError(response.status, response.statusText, data);
  }

  return data as T;
}

/** Clears the local session when the backend rejects the auth token. */
async function logoutOnUnauthorized() {
  if (typeof window !== "undefined") {
    return;
  }

  try {
    const { clearAuthCookies } = await import("@/features/auth/lib/session");
    await clearAuthCookies();
  } catch (error) {
    console.error("Failed to clear auth cookies after 401:", error);
  }
}

export const api = {
  get<T>(path: string, options?: ApiRequestOptions) {
    return request<T>("GET", path, options);
  },

  post<T>(path: string, options?: ApiRequestOptions) {
    return request<T>("POST", path, options);
  },

  put<T>(path: string, options?: ApiRequestOptions) {
    return request<T>("PUT", path, options);
  },

  patch<T>(path: string, options?: ApiRequestOptions) {
    return request<T>("PATCH", path, options);
  },

  delete<T>(path: string, options?: ApiRequestOptions) {
    return request<T>("DELETE", path, options);
  },
};
