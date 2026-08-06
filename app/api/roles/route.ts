import {
  getAuthToken,
  getAuthTokenType,
} from "@/features/auth/lib/session";
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
    const result = await api.get<{ message?: string; data?: unknown }>("/v1/roles", {
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

export async function POST(request: Request) {
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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { success: false, message: "Invalid JSON body" },
      { status: 400 },
    );
  }

  try {
    const result = await api.post<unknown>("/v1/roles", {
      locale,
      headers: {
        Authorization: `${tokenType} ${token}`,
      },
      body,
    });

    return Response.json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return Response.json(
        {
          success: false,
          message: error.message || t.unableToCreateRole,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Create role failed:", error);
    return Response.json(
      { success: false, message: t.unableToCreateRole },
      { status: 500 },
    );
  }
}
