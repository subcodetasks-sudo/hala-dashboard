import {
  getAuthToken,
  getAuthTokenType,
} from "@/features/auth/lib/session";
import type {
  SupportFormHeaderMutationResponse,
  SupportFormHeaderShowResponse,
} from "@/features/content-management/types";
import {
  legalBackendBasePath,
  parseLegalPageKind,
} from "@/features/content-management/utils/legal-page";
import { ApiError, api, normalizeApiLocale } from "@/lib/api";
import arMessages from "@/messages/ar.json";
import enMessages from "@/messages/en.json";

type RouteContext = {
  params: Promise<{ page: string }>;
};

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

export async function GET(request: Request, context: RouteContext) {
  const locale = normalizeApiLocale(request.headers.get("accept-language"));
  const t = getRouteMessages(locale);
  const { page: pageParam } = await context.params;
  const page = parseLegalPageKind(pageParam);

  if (page !== "support") {
    return Response.json(
      { success: false, message: t.invalidLegalPage },
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
    const result = await api.get<SupportFormHeaderShowResponse>(
      `${legalBackendBasePath(page)}/form-header`,
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
          message: error.message || t.unableToFetchSupportFormHeader,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Support form header fetch failed:", error);

    return Response.json(
      { success: false, message: t.unableToFetchSupportFormHeader },
      { status: 500 },
    );
  }
}

export async function POST(request: Request, context: RouteContext) {
  const locale = normalizeApiLocale(request.headers.get("accept-language"));
  const t = getRouteMessages(locale);
  const { page: pageParam } = await context.params;
  const page = parseLegalPageKind(pageParam);

  if (page !== "support") {
    return Response.json(
      { success: false, message: t.invalidLegalPage },
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

  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json(
      { success: false, message: t.invalidSupportFormHeaderForm },
      { status: 400 },
    );
  }

  const title = readLocalizedField(body.title);
  const description = readLocalizedField(body.description);

  if (!title || !description) {
    return Response.json(
      { success: false, message: t.supportFormHeaderRequired },
      { status: 400 },
    );
  }

  try {
    const result = await api.post<SupportFormHeaderMutationResponse>(
      `${legalBackendBasePath(page)}/form-header`,
      {
        locale,
        headers: {
          Authorization: `${tokenType} ${token}`,
        },
        body: {
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
          message: error.message || t.unableToSaveSupportFormHeader,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Support form header save failed:", error);

    return Response.json(
      { success: false, message: t.unableToSaveSupportFormHeader },
      { status: 500 },
    );
  }
}
