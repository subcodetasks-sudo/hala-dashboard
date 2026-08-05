import {
  getAuthToken,
  getAuthTokenType,
} from "@/features/auth/lib/session";
import type { UpdateRenewalEmployerResponse } from "@/features/orders/types";
import { ApiError, api, normalizeApiLocale } from "@/lib/api";
import { toSaudiPhoneInternational } from "@/lib/format-saudi-phone";
import arMessages from "@/messages/ar.json";
import enMessages from "@/messages/en.json";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function getRouteMessages(locale: ReturnType<typeof normalizeApiLocale>) {
  return (locale === "en" ? enMessages : arMessages).Orders.New.Review.employer
    .route;
}

function readPositiveInt(value: unknown): number | null {
  if (typeof value === "number" && Number.isInteger(value) && value > 0) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isInteger(parsed) && parsed > 0) {
      return parsed;
    }
  }

  return null;
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

  const nationalId =
    typeof body.national_id === "string"
      ? body.national_id.trim()
      : typeof body.nationalId === "string"
        ? body.nationalId.trim()
        : "";

  const phoneRaw =
    typeof body.phone === "string"
      ? body.phone.trim()
      : typeof body.phoneLocal === "string"
        ? toSaudiPhoneInternational(body.phoneLocal)
        : "";

  const employerNameAr =
    typeof body.employer_name_ar === "string"
      ? body.employer_name_ar.trim()
      : typeof body.employerNameAr === "string"
        ? body.employerNameAr.trim()
        : "";

  const employerNameEn =
    typeof body.employer_name_en === "string"
      ? body.employer_name_en.trim()
      : typeof body.employerNameEn === "string"
        ? body.employerNameEn.trim()
        : "";

  const cityId =
    readPositiveInt(body.city_id) ?? readPositiveInt(body.cityId);

  const passportIssuePlaceId =
    readPositiveInt(body.passport_issue_place_id) ??
    readPositiveInt(body.passportIssuePlaceId);

  if (!nationalId) {
    return Response.json(
      { success: false, message: t.nationalIdRequired },
      { status: 400 },
    );
  }

  if (!/^[12]\d{9}$/.test(nationalId)) {
    return Response.json(
      { success: false, message: t.nationalIdInvalid },
      { status: 400 },
    );
  }

  if (!phoneRaw || !/^\+9665\d{8}$/.test(phoneRaw.replace(/\s/g, ""))) {
    return Response.json(
      { success: false, message: t.phoneInvalid },
      { status: 400 },
    );
  }

  if (!employerNameAr) {
    return Response.json(
      { success: false, message: t.employerNameArRequired },
      { status: 400 },
    );
  }

  if (!employerNameEn) {
    return Response.json(
      { success: false, message: t.employerNameEnRequired },
      { status: 400 },
    );
  }

  if (cityId == null) {
    return Response.json(
      { success: false, message: t.cityRequired },
      { status: 400 },
    );
  }

  if (passportIssuePlaceId == null) {
    return Response.json(
      { success: false, message: t.passportIssuePlaceRequired },
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
    const result = await api.put<UpdateRenewalEmployerResponse>(
      `/admin/renewal-requests/${encodeURIComponent(id.trim())}/employer`,
      {
        locale,
        headers: {
          Authorization: `${tokenType} ${token}`,
        },
        body: {
          national_id: nationalId,
          phone: phoneRaw.replace(/\s/g, ""),
          employer_name_ar: employerNameAr,
          employer_name_en: employerNameEn,
          city_id: cityId,
          passport_issue_place_id: passportIssuePlaceId,
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

    console.error("Update renewal employer failed:", error);

    return Response.json(
      { success: false, message: t.unableToComplete },
      { status: 500 },
    );
  }
}
