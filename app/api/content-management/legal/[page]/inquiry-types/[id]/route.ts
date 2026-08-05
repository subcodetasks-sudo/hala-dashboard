import {
  getAuthToken,
  getAuthTokenType,
} from "@/features/auth/lib/session";
import type { InquiryTypeMutationResponse } from "@/features/content-management/types";
import {
  legalBackendBasePath,
  parseLegalPageKind,
} from "@/features/content-management/utils/legal-page";
import { ApiError, api, normalizeApiLocale } from "@/lib/api";
import arMessages from "@/messages/ar.json";
import enMessages from "@/messages/en.json";

type RouteContext = {
  params: Promise<{ page: string; id: string }>;
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

function readSortOrder(value: unknown): string | null {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
    return String(Math.trunc(value));
  }
  if (typeof value === "string" && /^\d+$/.test(value.trim())) {
    return value.trim();
  }
  return null;
}

function readStatus(value: unknown): "active" | "inactive" | null {
  if (value === "active" || value === "inactive") return value;
  return null;
}

export async function PUT(request: Request, context: RouteContext) {
  const locale = normalizeApiLocale(request.headers.get("accept-language"));
  const t = getRouteMessages(locale);
  const { page: pageParam, id } = await context.params;
  const page = parseLegalPageKind(pageParam);

  if (page !== "support") {
    return Response.json(
      { success: false, message: t.invalidLegalPage },
      { status: 400 },
    );
  }

  if (!id?.trim()) {
    return Response.json(
      { success: false, message: t.invalidInquiryTypeId },
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
      { success: false, message: t.invalidInquiryTypeForm },
      { status: 400 },
    );
  }

  const name = readLocalizedField(body.name);
  const sortOrder = readSortOrder(body.sort_order ?? body.sortOrder);
  const status = readStatus(body.status) ?? "active";

  if (!name || sortOrder === null) {
    return Response.json(
      {
        success: false,
        message:
          sortOrder === null && name
            ? t.inquiryTypeSortOrderInvalid
            : t.inquiryTypeRequired,
      },
      { status: 400 },
    );
  }

  try {
    const result = await api.put<InquiryTypeMutationResponse>(
      `${legalBackendBasePath(page)}/inquiry-types/${encodeURIComponent(id.trim())}`,
      {
        locale,
        headers: {
          Authorization: `${tokenType} ${token}`,
        },
        body: {
          name,
          sort_order: Number(sortOrder),
          status,
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
          message: error.message || t.unableToSaveInquiryType,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Update inquiry type failed:", error);

    return Response.json(
      { success: false, message: t.unableToSaveInquiryType },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const locale = normalizeApiLocale(request.headers.get("accept-language"));
  const t = getRouteMessages(locale);
  const { page: pageParam, id } = await context.params;
  const page = parseLegalPageKind(pageParam);

  if (page !== "support") {
    return Response.json(
      { success: false, message: t.invalidLegalPage },
      { status: 400 },
    );
  }

  if (!id?.trim()) {
    return Response.json(
      { success: false, message: t.invalidInquiryTypeId },
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
    const result = await api.delete<InquiryTypeMutationResponse>(
      `${legalBackendBasePath(page)}/inquiry-types/${encodeURIComponent(id.trim())}`,
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
          message: error.message || t.unableToDeleteInquiryType,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Delete inquiry type failed:", error);

    return Response.json(
      { success: false, message: t.unableToDeleteInquiryType },
      { status: 500 },
    );
  }
}
