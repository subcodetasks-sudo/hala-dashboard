import {
  getAuthToken,
  getAuthTokenType,
} from "@/features/auth/lib/session";
import type {
  CancelStatusMutationResponse,
  CancelStatusesListResponse,
} from "@/features/cancel-statuses/types";
import { ApiError, api, normalizeApiLocale } from "@/lib/api";
import arMessages from "@/messages/ar.json";
import enMessages from "@/messages/en.json";

function getRouteMessages(locale: ReturnType<typeof normalizeApiLocale>) {
  return (locale === "en" ? enMessages : arMessages).CancelStatuses.route;
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

function parseCancelStatusBody(body: Record<string, unknown>): {
  text_ar: string;
  text_en: string;
  active: boolean;
} | { error: string } {
  const textAr =
    typeof body.text_ar === "string"
      ? body.text_ar.trim()
      : typeof body.textAr === "string"
        ? body.textAr.trim()
        : "";
  const textEn =
    typeof body.text_en === "string"
      ? body.text_en.trim()
      : typeof body.textEn === "string"
        ? body.textEn.trim()
        : "";

  let active: boolean | null = null;
  if (typeof body.active === "boolean") {
    active = body.active;
  } else if (body.active === "true" || body.active === 1 || body.active === "1") {
    active = true;
  } else if (
    body.active === "false" ||
    body.active === 0 ||
    body.active === "0"
  ) {
    active = false;
  }

  if (!textAr) {
    return { error: "textArRequired" };
  }
  if (!textEn) {
    return { error: "textEnRequired" };
  }
  if (active === null) {
    return { error: "activeRequired" };
  }

  return {
    text_ar: textAr,
    text_en: textEn,
    active,
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
    const result = await api.get<CancelStatusesListResponse>(
      "/admin/cancel-statuses",
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
          message: error.message || t.unableToFetchList,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Cancel statuses list fetch failed:", error);

    return Response.json(
      { success: false, message: t.unableToFetchList },
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

  const parsed = parseCancelStatusBody(body);
  if ("error" in parsed) {
    const message =
      parsed.error === "textArRequired"
        ? t.textArRequired
        : parsed.error === "textEnRequired"
          ? t.textEnRequired
          : t.activeRequired;

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
    const result = await api.post<CancelStatusMutationResponse>(
      "/admin/cancel-statuses",
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
          message: error.message || t.unableToCreate,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Create cancel status failed:", error);

    return Response.json(
      { success: false, message: t.unableToCreate },
      { status: 500 },
    );
  }
}
