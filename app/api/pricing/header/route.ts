import {
  getAuthToken,
  getAuthTokenType,
} from "@/features/auth/lib/session";
import type {
  PricingHeaderMutationResponse,
  PricingHeaderShowResponse,
} from "@/features/pricing/types";
import { ApiError, api, normalizeApiLocale } from "@/lib/api";
import arMessages from "@/messages/ar.json";
import enMessages from "@/messages/en.json";

function getRouteMessages(locale: ReturnType<typeof normalizeApiLocale>) {
  return (locale === "en" ? enMessages : arMessages).Pricing.route;
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
    const result = await api.get<PricingHeaderShowResponse>(
      "/admin/home/pricing/header",
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
          message: error.message || t.unableToFetchHeader,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Pricing header fetch failed:", error);

    return Response.json(
      { success: false, message: t.unableToFetchHeader },
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
      { success: false, message: t.invalidHeaderForm },
      { status: 400 },
    );
  }

  const content = readLocalizedField(body.content);
  const title = readLocalizedField(body.title);
  const description = readLocalizedField(body.description);

  if (!content || !title || !description) {
    return Response.json(
      { success: false, message: t.headerRequired },
      { status: 400 },
    );
  }

  try {
    const result = await api.post<PricingHeaderMutationResponse>(
      "/admin/home/pricing/header",
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
          message: error.message || t.unableToSaveHeader,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Pricing header save failed:", error);

    return Response.json(
      { success: false, message: t.unableToSaveHeader },
      { status: 500 },
    );
  }
}
