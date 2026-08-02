import { AUTH_ADMIN_COOKIE, AUTH_TOKEN_COOKIE } from "@/features/auth/lib/constants";
import { can } from "@/features/auth/lib/can";
import type { Employee } from "@/features/profile/types";
import { routing } from "@/i18n/routing";
import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";

const handleI18nRouting = createMiddleware(routing);

/** Routes that do not require an auth session */
const publicPathnames = ["/login"];

const localePrefixPattern = new RegExp(
  `^(/(${routing.locales.join("|")}))?(?=/|$)`,
  "i",
);

const publicPathnameRegex = RegExp(
  `^(/(${routing.locales.join("|")}))?(${publicPathnames
    .flatMap((path) => (path === "/" ? ["", "/"] : path))
    .join("|")})/?$`,
  "i",
);

function getLocaleFromPathname(pathname: string) {
  const match = pathname.match(localePrefixPattern);
  const locale = match?.[2];

  if (
    locale &&
    routing.locales.includes(locale as (typeof routing.locales)[number])
  ) {
    return locale;
  }

  return routing.defaultLocale;
}

function getPathnameWithoutLocale(pathname: string) {
  const match = pathname.match(localePrefixPattern);
  const locale = match?.[2];

  if (
    locale &&
    routing.locales.includes(locale as (typeof routing.locales)[number])
  ) {
    const stripped = pathname.slice(locale.length + 1) || "/";
    return stripped.startsWith("/") ? stripped : `/${stripped}`;
  }

  return pathname;
}

function localizedPath(locale: string, path: string) {
  if (locale === routing.defaultLocale) {
    return path;
  }

  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

function getAuthAdminFromRequest(request: NextRequest): Employee | null {
  const raw = request.cookies.get(AUTH_ADMIN_COOKIE)?.value;

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as Employee;
  } catch {
    return null;
  }
}

function redirectHome(request: NextRequest, locale: string) {
  const homeUrl = request.nextUrl.clone();
  homeUrl.pathname = localizedPath(locale, "/");
  homeUrl.search = "";
  return NextResponse.redirect(homeUrl);
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(AUTH_TOKEN_COOKIE)?.value);
  const isPublicPage = publicPathnameRegex.test(pathname);
  const locale = getLocaleFromPathname(pathname);

  if (!hasSession && !isPublicPage) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = localizedPath(locale, "/login");
    loginUrl.search = "";
    return NextResponse.redirect(loginUrl);
  }

  if (hasSession && isPublicPage) {
    return redirectHome(request, locale);
  }

  if (hasSession) {
    const permissions = can(getAuthAdminFromRequest(request));
    const pathnameWithoutLocale = getPathnameWithoutLocale(pathname);

    if (!permissions.accessPath(pathnameWithoutLocale)) {
      return redirectHome(request, locale);
    }
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
