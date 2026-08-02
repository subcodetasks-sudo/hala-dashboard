import {
  getAuthToken,
  getAuthTokenType,
} from "@/features/auth/lib/session";
import type { OrderListResponse } from "@/features/orders/types";
import { ApiError, api, normalizeApiLocale } from "@/lib/api";
import arMessages from "@/messages/ar.json";
import enMessages from "@/messages/en.json";

function getRouteMessages(locale: ReturnType<typeof normalizeApiLocale>) {
  return (locale === "en" ? enMessages : arMessages).Orders.route;
}

function collectQueryParams(requestUrl: string) {
  const params: Record<string, string> = {};
  const { searchParams } = new URL(requestUrl);

  for (const [key, value] of searchParams.entries()) {
    const trimmed = value.trim();
    if (trimmed) {
      params[key] = trimmed;
    }
  }

  return params;
}

export async function GET(request: Request) {
  const locale = normalizeApiLocale(request.headers.get("accept-language"));
  const t = getRouteMessages(locale);

  const token = await getAuthToken();
  const tokenType = await getAuthTokenType();

  if (!token) {
    return Response.json(
      { success: false, message: t.unauthorized },
      { status: 401 },
    );
  }

  try {
    const result = await api.get<
      OrderListResponse & {
        meta?: Record<string, unknown>;
      }
    >("/admin/renewal-requests", {
      locale,
      params: collectQueryParams(request.url),
      headers: {
        Authorization: `${tokenType} ${token}`,
      },
    });

    // Laravel Resource collections put items in `data` and totals in sibling `meta`.
    // Normalize that into our paginator shape so the client always gets last_page.
    if (Array.isArray(result.data) && result.meta) {
      return Response.json({
        success: true,
        message: result.message,
        data: {
          data: result.data,
          ...result.meta,
        },
      });
    }

    return Response.json({
      success: true,
      message: result.message,
      data: result.data,
      ...(result.meta ? { meta: result.meta } : {}),
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return Response.json(
        {
          success: false,
          message: error.message || t.unableToFetch,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Renewal requests fetch failed:", error);

    return Response.json(
      { success: false, message: t.unableToFetch },
      { status: 500 },
    );
  }
}

