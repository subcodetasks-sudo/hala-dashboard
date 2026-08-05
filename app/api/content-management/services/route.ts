import {
  getAuthToken,
  getAuthTokenType,
} from "@/features/auth/lib/session";
import type {
  ServiceMutationResponse,
  ServicesListResponse,
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

function buildServiceOutbound(formData: FormData): FormData | { error: string } {
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
  const buttonTextAr = readFormText(
    formData,
    "button_text[ar]",
    "buttonText[ar]",
    "button_text_ar",
  );
  const buttonTextEn = readFormText(
    formData,
    "button_text[en]",
    "buttonText[en]",
    "button_text_en",
  );
  const buttonLink = readFormText(
    formData,
    "button_link",
    "buttonLink",
  );
  const sortOrder = readFormText(formData, "sort_order", "sortOrder");
  const image = formData.get("image");

  if (
    !titleAr ||
    !titleEn ||
    !descriptionAr ||
    !descriptionEn ||
    !buttonTextAr ||
    !buttonTextEn ||
    !buttonLink ||
    !sortOrder
  ) {
    return { error: "required" };
  }

  if (!/^\d+$/.test(sortOrder)) {
    return { error: "sortOrder" };
  }

  const outbound = new FormData();
  outbound.append("title[ar]", titleAr);
  outbound.append("title[en]", titleEn);
  outbound.append("description[ar]", descriptionAr);
  outbound.append("description[en]", descriptionEn);
  outbound.append("button_text[ar]", buttonTextAr);
  outbound.append("button_text[en]", buttonTextEn);
  outbound.append("button_link", buttonLink);
  outbound.append("sort_order", sortOrder);
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
    const result = await api.get<ServicesListResponse>("/admin/home/services", {
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
          message: error.message || t.unableToFetchServices,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Home services list fetch failed:", error);

    return Response.json(
      { success: false, message: t.unableToFetchServices },
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
      { success: false, message: t.invalidServiceForm },
      { status: 400 },
    );
  }

  const outbound = buildServiceOutbound(formData);
  if ("error" in outbound) {
    return Response.json(
      {
        success: false,
        message:
          outbound.error === "sortOrder"
            ? t.serviceSortOrderInvalid
            : t.serviceRequired,
      },
      { status: 400 },
    );
  }

  try {
    const result = await api.post<ServiceMutationResponse>(
      "/admin/home/services",
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
          message: error.message || t.unableToSaveService,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Create home service failed:", error);

    return Response.json(
      { success: false, message: t.unableToSaveService },
      { status: 500 },
    );
  }
}
