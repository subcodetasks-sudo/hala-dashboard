import {
  getAuthToken,
  getAuthTokenType,
} from "@/features/auth/lib/session";
import type { PackageMutationResponse } from "@/features/pricing/types";
import {
  buildPlanOutbound,
  mapPlanOutboundError,
} from "@/features/pricing/utils/build-plan-outbound";
import { ApiError, api, normalizeApiLocale } from "@/lib/api";
import arMessages from "@/messages/ar.json";
import enMessages from "@/messages/en.json";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function getRouteMessages(locale: ReturnType<typeof normalizeApiLocale>) {
  return (locale === "en" ? enMessages : arMessages).Pricing.route;
}

export async function PUT(request: Request, context: RouteContext) {
  const locale = normalizeApiLocale(request.headers.get("accept-language"));
  const t = getRouteMessages(locale);
  const { id } = await context.params;

  if (!id?.trim()) {
    return Response.json(
      { success: false, message: t.invalidPackageId },
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

  // Laravel ignores multipart bodies on real PUT; spoof via POST + _method.
  outbound.append("_method", "PUT");

  try {
    const result = await api.post<PackageMutationResponse>(
      `/admin/plans/${encodeURIComponent(id.trim())}`,
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
          message: error.message || t.unableToSavePackage,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Update plan failed:", error);

    return Response.json(
      { success: false, message: t.unableToSavePackage },
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
      { success: false, message: t.invalidPackageId },
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
    const result = await api.delete<PackageMutationResponse>(
      `/admin/plans/${encodeURIComponent(id.trim())}`,
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
      data: result.data ?? null,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return Response.json(
        {
          success: false,
          message: error.message || t.unableToDeletePackage,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Delete plan failed:", error);

    return Response.json(
      { success: false, message: t.unableToDeletePackage },
      { status: 500 },
    );
  }
}
