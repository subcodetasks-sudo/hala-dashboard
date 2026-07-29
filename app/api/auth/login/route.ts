import { setAuthCookies } from "@/features/auth/lib/session";
import type { AdminLoginResponse } from "@/features/auth/types";
import { ApiError, api, normalizeApiLocale } from "@/lib/api";
import arMessages from "@/messages/ar.json";
import enMessages from "@/messages/en.json";

type LoginRequestBody = {
  idNumber?: unknown;
  password?: unknown;
  rememberMe?: unknown;
};

function getRouteMessages(locale: ReturnType<typeof normalizeApiLocale>) {
  return (locale === "en" ? enMessages : arMessages).Auth.Login.route;
}

export async function POST(request: Request) {
  const locale = normalizeApiLocale(request.headers.get("accept-language"));
  const t = getRouteMessages(locale);

  let body: LoginRequestBody;

  try {
    body = (await request.json()) as LoginRequestBody;
  } catch {
    return Response.json(
      { success: false, message: t.invalidJson },
      { status: 400 },
    );
  }

  const idNumber =
    typeof body.idNumber === "string" ? body.idNumber.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const rememberMe = body.rememberMe === true;

  if (!idNumber || !password) {
    return Response.json(
      { success: false, message: t.required },
      { status: 400 },
    );
  }

  try {
    const result = await api.post<AdminLoginResponse>("/admin/login", {
      locale,
      body: {
        id_number: idNumber,
        password,
      },
    });

    if (!result.success || !result.data?.token || !result.data?.admin) {
      return Response.json(
        {
          success: false,
          message: result.message || t.loginFailed,
        },
        { status: 401 },
      );
    }

    await setAuthCookies({
      token: result.data.token,
      tokenType: result.data.tokenType || "Bearer",
      admin: result.data.admin,
      rememberMe,
    });

    return Response.json({
      success: true,
      message: result.message,
      data: {
        admin: result.data.admin,
      },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return Response.json(
        {
          success: false,
          message: error.message || t.invalidCredentials,
          data: error.data,
        },
        { status: error.status || 401 },
      );
    }

    console.error("Admin login failed:", error);

    return Response.json(
      { success: false, message: t.unableToSignIn },
      { status: 500 },
    );
  }
}
