import {
  getAuthToken,
  getAuthTokenType,
} from "@/features/auth/lib/session";
import type {
  CancelStatusDetailResponse,
  CancelStatusMutationResponse,
} from "@/features/cancel-statuses/types";
import { ApiError, api, normalizeApiLocale } from "@/lib/api";
import arMessages from "@/messages/ar.json";
import enMessages from "@/messages/en.json";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function getRouteMessages(locale: ReturnType<typeof normalizeApiLocale>) {
  return (locale === "en" ? enMessages : arMessages).CancelStatuses.route;
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
    const result = await api.get<CancelStatusDetailResponse>(
      `/admin/cancel-statuses/${encodeURIComponent(id.trim())}`,
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
          message: error.message || t.unableToFetchOne,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Fetch cancel status failed:", error);

    return Response.json(
      { success: false, message: t.unableToFetchOne },
      { status: 500 },
    );
  }
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
    const result = await api.put<CancelStatusMutationResponse>(
      `/admin/cancel-statuses/${encodeURIComponent(id.trim())}`,
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
          message: error.message || t.unableToUpdate,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Update cancel status failed:", error);

    return Response.json(
      { success: false, message: t.unableToUpdate },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, context: RouteContext) {
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
    const result = await api.delete<CancelStatusMutationResponse>(
      `/admin/cancel-statuses/${encodeURIComponent(id.trim())}`,
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
          message: error.message || t.unableToDelete,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Delete cancel status failed:", error);

    return Response.json(
      { success: false, message: t.unableToDelete },
      { status: 500 },
    );
  }
}
