import { getAuthAdmin } from "@/features/auth/lib/session";
import { normalizeApiLocale } from "@/lib/api";
import arMessages from "@/messages/ar.json";
import enMessages from "@/messages/en.json";

function getRouteMessages(locale: ReturnType<typeof normalizeApiLocale>) {
  return (locale === "en" ? enMessages : arMessages).Profile.route;
}

export async function GET(request: Request) {
  const locale = normalizeApiLocale(request.headers.get("accept-language"));
  const t = getRouteMessages(locale);

  const admin = await getAuthAdmin();

  if (!admin) {
    return Response.json(
      { success: false, message: t.unauthorized },
      { status: 401 },
    );
  }

  return Response.json({
    success: true,
    message: t.success,
    data: admin,
  });
}
