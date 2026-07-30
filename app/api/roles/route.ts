import {
  getAuthToken,
  getAuthTokenType,
} from "@/features/auth/lib/session";
import type { RolesResponse } from "@/features/employees/types";
import { ApiError, api, normalizeApiLocale } from "@/lib/api";
import arMessages from "@/messages/ar.json";
import enMessages from "@/messages/en.json";

function getRouteMessages(locale: ReturnType<typeof normalizeApiLocale>) {
  return (locale === "en" ? enMessages : arMessages).Employees.route;
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
    const result = await api.get<RolesResponse>("/v1/roles", {
      locale,
      headers: {
        Authorization: `${tokenType} ${token}`,
      },
    });

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
          message: error.message || t.unableToFetchRoles,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Roles fetch failed:", error);

    return Response.json(
      { success: false, message: t.unableToFetchRoles },
      { status: 500 },
    );
  }
}
