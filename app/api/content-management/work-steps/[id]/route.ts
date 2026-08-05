import {
  getAuthToken,
  getAuthTokenType,
} from "@/features/auth/lib/session";
import type { StepMutationResponse } from "@/features/content-management/types";
import { ApiError, api, normalizeApiLocale } from "@/lib/api";
import arMessages from "@/messages/ar.json";
import enMessages from "@/messages/en.json";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function getRouteMessages(locale: ReturnType<typeof normalizeApiLocale>) {
  return (locale === "en" ? enMessages : arMessages).ContentManagement.route;
}

function readFormText(formData: FormData, ...keys: string[]): string {
  for (const key of keys) {
    const value = formData.get(key);
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return "";
}

function buildStepOutbound(formData: FormData): FormData | { error: string } {
  const stepNumber = readFormText(formData, "step_number", "stepNumber");
  const stepNameAr = readFormText(
    formData,
    "step_name[ar]",
    "stepName[ar]",
    "step_name_ar",
  );
  const stepNameEn = readFormText(
    formData,
    "step_name[en]",
    "stepName[en]",
    "step_name_en",
  );
  const titleAr = readFormText(formData, "title[ar]", "title_ar");
  const titleEn = readFormText(formData, "title[en]", "title_en");
  const descriptionAr = readFormText(
    formData,
    "description[ar]",
    "description_ar",
  );
  const descriptionEn = readFormText(
    formData,
    "description[en]",
    "description_en",
  );
  const image = formData.get("image");

  if (
    !stepNumber ||
    !stepNameAr ||
    !stepNameEn ||
    !titleAr ||
    !titleEn ||
    !descriptionAr ||
    !descriptionEn
  ) {
    return { error: "required" };
  }

  if (!/^\d+$/.test(stepNumber) || Number(stepNumber) < 1) {
    return { error: "stepNumber" };
  }

  const outbound = new FormData();
  // Laravel multipart update: POST + method spoof (matches Postman).
  outbound.append("_method", "PUT");
  outbound.append("step_number", stepNumber);
  outbound.append("step_name[ar]", stepNameAr);
  outbound.append("step_name[en]", stepNameEn);
  outbound.append("title[ar]", titleAr);
  outbound.append("title[en]", titleEn);
  outbound.append("description[ar]", descriptionAr);
  outbound.append("description[en]", descriptionEn);
  outbound.append("status", "active");

  if (image instanceof File && image.size > 0) {
    outbound.append("image", image, image.name);
  }

  return outbound;
}

export async function POST(request: Request, context: RouteContext) {
  const locale = normalizeApiLocale(request.headers.get("accept-language"));
  const t = getRouteMessages(locale);
  const { id } = await context.params;

  if (!id?.trim()) {
    return Response.json(
      { success: false, message: t.invalidStepId },
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

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return Response.json(
      { success: false, message: t.invalidStepForm },
      { status: 400 },
    );
  }

  const outbound = buildStepOutbound(formData);
  if ("error" in outbound) {
    return Response.json(
      {
        success: false,
        message:
          outbound.error === "stepNumber"
            ? t.stepNumberInvalid
            : t.stepRequired,
      },
      { status: 400 },
    );
  }

  try {
    const result = await api.post<StepMutationResponse>(
      `/admin/home/steps/${encodeURIComponent(id.trim())}`,
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
          message: error.message || t.unableToSaveStep,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Update home step failed:", error);

    return Response.json(
      { success: false, message: t.unableToSaveStep },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, context: RouteContext) {
  return POST(request, context);
}

export async function DELETE(request: Request, context: RouteContext) {
  const locale = normalizeApiLocale(request.headers.get("accept-language"));
  const t = getRouteMessages(locale);
  const { id } = await context.params;

  if (!id?.trim()) {
    return Response.json(
      { success: false, message: t.invalidStepId },
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
    const result = await api.delete<StepMutationResponse>(
      `/admin/home/steps/${encodeURIComponent(id.trim())}`,
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
          message: error.message || t.unableToDeleteStep,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Delete home step failed:", error);

    return Response.json(
      { success: false, message: t.unableToDeleteStep },
      { status: 500 },
    );
  }
}
