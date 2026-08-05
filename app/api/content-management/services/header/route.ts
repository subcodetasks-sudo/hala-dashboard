import {
  getAuthToken,
  getAuthTokenType,
} from "@/features/auth/lib/session";
import type {
  ServicesHeaderMutationResponse,
  ServicesHeaderShowResponse,
} from "@/features/content-management/types";
import { ApiError, api, normalizeApiLocale } from "@/lib/api";
import arMessages from "@/messages/ar.json";
import enMessages from "@/messages/en.json";

function getRouteMessages(locale: ReturnType<typeof normalizeApiLocale>) {
  return (locale === "en" ? enMessages : arMessages).ContentManagement.route;
}

function readLocalizedField(
  value: unknown,
): { ar: string; en: string } | null {
  if (!value || typeof value !== "object") return null;

  const record = value as Record<string, unknown>;
  const ar = typeof record.ar === "string" ? record.ar.trim() : "";
  const en = typeof record.en === "string" ? record.en.trim() : "";

  if (!ar || !en) return null;

  return { ar, en };
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
    const result = await api.get<ServicesHeaderShowResponse>(
      "/admin/home/services/header",
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
          message: error.message || t.unableToFetchServicesHeader,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Services header fetch failed:", error);

    return Response.json(
      { success: false, message: t.unableToFetchServicesHeader },
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

  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json(
      { success: false, message: t.invalidServicesHeaderForm },
      { status: 400 },
    );
  }

  const content = readLocalizedField(body.content);
  const title = readLocalizedField(body.title);
  const description = readLocalizedField(body.description);

  if (!content || !title || !description) {
    return Response.json(
      { success: false, message: t.servicesHeaderRequired },
      { status: 400 },
    );
  }

  try {
    const result = await api.post<ServicesHeaderMutationResponse>(
      "/admin/home/services/header",
      {
        locale,
        headers: {
          Authorization: `${tokenType} ${token}`,
        },
        body: {
          content,
          title,
          description,
          status: "active",
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
          message: error.message || t.unableToSaveServicesHeader,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Services header save failed:", error);

    return Response.json(
      { success: false, message: t.unableToSaveServicesHeader },
      { status: 500 },
    );
  }
}
