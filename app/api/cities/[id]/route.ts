import {
  getAuthToken,
  getAuthTokenType,
} from "@/features/auth/lib/session";
import type {
  CityDetailResponse,
  CityMutationResponse,
  CityStatus,
} from "@/features/cities/types";
import { ApiError, api, normalizeApiLocale } from "@/lib/api";
import arMessages from "@/messages/ar.json";
import enMessages from "@/messages/en.json";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function getRouteMessages(locale: ReturnType<typeof normalizeApiLocale>) {
  return (locale === "en" ? enMessages : arMessages).Cities.route;
}

export async function GET(request: Request, context: RouteContext) {
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
    const result = await api.get<CityDetailResponse>(
      `/admin/cities/${encodeURIComponent(id.trim())}`,
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
          message: error.message || t.unableToFetchCity,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Fetch city failed:", error);

    return Response.json(
      { success: false, message: t.unableToFetchCity },
      { status: 500 },
    );
  }
}

function parseCityBody(body: Record<string, unknown>): {
  name_ar: string;
  name_en: string;
  status: CityStatus;
} | { error: string } {
  const nameAr =
    typeof body.name_ar === "string"
      ? body.name_ar.trim()
      : typeof body.nameAr === "string"
        ? body.nameAr.trim()
        : "";
  const nameEn =
    typeof body.name_en === "string"
      ? body.name_en.trim()
      : typeof body.nameEn === "string"
        ? body.nameEn.trim()
        : "";
  const statusRaw =
    typeof body.status === "string" ? body.status.trim() : "";

  if (!nameAr) {
    return { error: "nameArRequired" };
  }
  if (!nameEn) {
    return { error: "nameEnRequired" };
  }
  if (statusRaw !== "active" && statusRaw !== "inactive") {
    return { error: "statusRequired" };
  }

  return {
    name_ar: nameAr,
    name_en: nameEn,
    status: statusRaw,
  };
}

export async function PUT(request: Request, context: RouteContext) {
  const locale = normalizeApiLocale(request.headers.get("accept-language"));
  const t = getRouteMessages(locale);
  const { id } = await context.params;

  if (!id?.trim()) {
    return Response.json(
      { success: false, message: t.invalidId },
      { status: 400 },
    );
  }

  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json(
      { success: false, message: t.invalidJson },
      { status: 400 },
    );
  }

  const parsed = parseCityBody(body);
  if ("error" in parsed) {
    const message =
      parsed.error === "nameArRequired"
        ? t.nameArRequired
        : parsed.error === "nameEnRequired"
          ? t.nameEnRequired
          : t.statusRequired;

    return Response.json({ success: false, message }, { status: 400 });
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
    const result = await api.put<CityMutationResponse>(
      `/admin/cities/${encodeURIComponent(id.trim())}`,
      {
        locale,
        headers: {
          Authorization: `${tokenType} ${token}`,
        },
        body: parsed,
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
          message: error.message || t.unableToUpdateCity,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Update city failed:", error);

    return Response.json(
      { success: false, message: t.unableToUpdateCity },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const locale = normalizeApiLocale(_request.headers.get("accept-language"));
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
    const result = await api.delete<CityMutationResponse>(
      `/admin/cities/${encodeURIComponent(id.trim())}`,
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
          message: error.message || t.unableToDeleteCity,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Delete city failed:", error);

    return Response.json(
      { success: false, message: t.unableToDeleteCity },
      { status: 500 },
    );
  }
}
