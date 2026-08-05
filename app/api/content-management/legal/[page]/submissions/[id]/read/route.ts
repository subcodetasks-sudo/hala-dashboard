import {
  getAuthToken,
  getAuthTokenType,
} from "@/features/auth/lib/session";
import type { SupportSubmissionMutationResponse } from "@/features/content-management/types";
import {
  legalBackendBasePath,
  parseLegalPageKind,
} from "@/features/content-management/utils/legal-page";
import { ApiError, api, normalizeApiLocale } from "@/lib/api";
import arMessages from "@/messages/ar.json";
import enMessages from "@/messages/en.json";

type RouteContext = {
  params: Promise<{ page: string; id: string }>;
};

function getRouteMessages(locale: ReturnType<typeof normalizeApiLocale>) {
  return (locale === "en" ? enMessages : arMessages).ContentManagement.route;
}

export async function POST(request: Request, context: RouteContext) {
  const locale = normalizeApiLocale(request.headers.get("accept-language"));
  const t = getRouteMessages(locale);
  const { page: pageParam, id } = await context.params;
  const page = parseLegalPageKind(pageParam);

  if (page !== "support") {
    return Response.json(
      { success: false, message: t.invalidLegalPage },
      { status: 400 },
    );
  }

  if (!id?.trim()) {
    return Response.json(
      { success: false, message: t.invalidSupportSubmissionId },
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
    const result = await api.post<SupportSubmissionMutationResponse>(
      `${legalBackendBasePath(page)}/submissions/${encodeURIComponent(id.trim())}/read`,
      {
        locale,
        headers: {
          Authorization: `${tokenType} ${token}`,
        },
        body: {},
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
          message: error.message || t.unableToMarkSupportSubmissionRead,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Mark support submission read failed:", error);

    return Response.json(
      { success: false, message: t.unableToMarkSupportSubmissionRead },
      { status: 500 },
    );
  }
}
