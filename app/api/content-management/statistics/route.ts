import {
  getAuthToken,
  getAuthTokenType,
} from "@/features/auth/lib/session";
import type {
  StatisticMutationResponse,
  StatisticsListResponse,
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

function buildStatisticOutbound(formData: FormData): FormData | { error: string } {
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
  const number = readFormText(formData, "number");
  const sortOrder = readFormText(formData, "sort_order", "sortOrder");
  const image = formData.get("image");

  if (!descriptionAr || !descriptionEn || !number || !sortOrder) {
    return { error: "required" };
  }

  if (!/^\d+$/.test(sortOrder)) {
    return { error: "sortOrder" };
  }

  const outbound = new FormData();
  outbound.append("description[ar]", descriptionAr);
  outbound.append("description[en]", descriptionEn);
  outbound.append("number", number);
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
    const result = await api.get<StatisticsListResponse>(
      "/admin/home/statistics",
      {
        locale,
        params: collectQueryParams(request.url),
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
          message: error.message || t.unableToFetchStatistics,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Home statistics list fetch failed:", error);

    return Response.json(
      { success: false, message: t.unableToFetchStatistics },
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
      { success: false, message: t.invalidStatisticForm },
      { status: 400 },
    );
  }

  const outbound = buildStatisticOutbound(formData);
  if ("error" in outbound) {
    return Response.json(
      {
        success: false,
        message:
          outbound.error === "sortOrder"
            ? t.statisticSortOrderInvalid
            : t.statisticRequired,
      },
      { status: 400 },
    );
  }

  try {
    const result = await api.post<StatisticMutationResponse>(
      "/admin/home/statistics",
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
          message: error.message || t.unableToSaveStatistic,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Create home statistic failed:", error);

    return Response.json(
      { success: false, message: t.unableToSaveStatistic },
      { status: 500 },
    );
  }
}
