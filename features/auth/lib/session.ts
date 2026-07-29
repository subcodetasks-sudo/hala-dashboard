import type { AuthSession } from "@/features/auth/types";
import type { Employee } from "@/features/profile/types";
import {
  AUTH_ADMIN_COOKIE,
  AUTH_TOKEN_COOKIE,
  AUTH_TOKEN_TYPE_COOKIE,
  REMEMBER_ME_MAX_AGE_SECONDS,
  SESSION_MAX_AGE_SECONDS,
} from "@/features/auth/lib/constants";
import { cookies } from "next/headers";

export {
  AUTH_ADMIN_COOKIE,
  AUTH_TOKEN_COOKIE,
  AUTH_TOKEN_TYPE_COOKIE,
} from "@/features/auth/lib/constants";

type SetAuthCookiesInput = {
  token: string;
  tokenType: string;
  admin: Employee;
  rememberMe?: boolean;
};

function cookieOptions(rememberMe: boolean) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    ...(rememberMe
      ? { maxAge: REMEMBER_ME_MAX_AGE_SECONDS }
      : { maxAge: SESSION_MAX_AGE_SECONDS }),
  };
}

export async function setAuthCookies({
  token,
  tokenType,
  admin,
  rememberMe = false,
}: SetAuthCookiesInput) {
  const cookieStore = await cookies();
  const options = cookieOptions(rememberMe);

  cookieStore.set(AUTH_TOKEN_COOKIE, token, options);
  cookieStore.set(AUTH_TOKEN_TYPE_COOKIE, tokenType, options);
  cookieStore.set(AUTH_ADMIN_COOKIE, JSON.stringify(admin), options);
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();

  cookieStore.delete(AUTH_TOKEN_COOKIE);
  cookieStore.delete(AUTH_TOKEN_TYPE_COOKIE);
  cookieStore.delete(AUTH_ADMIN_COOKIE);
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_TOKEN_COOKIE)?.value ?? null;
}

export async function getAuthTokenType(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_TOKEN_TYPE_COOKIE)?.value ?? "Bearer";
}

export async function getAuthAdmin(): Promise<Employee | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(AUTH_ADMIN_COOKIE)?.value;

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as Employee;
  } catch {
    return null;
  }
}

export async function getAuthSession(): Promise<AuthSession | null> {
  const [token, tokenType, admin] = await Promise.all([
    getAuthToken(),
    getAuthTokenType(),
    getAuthAdmin(),
  ]);

  if (!token || !admin) {
    return null;
  }

  return { token, tokenType, admin };
}
