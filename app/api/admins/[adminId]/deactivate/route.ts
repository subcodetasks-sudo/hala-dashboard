import {
  getAuthToken,
  getAuthTokenType,
} from "@/features/auth/lib/session";
import { ApiError, api, normalizeApiLocale } from "@/lib/api";
import arMessages from "@/messages/ar.json";
import enMessages from "@/messages/en.json";

type RouteContext = {
  params: Promise<{ adminId: string }>;
};

function getRouteMessages(locale: ReturnType<typeof normalizeApiLocale>) {
  return (locale === "en" ? enMessages : arMessages).Employees.route;
}

export async function PATCH(request: Request, context: RouteContext) {
  const locale = normalizeApiLocale(request.headers.get("accept-language"));
  const t = getRouteMessages(locale);
  const { adminId } = await context.params;

  if (!adminId?.trim()) {
    return Response.json(
      { success: false, message: t.unableToDeactivate },
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
    const result = await api.patch<{ success: boolean; message: string }>(
      `/admins/${encodeURIComponent(adminId.trim())}/deactivate`,
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
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return Response.json(
        {
          success: false,
          message: error.message || t.unableToDeactivate,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Deactivate admin failed:", error);

    return Response.json(
      { success: false, message: t.unableToDeactivate },
      { status: 500 },
    );
  }
}
