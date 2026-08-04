import {
  getAuthToken,
  getAuthTokenType,
} from "@/features/auth/lib/session";
import type {
  AdminsListResponse,
  CreateAdminResponse,
} from "@/features/employees/types";
import { ApiError, api, normalizeApiLocale } from "@/lib/api";
import arMessages from "@/messages/ar.json";
import enMessages from "@/messages/en.json";

function getRouteMessages(locale: ReturnType<typeof normalizeApiLocale>) {
  return (locale === "en" ? enMessages : arMessages).Employees.route;
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
    const result = await api.get<AdminsListResponse>("/admins", {
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
          message: error.message || t.unableToFetch,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Admins list fetch failed:", error);

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

  const name = readFormText(formData, "name");
  const email = readFormText(formData, "email");
  const idNumber = readFormText(formData, "idNumber", "id_number");
  const nationalId = readFormText(formData, "nationalId", "national_id");
  const phone = readFormText(formData, "phone");
  const password = readFormText(formData, "password");
  const passwordConfirmation = readFormText(
    formData,
    "confirmPassword",
    "passwordConfirmation",
    "password_confirmation",
  );
  const status = readFormText(formData, "status") || "active";
  const role = readFormText(formData, "role");
  const avatar = formData.get("avatar");

  if (
    !name ||
    !email ||
    !idNumber ||
    !nationalId ||
    !phone ||
    !password ||
    !passwordConfirmation ||
    !role
  ) {
    return Response.json(
      { success: false, message: t.required },
      { status: 400 },
    );
  }

  const outbound = new FormData();
  outbound.append("name", name);
  outbound.append("email", email);
  outbound.append("id_number", idNumber);
  outbound.append("national_id", nationalId);
  outbound.append("phone", phone);
  outbound.append("password", password);
  outbound.append("password_confirmation", passwordConfirmation);
  outbound.append("status", status);
  outbound.append("role", role);

  if (avatar instanceof File && avatar.size > 0) {
    outbound.append("avatar", avatar, avatar.name);
  }

  try {
    const result = await api.post<CreateAdminResponse>("/admins", {
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
          message: error.message || t.unableToCreate,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Create admin failed:", error);

    return Response.json(
      { success: false, message: t.unableToCreate },
      { status: 500 },
    );
  }
}
