import { AUTH_TOKEN_COOKIE } from "@/features/auth/lib/constants";
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

function localizedPath(locale: string, path: string) {
  if (locale === routing.defaultLocale) {
    return path;
  }

  return path === "/" ? `/${locale}` : `/${locale}${path}`;
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
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = localizedPath(locale, "/");
    homeUrl.search = "";
    return NextResponse.redirect(homeUrl);
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
