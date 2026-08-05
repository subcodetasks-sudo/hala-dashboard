import {
  getAuthToken,
  getAuthTokenType,
} from "@/features/auth/lib/session";
import type {
  StepMutationResponse,
  StepsListResponse,
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
    const result = await api.get<StepsListResponse>("/admin/home/steps", {
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
          message: error.message || t.unableToFetchSteps,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Home steps list fetch failed:", error);

    return Response.json(
      { success: false, message: t.unableToFetchSteps },
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
    const result = await api.post<StepMutationResponse>("/admin/home/steps", {
      locale,
      headers: {
        Authorization: `${tokenType} ${token}`,
      },
      body: outbound,
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
          message: error.message || t.unableToSaveStep,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Create home step failed:", error);

    return Response.json(
      { success: false, message: t.unableToSaveStep },
      { status: 500 },
    );
  }
}
