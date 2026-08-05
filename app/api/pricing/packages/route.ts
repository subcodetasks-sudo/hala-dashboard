import {
  getAuthToken,
  getAuthTokenType,
} from "@/features/auth/lib/session";
import type {
  PackageMutationResponse,
  PackagesListResponse,
} from "@/features/pricing/types";
import {
  buildPlanOutbound,
  mapPlanOutboundError,
} from "@/features/pricing/utils/build-plan-outbound";
import { ApiError, api, normalizeApiLocale } from "@/lib/api";
import arMessages from "@/messages/ar.json";
import enMessages from "@/messages/en.json";

function getRouteMessages(locale: ReturnType<typeof normalizeApiLocale>) {
  return (locale === "en" ? enMessages : arMessages).Pricing.route;
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
    const result = await api.get<PackagesListResponse>("/admin/plans", {
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
          message: error.message || t.unableToFetchPackages,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Plans list fetch failed:", error);

    return Response.json(
      { success: false, message: t.unableToFetchPackages },
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
      { success: false, message: t.invalidPackageForm },
      { status: 400 },
    );
  }

  const outbound = buildPlanOutbound(formData);
  if ("error" in outbound) {
    return Response.json(
      { success: false, message: mapPlanOutboundError(outbound.error, t) },
      { status: 400 },
    );
  }

  try {
    const result = await api.post<PackageMutationResponse>("/admin/plans", {
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
          message: error.message || t.unableToSavePackage,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Create plan failed:", error);

    return Response.json(
      { success: false, message: t.unableToSavePackage },
      { status: 500 },
    );
  }
}
