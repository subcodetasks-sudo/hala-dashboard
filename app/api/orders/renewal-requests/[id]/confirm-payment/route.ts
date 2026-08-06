import {
  getAuthToken,
  getAuthTokenType,
} from "@/features/auth/lib/session";
import type { ConfirmPaymentResponse } from "@/features/orders/types";
import { ApiError, api, normalizeApiLocale } from "@/lib/api";
import arMessages from "@/messages/ar.json";
import enMessages from "@/messages/en.json";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function getRouteMessages(locale: ReturnType<typeof normalizeApiLocale>) {
  return (locale === "en" ? enMessages : arMessages).Orders.Payment
    .confirmPaymentDialog.route;
}

function readFormText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isConfirmedValue(value: FormDataEntryValue | null): boolean {
  if (value === null) return false;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return (
      normalized === "1" ||
      normalized === "true" ||
      normalized === "yes" ||
      normalized === "on"
    );
  }
  return false;
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

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return Response.json(
      { success: false, message: t.invalidForm },
      { status: 400 },
    );
  }

  const paymentProof = formData.get("payment_proof");

  if (!(paymentProof instanceof File) || paymentProof.size === 0) {
    return Response.json(
      { success: false, message: t.fileRequired },
      { status: 400 },
    );
  }

  if (!isConfirmedValue(formData.get("confirmed"))) {
    return Response.json(
      { success: false, message: t.confirmedRequired },
      { status: 400 },
    );
  }

  const notificationText = readFormText(formData, "notification_text");

  const token = await getAuthToken();
  const tokenType = await getAuthTokenType();

  if (!token) {
    return Response.json(
      { success: false, message: t.unauthorized },
      { status: 401 },
    );
  }

  const outbound = new FormData();
  outbound.append("payment_proof", paymentProof, paymentProof.name);
  outbound.append("confirmed", "1");
  outbound.append("notification_text", notificationText);

  try {
    const result = await api.post<ConfirmPaymentResponse>(
      `/admin/renewal-requests/${encodeURIComponent(id.trim())}/confirm-payment`,
      {
        locale,
        headers: {
          Authorization: `${tokenType} ${token}`,
        },
        body: outbound,
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

    console.error("Confirm payment failed:", error);

    return Response.json(
      { success: false, message: t.unableToComplete },
      { status: 500 },
    );
  }
}
