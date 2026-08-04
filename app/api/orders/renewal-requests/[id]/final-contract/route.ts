import {
  getAuthToken,
  getAuthTokenType,
} from "@/features/auth/lib/session";
import type { UploadFinalContractResponse } from "@/features/orders/types";
import { ApiError, api, normalizeApiLocale } from "@/lib/api";
import arMessages from "@/messages/ar.json";
import enMessages from "@/messages/en.json";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function getRouteMessages(locale: ReturnType<typeof normalizeApiLocale>) {
  return (locale === "en" ? enMessages : arMessages).Orders.Verification
    .uploadFinalContractDialog.route;
}

export async function POST(request: Request, context: RouteContext) {
  const locale = normalizeApiLocale(request.headers.get("accept-language"));
  const t = getRouteMessages(locale);
  const { id } = await context.params;

  if (!id?.trim()) {
    return Response.json(
      { success: false, message: t.invalidId },
      { status: 400 },
    );
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return Response.json(
      { success: false, message: t.invalidForm },
      { status: 400 },
    );
  }

  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return Response.json(
      { success: false, message: t.fileRequired },
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

  const outbound = new FormData();
  outbound.append("file", file, file.name);

  try {
    const result = await api.post<UploadFinalContractResponse>(
      `/admin/renewal-requests/${encodeURIComponent(id.trim())}/final-contract`,
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

    console.error("Upload final contract failed:", error);

    return Response.json(
      { success: false, message: t.unableToComplete },
      { status: 500 },
    );
  }
}
