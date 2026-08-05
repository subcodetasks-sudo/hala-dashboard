import {
  getAuthToken,
  getAuthTokenType,
} from "@/features/auth/lib/session";
import type { SupportSubmissionsListResponse } from "@/features/content-management/types";
import {
  legalBackendBasePath,
  parseLegalPageKind,
} from "@/features/content-management/utils/legal-page";
import { ApiError, api, normalizeApiLocale } from "@/lib/api";
import arMessages from "@/messages/ar.json";
import enMessages from "@/messages/en.json";

type RouteContext = {
  params: Promise<{ page: string }>;
};

function getRouteMessages(locale: ReturnType<typeof normalizeApiLocale>) {
  return (locale === "en" ? enMessages : arMessages).ContentManagement.route;
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

export async function GET(request: Request, context: RouteContext) {
  const locale = normalizeApiLocale(request.headers.get("accept-language"));
  const t = getRouteMessages(locale);
  const { page: pageParam } = await context.params;
  const page = parseLegalPageKind(pageParam);

  if (page !== "support") {
    return Response.json(
      { success: false, message: t.invalidLegalPage },
      { status: 400 },
    );
  }

  const token = await getAuthToken();
  const tokenType = await getAuthTokenType();

  if (!token) {
    return Response.json(
      { success: false, message: t.unauthorized },
      { status: 401 },
    );
  }

  try {
    const result = await api.get<SupportSubmissionsListResponse>(
      `${legalBackendBasePath(page)}/submissions`,
      {
        locale,
        params: collectQueryParams(request.url),
        headers: {
          Authorization: `${tokenType} ${token}`,
        },
      },
    );

    return Response.json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return Response.json(
        {
          success: false,
          message: error.message || t.unableToFetchSupportSubmissions,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Support submissions fetch failed:", error);

    return Response.json(
      { success: false, message: t.unableToFetchSupportSubmissions },
      { status: 500 },
    );
  }
}
