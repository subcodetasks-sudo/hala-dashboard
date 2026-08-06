import {
  getAuthToken,
  getAuthTokenType,
} from "@/features/auth/lib/session";
import type { PermissionsGroupedResponse } from "@/features/permissions/types";
import { ApiError, api, normalizeApiLocale } from "@/lib/api";
import arMessages from "@/messages/ar.json";
import enMessages from "@/messages/en.json";

function getRouteMessages(locale: ReturnType<typeof normalizeApiLocale>) {
  return (locale === "en" ? enMessages : arMessages).Permissions.route;
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
    const result = await api.get<PermissionsGroupedResponse>(
      "/v1/permissions/grouped",
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
          message: error.message || t.unableToFetchGroupedPermissions,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Permissions grouped fetch failed:", error);
    return Response.json(
      { success: false, message: t.unableToFetchGroupedPermissions },
      { status: 500 },
    );
  }
}

