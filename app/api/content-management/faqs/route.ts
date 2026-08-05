import {
  getAuthToken,
  getAuthTokenType,
} from "@/features/auth/lib/session";
import type {
  FaqMutationResponse,
  FaqsListResponse,
} from "@/features/content-management/types";
import { ApiError, api, normalizeApiLocale } from "@/lib/api";
import arMessages from "@/messages/ar.json";
import enMessages from "@/messages/en.json";

function getRouteMessages(locale: ReturnType<typeof normalizeApiLocale>) {
  return (locale === "en" ? enMessages : arMessages).ContentManagement.route;
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

function readSortOrder(value: unknown): string | null {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
    return String(Math.trunc(value));
  }
  if (typeof value === "string" && /^\d+$/.test(value.trim())) {
    return value.trim();
  }
  return null;
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
    const result = await api.get<FaqsListResponse>("/admin/home/faqs", {
      locale,
      params: collectQueryParams(request.url),
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
          message: error.message || t.unableToFetchFaqs,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("FAQs list fetch failed:", error);

    return Response.json(
      { success: false, message: t.unableToFetchFaqs },
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
      { success: false, message: t.invalidFaqForm },
      { status: 400 },
    );
  }

  const question = readLocalizedField(body.question);
  const answer = readLocalizedField(body.answer);
  const sortOrder = readSortOrder(body.sort_order ?? body.sortOrder);

  if (!question || !answer || sortOrder === null) {
    return Response.json(
      {
        success: false,
        message:
          sortOrder === null && question && answer
            ? t.faqSortOrderInvalid
            : t.faqRequired,
      },
      { status: 400 },
    );
  }

  try {
    const result = await api.post<FaqMutationResponse>("/admin/home/faqs", {
      locale,
      headers: {
        Authorization: `${tokenType} ${token}`,
      },
      body: {
        question,
        answer,
        sort_order: Number(sortOrder),
        status: "active",
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
          message: error.message || t.unableToSaveFaq,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Create FAQ failed:", error);

    return Response.json(
      { success: false, message: t.unableToSaveFaq },
      { status: 500 },
    );
  }
}
