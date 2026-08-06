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

  const contentType = request.headers.get("content-type") ?? "";
  let bodyToSend: unknown;

  if (contentType.includes("application/json")) {
    let jsonBody: Record<string, unknown>;
    try {
      jsonBody = (await request.json()) as Record<string, unknown>;
    } catch {
      return Response.json(
        { success: false, message: t.invalidForm },
        { status: 400 },
      );
    }

    const name = typeof jsonBody.name === "string" ? jsonBody.name.trim() : "";
    const email = typeof jsonBody.email === "string" ? jsonBody.email.trim() : "";
    const nationalId =
      typeof jsonBody.nationalId === "string"
        ? jsonBody.nationalId.trim()
        : typeof jsonBody.national_id === "string"
          ? jsonBody.national_id.trim()
          : "";
    const idNumber =
      typeof jsonBody.idNumber === "string"
        ? jsonBody.idNumber.trim()
        : typeof jsonBody.id_number === "string"
          ? jsonBody.id_number.trim()
          : nationalId;
    const phone = typeof jsonBody.phone === "string" ? jsonBody.phone.trim() : "";
    const role = typeof jsonBody.role === "string" ? jsonBody.role.trim() : "";
    const status =
      typeof jsonBody.status === "string" ? jsonBody.status.trim() : "active";
    const password =
      typeof jsonBody.password === "string" ? jsonBody.password.trim() : "";
    const passwordConfirmation =
      typeof jsonBody.confirmPassword === "string"
        ? jsonBody.confirmPassword.trim()
        : typeof jsonBody.password_confirmation === "string"
          ? jsonBody.password_confirmation.trim()
          : password;

    if (!name || !email || !phone || !role) {
      return Response.json(
        { success: false, message: t.required },
        { status: 400 },
      );
    }

    const jsonPayload: Record<string, unknown> = {
      name,
      email,
      id_number: idNumber,
      phone,
      status,
      role,
    };

    if (nationalId) {
      jsonPayload.national_id = nationalId;
    }

    if (password) {
      jsonPayload.password = password;
      jsonPayload.password_confirmation = passwordConfirmation;
    }

    if (jsonBody.avatar !== undefined) {
      jsonPayload.avatar = jsonBody.avatar;
    }

    bodyToSend = jsonPayload;
  } else {
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
    const nationalId = readFormText(formData, "nationalId", "national_id");
    const idNumber =
      readFormText(formData, "idNumber", "id_number") || nationalId;
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

    if (!name || !email || !phone || !role) {
      return Response.json(
        { success: false, message: t.required },
        { status: 400 },
      );
    }

    const outbound = new FormData();
    outbound.append("name", name);
    outbound.append("email", email);
    outbound.append("id_number", idNumber);
    if (nationalId) {
      outbound.append("national_id", nationalId);
    }
    outbound.append("phone", phone);
    outbound.append("status", status);
    outbound.append("role", role);

    if (password) {
      outbound.append("password", password);
      outbound.append("password_confirmation", passwordConfirmation);
    }

    if (avatar instanceof File && avatar.size > 0) {
      outbound.append("avatar", avatar, avatar.name);
    } else if (typeof avatar === "string" && avatar.trim()) {
      outbound.append("avatar", avatar.trim());
    }

    bodyToSend = outbound;
  }

  try {
    const result = await api.post<CreateAdminResponse>("/admins", {
      locale,
      headers: {
        Authorization: `${tokenType} ${token}`,
      },
      body: bodyToSend,
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
