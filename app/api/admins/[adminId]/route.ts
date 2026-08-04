import {
  getAuthToken,
  getAuthTokenType,
} from "@/features/auth/lib/session";
import type {
  AdminDetailResponse,
  UpdateAdminResponse,
} from "@/features/employees/types";
import { ApiError, api, normalizeApiLocale } from "@/lib/api";
import arMessages from "@/messages/ar.json";
import enMessages from "@/messages/en.json";

type RouteContext = {
  params: Promise<{ adminId: string }>;
};

function getRouteMessages(locale: ReturnType<typeof normalizeApiLocale>) {
  return (locale === "en" ? enMessages : arMessages).Employees.route;
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

export async function GET(request: Request, context: RouteContext) {
  const locale = normalizeApiLocale(request.headers.get("accept-language"));
  const t = getRouteMessages(locale);
  const { adminId } = await context.params;

  if (!adminId?.trim()) {
    return Response.json(
      { success: false, message: t.unableToFetch },
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
    const result = await api.get<AdminDetailResponse>(
      `/admins/${encodeURIComponent(adminId.trim())}`,
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
          message: error.message || t.unableToFetch,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Admin detail fetch failed:", error);

    return Response.json(
      { success: false, message: t.unableToFetch },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const locale = normalizeApiLocale(request.headers.get("accept-language"));
  const t = getRouteMessages(locale);
  const { adminId } = await context.params;

  if (!adminId?.trim()) {
    return Response.json(
      { success: false, message: t.unableToUpdate },
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

  if (!name || !email || !idNumber || !nationalId || !phone || !role) {
    return Response.json(
      { success: false, message: t.requiredUpdate },
      { status: 400 },
    );
  }

  // Password is optional on update; when sent, confirmation must match.
  if (password && !passwordConfirmation) {
    return Response.json(
      { success: false, message: t.requiredUpdate },
      { status: 400 },
    );
  }

  const outbound = new FormData();
  outbound.append("name", name);
  outbound.append("email", email);
  outbound.append("id_number", idNumber);
  outbound.append("national_id", nationalId);
  outbound.append("phone", phone);
  outbound.append("status", status);
  outbound.append("role", role);

  if (password) {
    outbound.append("password", password);
    outbound.append("password_confirmation", passwordConfirmation);
  }

  if (avatar instanceof File && avatar.size > 0) {
    outbound.append("avatar", avatar, avatar.name);
  }

  try {
    const result = await api.put<UpdateAdminResponse>(
      `/admins/${encodeURIComponent(adminId.trim())}`,
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
          message: error.message || t.unableToUpdate,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Update admin failed:", error);

    return Response.json(
      { success: false, message: t.unableToUpdate },
      { status: 500 },
    );
  }
}
