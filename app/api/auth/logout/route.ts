import {
  clearAuthCookies,
  getAuthToken,
  getAuthTokenType,
} from "@/features/auth/lib/session";
import type { AdminLogoutResponse } from "@/features/auth/types";
import { ApiError, api, normalizeApiLocale } from "@/lib/api";
import arMessages from "@/messages/ar.json";
import enMessages from "@/messages/en.json";

function getRouteMessages(locale: ReturnType<typeof normalizeApiLocale>) {
  return (locale === "en" ? enMessages : arMessages).Auth.Logout.route;
}

export async function POST(request: Request) {
  const locale = normalizeApiLocale(request.headers.get("accept-language"));
  const t = getRouteMessages(locale);

  const token = await getAuthToken();
  const tokenType = await getAuthTokenType();

  let message = t.success;

  if (token) {
    try {
      const result = await api.post<AdminLogoutResponse>("/admin/logout", {
        locale,
        headers: {
          Authorization: `${tokenType} ${token}`,
        },
      });

      if (result.message) {
        message = result.message;
      }
    } catch (error) {
      if (!(error instanceof ApiError)) {
        console.error("Admin logout failed:", error);
      }
      // Local session is still cleared below so the user can leave the dashboard.
    }
  }

  await clearAuthCookies();

  return Response.json({
    success: true,
    message,
  });
}
