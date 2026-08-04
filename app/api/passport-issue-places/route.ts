import {
  getAuthToken,
  getAuthTokenType,
} from "@/features/auth/lib/session";
import type {
  CityStatus,
  IssuePlaceCountry,
  IssuePlaceMutationResponse,
  IssuePlacesListResponse,
} from "@/features/cities/types";
import { ApiError, api, normalizeApiLocale } from "@/lib/api";
import arMessages from "@/messages/ar.json";
import enMessages from "@/messages/en.json";

function getRouteMessages(locale: ReturnType<typeof normalizeApiLocale>) {
  return (locale === "en" ? enMessages : arMessages).Cities.route;
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

function parseIssuePlaceBody(body: Record<string, unknown>): {
  name_ar: string;
  name_en: string;
  status: CityStatus;
  country: IssuePlaceCountry;
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
  const countryRaw =
    typeof body.country === "string" ? body.country.trim() : "";

  if (!nameAr) {
    return { error: "nameArRequired" };
  }
  if (!nameEn) {
    return { error: "nameEnRequired" };
  }
  if (statusRaw !== "active" && statusRaw !== "inactive") {
    return { error: "statusRequired" };
  }
  if (countryRaw !== "sa" && countryRaw !== "ph") {
    return { error: "countryRequired" };
  }

  return {
    name_ar: nameAr,
    name_en: nameEn,
    status: statusRaw,
    country: countryRaw,
  };
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
    const result = await api.get<IssuePlacesListResponse>(
      "/admin/passport-issue-places",
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
          message: error.message || t.unableToFetchIssuePlaces,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Issue places list fetch failed:", error);

    return Response.json(
      { success: false, message: t.unableToFetchIssuePlaces },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const locale = normalizeApiLocale(request.headers.get("accept-language"));
  const t = getRouteMessages(locale);

  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json(
      { success: false, message: t.invalidJson },
      { status: 400 },
    );
  }

  const parsed = parseIssuePlaceBody(body);
  if ("error" in parsed) {
    const message =
      parsed.error === "nameArRequired"
        ? t.nameArRequired
        : parsed.error === "nameEnRequired"
          ? t.nameEnRequired
          : parsed.error === "countryRequired"
            ? t.countryRequired
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
    const result = await api.post<IssuePlaceMutationResponse>(
      "/admin/passport-issue-places",
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
          message: error.message || t.unableToCreateIssuePlace,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Create issue place failed:", error);

    return Response.json(
      { success: false, message: t.unableToCreateIssuePlace },
      { status: 500 },
    );
  }
}
