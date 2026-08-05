import {
  getAuthToken,
  getAuthTokenType,
} from "@/features/auth/lib/session";
import type {
  SupportCardMutationResponse,
  SupportCardsListResponse,
} from "@/features/content-management/types";
import {
  legalBackendBasePath,
  parseLegalPageKind,
} from "@/features/content-management/utils/legal-page";
import { ApiError, api, normalizeApiLocale } from "@/lib/api";
import arMessages from "@/messages/ar.json";
import enMessages from "@/messages/en.json";

type RouteContext = {
  params: Promise<{ page: string }>;
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

function buildSupportCardOutbound(
  formData: FormData,
): FormData | { error: "required" | "cardNumber" | "buttonType" } {
  const cardNumber = readFormText(formData, "card_number", "cardNumber");
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
  const buttonType = readFormText(formData, "button_type", "buttonType");
  const buttonValue = readFormText(formData, "button_value", "buttonValue");
  const buttonLabelAr = readFormText(
    formData,
    "button_label[ar]",
    "button_label_ar",
  );
  const buttonLabelEn = readFormText(
    formData,
    "button_label[en]",
    "button_label_en",
  );
  const image = formData.get("image");

  if (cardNumber !== "1" && cardNumber !== "2") {
    return { error: "cardNumber" };
  }

  if (buttonType !== "phone" && buttonType !== "email") {
    return { error: "buttonType" };
  }

  if (
    !titleAr ||
    !titleEn ||
    !descriptionAr ||
    !descriptionEn ||
    !buttonValue ||
    !buttonLabelAr ||
    !buttonLabelEn
  ) {
    return { error: "required" };
  }

  const outbound = new FormData();
  outbound.append("card_number", cardNumber);
  outbound.append("title[ar]", titleAr);
  outbound.append("title[en]", titleEn);
  outbound.append("description[ar]", descriptionAr);
  outbound.append("description[en]", descriptionEn);
  outbound.append("button_type", buttonType);
  outbound.append("button_value", buttonValue);
  outbound.append("button_label[ar]", buttonLabelAr);
  outbound.append("button_label[en]", buttonLabelEn);
  outbound.append("status", "active");

  if (image instanceof File && image.size > 0) {
    outbound.append("image", image, image.name);
  }

  return outbound;
}

export async function GET(request: Request, context: RouteContext) {
  const locale = normalizeApiLocale(request.headers.get("accept-language"));
  const t = getRouteMessages(locale);
  const { page: pageParam } = await context.params;
  const page = parseLegalPageKind(pageParam);

  if (page !== "support") {
    return Response.json(
      { success: false, message: t.invalidLegalPage },
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
    const result = await api.get<SupportCardsListResponse>(
      `${legalBackendBasePath(page)}/cards`,
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
          message: error.message || t.unableToFetchSupportCards,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Support cards fetch failed:", error);

    return Response.json(
      { success: false, message: t.unableToFetchSupportCards },
      { status: 500 },
    );
  }
}

export async function POST(request: Request, context: RouteContext) {
  const locale = normalizeApiLocale(request.headers.get("accept-language"));
  const t = getRouteMessages(locale);
  const { page: pageParam } = await context.params;
  const page = parseLegalPageKind(pageParam);

  if (page !== "support") {
    return Response.json(
      { success: false, message: t.invalidLegalPage },
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
      { success: false, message: t.invalidSupportCardForm },
      { status: 400 },
    );
  }

  const outbound = buildSupportCardOutbound(formData);
  if ("error" in outbound) {
    const message =
      outbound.error === "cardNumber"
        ? t.supportCardNumberInvalid
        : outbound.error === "buttonType"
          ? t.supportCardButtonTypeInvalid
          : t.supportCardRequired;

    return Response.json({ success: false, message }, { status: 400 });
  }

  try {
    const result = await api.post<SupportCardMutationResponse>(
      `${legalBackendBasePath(page)}/cards`,
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
          message: error.message || t.unableToSaveSupportCard,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Support card upsert failed:", error);

    return Response.json(
      { success: false, message: t.unableToSaveSupportCard },
      { status: 500 },
    );
  }
}
