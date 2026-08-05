import {
  getAuthToken,
  getAuthTokenType,
} from "@/features/auth/lib/session";
import type {
  HeroMutationResponse,
  HeroShowResponse,
} from "@/features/content-management/types";
import { ApiError, api, normalizeApiLocale } from "@/lib/api";
import arMessages from "@/messages/ar.json";
import enMessages from "@/messages/en.json";

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
    const result = await api.get<HeroShowResponse>("/admin/home/hero", {
      locale,
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
          message: error.message || t.unableToFetchHero,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Home hero fetch failed:", error);

    return Response.json(
      { success: false, message: t.unableToFetchHero },
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
      { success: false, message: t.invalidHeroForm },
      { status: 400 },
    );
  }

  const badgeAr = readFormText(formData, "badge[ar]", "badge_ar");
  const badgeEn = readFormText(formData, "badge[en]", "badge_en");
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
  const status = "active";
  const image = formData.get("image");

  if (
    !badgeAr ||
    !badgeEn ||
    !titleAr ||
    !titleEn ||
    !descriptionAr ||
    !descriptionEn
  ) {
    return Response.json(
      { success: false, message: t.heroRequired },
      { status: 400 },
    );
  }

  const outbound = new FormData();
  outbound.append("badge[ar]", badgeAr);
  outbound.append("badge[en]", badgeEn);
  outbound.append("title[ar]", titleAr);
  outbound.append("title[en]", titleEn);
  outbound.append("description[ar]", descriptionAr);
  outbound.append("description[en]", descriptionEn);
  outbound.append("status", status);

  if (image instanceof File && image.size > 0) {
    outbound.append("image", image, image.name);
  }

  try {
    const result = await api.post<HeroMutationResponse>("/admin/home/hero", {
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
          message: error.message || t.unableToSaveHero,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Home hero save failed:", error);

    return Response.json(
      { success: false, message: t.unableToSaveHero },
      { status: 500 },
    );
  }
}
