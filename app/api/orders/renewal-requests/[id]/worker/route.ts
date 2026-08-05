import {
  getAuthToken,
  getAuthTokenType,
} from "@/features/auth/lib/session";
import type {
  UpdateRenewalRequestWorkerBody,
  UpdateRenewalRequestWorkerResponse,
} from "@/features/orders/types";
import { ApiError, api, normalizeApiLocale } from "@/lib/api";
import arMessages from "@/messages/ar.json";
import enMessages from "@/messages/en.json";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function getRouteMessages(locale: ReturnType<typeof normalizeApiLocale>) {
  return (locale === "en" ? enMessages : arMessages).Orders.New.Review.worker
    .route;
}

function readTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function readPositiveInt(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return Math.trunc(value);
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed > 0) {
      return Math.trunc(parsed);
    }
  }

  return null;
}

function readSalary(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value.replace(/,/g, "").trim());
    if (Number.isFinite(parsed) && parsed >= 0) {
      return parsed;
    }
  }

  return null;
}

function readIsoDate(value: unknown): string {
  const date = readTrimmedString(value);
  return ISO_DATE_PATTERN.test(date) ? date : "";
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

  const workerNameAr = readTrimmedString(body.worker_name_ar);
  const workerNameEn = readTrimmedString(body.worker_name_en);
  const workerPhone = readTrimmedString(body.worker_phone);
  const birthDate = readIsoDate(body.birth_date);
  const philippinesAddress = readTrimmedString(body.philippines_address);
  const passportIssuePlaceId = readPositiveInt(
    body.worker_passport_issue_place_id,
  );
  const passportNumber = readTrimmedString(body.passport_number);
  const passportIssueDate = readIsoDate(body.passport_issue_date);
  const passportExpiryDate = readIsoDate(body.passport_expiry_date);
  const salary = readSalary(body.salary);

  if (!workerNameAr) {
    return Response.json(
      { success: false, message: t.workerNameArRequired },
      { status: 400 },
    );
  }

  if (!workerNameEn) {
    return Response.json(
      { success: false, message: t.workerNameEnRequired },
      { status: 400 },
    );
  }

  if (!workerPhone) {
    return Response.json(
      { success: false, message: t.workerPhoneRequired },
      { status: 400 },
    );
  }

  if (!birthDate) {
    return Response.json(
      { success: false, message: t.birthDateRequired },
      { status: 400 },
    );
  }

  if (!philippinesAddress) {
    return Response.json(
      { success: false, message: t.homeAddressRequired },
      { status: 400 },
    );
  }

  if (!passportIssuePlaceId) {
    return Response.json(
      { success: false, message: t.passportIssuePlaceRequired },
      { status: 400 },
    );
  }

  if (!passportNumber) {
    return Response.json(
      { success: false, message: t.passportNumberRequired },
      { status: 400 },
    );
  }

  if (!passportIssueDate) {
    return Response.json(
      { success: false, message: t.passportIssueDateRequired },
      { status: 400 },
    );
  }

  if (!passportExpiryDate) {
    return Response.json(
      { success: false, message: t.passportExpiryDateRequired },
      { status: 400 },
    );
  }

  if (salary == null) {
    return Response.json(
      { success: false, message: t.salaryRequired },
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

  const outbound: UpdateRenewalRequestWorkerBody = {
    worker_name_ar: workerNameAr,
    worker_name_en: workerNameEn,
    worker_phone: workerPhone,
    birth_date: birthDate,
    philippines_address: philippinesAddress,
    worker_passport_issue_place_id: passportIssuePlaceId,
    passport_number: passportNumber,
    passport_issue_date: passportIssueDate,
    passport_expiry_date: passportExpiryDate,
    salary,
  };

  try {
    const result = await api.put<UpdateRenewalRequestWorkerResponse>(
      `/admin/renewal-requests/${encodeURIComponent(id.trim())}/worker`,
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

    console.error("Update renewal request worker failed:", error);

    return Response.json(
      { success: false, message: t.unableToComplete },
      { status: 500 },
    );
  }
}
