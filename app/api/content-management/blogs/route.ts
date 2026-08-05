import {
  getAuthToken,
  getAuthTokenType,
} from "@/features/auth/lib/session";
import type {
  BlogMutationResponse,
  BlogsListResponse,
} from "@/features/content-management/types";
import {
  buildBlogOutbound,
  mapBlogOutboundError,
} from "@/features/content-management/utils/build-blog-outbound";
import { ApiError, api, normalizeApiLocale } from "@/lib/api";
import arMessages from "@/messages/ar.json";
import enMessages from "@/messages/en.json";

function getRouteMessages(locale: ReturnType<typeof normalizeApiLocale>) {
  return (locale === "en" ? enMessages : arMessages).ContentManagement.route;
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
    const result = await api.get<BlogsListResponse>("/admin/blogs", {
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
          message: error.message || t.unableToFetchBlogs,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Blogs list fetch failed:", error);

    return Response.json(
      { success: false, message: t.unableToFetchBlogs },
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
      { success: false, message: t.invalidBlogForm },
      { status: 400 },
    );
  }

  const outbound = buildBlogOutbound(formData);
  if ("error" in outbound) {
    return Response.json(
      { success: false, message: mapBlogOutboundError(outbound.error, t) },
      { status: 400 },
    );
  }

  try {
    const result = await api.post<BlogMutationResponse>("/admin/blogs", {
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
          message: error.message || t.unableToSaveBlog,
          data: error.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Create blog failed:", error);

    return Response.json(
      { success: false, message: t.unableToSaveBlog },
      { status: 500 },
    );
  }
}
