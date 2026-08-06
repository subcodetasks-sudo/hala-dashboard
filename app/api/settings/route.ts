import {
  getAuthToken,
  getAuthTokenType,
} from "@/features/auth/lib/session";
import type {
  SettingsMutationResponse,
  SettingsShowResponse,
} from "@/features/settings/types";
import { ApiError, api, normalizeApiLocale } from "@/lib/api";
import arMessages from "@/messages/ar.json";
import enMessages from "@/messages/en.json";

function getRouteMessages(locale: ReturnType<typeof normalizeApiLocale>) {
  return (locale === "en" ? enMessages : arMessages).Settings.route;
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

function buildSettingsOutbound(
  formData: FormData,
): FormData | { error: "required" | "email" | "taxAmount" } {
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
  const phone = readFormText(formData, "phone");
  const email = readFormText(formData, "email");
  const facebook = readFormText(formData, "facebook");
  const twitter = readFormText(formData, "twitter");
  const instagram = readFormText(formData, "instagram");
  const linkedin = readFormText(formData, "linkedin");
  const youtube = readFormText(formData, "youtube");
  const tiktok = readFormText(formData, "tiktok");
  const snapchat = readFormText(formData, "snapchat");
  const whatsapp = readFormText(formData, "whatsapp");
  const commercialRegister = readFormText(
    formData,
    "commercial_register",
    "commercialRegister",
  );
  const taxNumber = readFormText(formData, "tax_number", "taxNumber");
  const taxAmount = readFormText(formData, "tax_amount", "taxAmount") || "0";
  const logo = formData.get("logo");

  if (!descriptionAr || !descriptionEn || !phone || !email) {
    return { error: "required" };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "email" };
  }

  if (Number.isNaN(Number(taxAmount)) || Number(taxAmount) < 0) {
    return { error: "taxAmount" };
  }

  const outbound = new FormData();
  outbound.append("description[ar]", descriptionAr);
  outbound.append("description[en]", descriptionEn);
  outbound.append("phone", phone);
  outbound.append("email", email);
  outbound.append("facebook", facebook);
  outbound.append("twitter", twitter);
  outbound.append("instagram", instagram);
  outbound.append("linkedin", linkedin);
  outbound.append("youtube", youtube);
  outbound.append("tiktok", tiktok);
  outbound.append("snapchat", snapchat);
  outbound.append("whatsapp", whatsapp);
  outbound.append("commercial_register", commercialRegister);
  outbound.append("tax_number", taxNumber);
  outbound.append("tax_amount", taxAmount);

  if (logo instanceof File && logo.size > 0) {
    outbound.append("logo", logo, logo.name);
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
    const result = await api.get<SettingsShowResponse>("/admin/settings", {
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
          message: error.message || t.unableToFetch,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Settings fetch failed:", error);

    return Response.json(
      { success: false, message: t.unableToFetch },
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
      { success: false, message: t.invalidForm },
      { status: 400 },
    );
  }

  const outbound = buildSettingsOutbound(formData);
  if ("error" in outbound) {
    const message =
      outbound.error === "email"
        ? t.emailInvalid
        : outbound.error === "taxAmount"
          ? t.taxAmountInvalid
          : t.required;

    return Response.json({ success: false, message }, { status: 400 });
  }

  try {
    const result = await api.post<SettingsMutationResponse>("/admin/settings", {
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
          message: error.message || t.unableToSave,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Settings save failed:", error);

    return Response.json(
      { success: false, message: t.unableToSave },
      { status: 500 },
    );
  }
}
