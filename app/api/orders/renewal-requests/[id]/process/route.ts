import {
  getAuthToken,
  getAuthTokenType,
} from "@/features/auth/lib/session";
import type { ProcessRenewalRequestResponse } from "@/features/orders/types";
import { ApiError, api, normalizeApiLocale } from "@/lib/api";
import arMessages from "@/messages/ar.json";
import enMessages from "@/messages/en.json";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function getRouteMessages(locale: ReturnType<typeof normalizeApiLocale>) {
  return (locale === "en" ? enMessages : arMessages).Orders.New
    .approveProcessDialog.route;
}

export async function POST(request: Request, context: RouteContext) {
  const locale = normalizeApiLocale(request.headers.get("accept-language"));
  const t = getRouteMessages(locale);
  const { id } = await context.params;

  if (!id?.trim()) {
    return Response.json(
      { success: false, message: t.invalidId },
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
    const result = await api.post<ProcessRenewalRequestResponse>(
      `/admin/renewal-requests/${encodeURIComponent(id.trim())}/process`,
      {
        locale,
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
          message: error.message || t.unableToComplete,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Process renewal request failed:", error);

    return Response.json(
      { success: false, message: t.unableToComplete },
      { status: 500 },
    );
  }
}
