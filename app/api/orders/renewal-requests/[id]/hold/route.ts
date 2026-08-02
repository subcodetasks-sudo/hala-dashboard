import {
  getAuthToken,
  getAuthTokenType,
} from "@/features/auth/lib/session";
import type {
  HoldReasonValue,
  HoldRenewalRequestResponse,
} from "@/features/orders/types";
import { ApiError, api, normalizeApiLocale } from "@/lib/api";
import arMessages from "@/messages/ar.json";
import enMessages from "@/messages/en.json";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const HOLD_REASONS = new Set<HoldReasonValue>([
  "employer_data_incomplete",
  "worker_data_unclear",
  "missing_document",
  "unclear_document",
  "data_conflict",
  "other",
]);

function getRouteMessages(locale: ReturnType<typeof normalizeApiLocale>) {
  return (locale === "en" ? enMessages : arMessages).Orders.New.pendOrderDialog
    .route;
}

function isHoldReason(value: unknown): value is HoldReasonValue {
  return typeof value === "string" && HOLD_REASONS.has(value as HoldReasonValue);
}

export async function POST(request: Request, context: RouteContext) {
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

  if (!isHoldReason(body.hold_reason)) {
    return Response.json(
      { success: false, message: t.holdReasonRequired },
      { status: 400 },
    );
  }

  const holdNotes =
    typeof body.hold_notes === "string" ? body.hold_notes.trim() : "";

  const token = await getAuthToken();
  const tokenType = await getAuthTokenType();

  if (!token) {
    return Response.json(
      { success: false, message: t.unauthorized },
      { status: 401 },
    );
  }

  try {
    const result = await api.post<HoldRenewalRequestResponse>(
      `/admin/renewal-requests/${encodeURIComponent(id.trim())}/hold`,
      {
        locale,
        headers: {
          Authorization: `${tokenType} ${token}`,
        },
        body: {
          hold_reason: body.hold_reason,
          hold_notes: holdNotes,
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
          message: error.message || t.unableToComplete,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Hold renewal request failed:", error);

    return Response.json(
      { success: false, message: t.unableToComplete },
      { status: 500 },
    );
  }
}
