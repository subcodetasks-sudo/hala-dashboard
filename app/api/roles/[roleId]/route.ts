import {
  getAuthToken,
  getAuthTokenType,
} from "@/features/auth/lib/session";
import type { RoleDetailResponse } from "@/features/permissions/types";
import { ApiError, api, normalizeApiLocale } from "@/lib/api";
import arMessages from "@/messages/ar.json";
import enMessages from "@/messages/en.json";

type RouteContext = {
  params: Promise<{ roleId: string }>;
};

function getRouteMessages(locale: ReturnType<typeof normalizeApiLocale>) {
  return (locale === "en" ? enMessages : arMessages).Permissions.route;
}

export async function GET(request: Request, context: RouteContext) {
  const locale = normalizeApiLocale(request.headers.get("accept-language"));
  const t = getRouteMessages(locale);
  const { roleId } = await context.params;

  if (!roleId?.trim()) {
    return Response.json(
      { success: false, message: t.invalidRoleId },
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
    const result = await api.get<RoleDetailResponse>(
      `/v1/roles/${encodeURIComponent(roleId.trim())}`,
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
          message: error.message || t.unableToFetchRole,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Role detail fetch failed:", error);

    return Response.json(
      { success: false, message: t.unableToFetchRole },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const locale = normalizeApiLocale(request.headers.get("accept-language"));
  const t = getRouteMessages(locale);
  const { roleId } = await context.params;

  if (!roleId?.trim()) {
    return Response.json(
      { success: false, message: t.invalidRoleId },
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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { success: false, message: t.invalidJson },
      { status: 400 },
    );
  }

  try {
    const result = await api.put<RoleDetailResponse>(
      `/v1/roles/${encodeURIComponent(roleId.trim())}`,
      {
        locale,
        headers: {
          Authorization: `${tokenType} ${token}`,
        },
        body,
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
          message: error.message || t.unableToUpdateRole,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Update role failed:", error);

    return Response.json(
      { success: false, message: t.unableToUpdateRole },
      { status: 500 },
    );
  }
}
