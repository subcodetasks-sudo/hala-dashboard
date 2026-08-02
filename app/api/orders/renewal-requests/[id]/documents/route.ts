import {
  getAuthToken,
  getAuthTokenType,
} from "@/features/auth/lib/session";
import type {
  DocumentCollection,
  UploadRenewalDocumentResponse,
} from "@/features/orders/types";
import { ApiError, api, normalizeApiLocale } from "@/lib/api";
import arMessages from "@/messages/ar.json";
import enMessages from "@/messages/en.json";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const DOCUMENT_COLLECTIONS = new Set<DocumentCollection>([
  "national_id_image",
  "iqama_image",
  "passport_image",
  "exit_reentry_visa",
  "employer_signature",
  "worker_signature",
]);

function getRouteMessages(locale: ReturnType<typeof normalizeApiLocale>) {
  return (locale === "en" ? enMessages : arMessages).Orders.Pending
    .replaceDocumentDialog.route;
}

function isDocumentCollection(value: unknown): value is DocumentCollection {
  return (
    typeof value === "string" &&
    DOCUMENT_COLLECTIONS.has(value as DocumentCollection)
  );
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

  const collection = formData.get("collection");
  const file = formData.get("file");

  if (!isDocumentCollection(collection)) {
    return Response.json(
      { success: false, message: t.collectionRequired },
      { status: 400 },
    );
  }

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
  outbound.append("collection", collection);
  outbound.append("file", file, file.name);

  try {
    const result = await api.post<UploadRenewalDocumentResponse>(
      `/admin/renewal-requests/${encodeURIComponent(id.trim())}/documents`,
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

    console.error("Upload renewal document failed:", error);

    return Response.json(
      { success: false, message: t.unableToComplete },
      { status: 500 },
    );
  }
}
