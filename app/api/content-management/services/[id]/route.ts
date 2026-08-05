import {
  getAuthToken,
  getAuthTokenType,
} from "@/features/auth/lib/session";
import type { ServiceMutationResponse } from "@/features/content-management/types";
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
  const buttonLink = readFormText(formData, "button_link", "buttonLink");
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

export async function PUT(request: Request, context: RouteContext) {
  const locale = normalizeApiLocale(request.headers.get("accept-language"));
  const t = getRouteMessages(locale);
  const { id } = await context.params;

  if (!id?.trim()) {
    return Response.json(
      { success: false, message: t.invalidServiceId },
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

  // Laravel ignores multipart bodies on real PUT; spoof via POST + _method.
  outbound.append("_method", "PUT");

  try {
    const result = await api.post<ServiceMutationResponse>(
      `/admin/home/services/${encodeURIComponent(id.trim())}`,
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

    console.error("Update home service failed:", error);

    return Response.json(
      { success: false, message: t.unableToSaveService },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const locale = normalizeApiLocale(request.headers.get("accept-language"));
  const t = getRouteMessages(locale);
  const { id } = await context.params;

  if (!id?.trim()) {
    return Response.json(
      { success: false, message: t.invalidServiceId },
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
    const result = await api.delete<ServiceMutationResponse>(
      `/admin/home/services/${encodeURIComponent(id.trim())}`,
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
          message: error.message || t.unableToDeleteService,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Delete home service failed:", error);

    return Response.json(
      { success: false, message: t.unableToDeleteService },
      { status: 500 },
    );
  }
}
