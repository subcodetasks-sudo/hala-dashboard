"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { contentManagementKeys } from "@/features/content-management/query-keys";
import {
  BLOGS_PER_PAGE,
  DEFAULT_BLOG_FILTERS,
} from "@/features/content-management/schemas/blog-form-schema";
import type {
  BlogFilterValues,
  BlogsListResponse,
  BlogsListResult,
} from "@/features/content-management/types";
import { mapBlogToRow } from "@/features/content-management/utils/map-blog-to-row";
import {
  extractCollection,
  extractPaginationMeta,
} from "@/lib/api-payload";
import type { AppLocale } from "@/lib/format-datetime";

function buildSearchParams(
  filters: BlogFilterValues,
  page: number,
  perPage: number,
): URLSearchParams {
  const params = new URLSearchParams();

  const search = filters.search.trim();
  if (search) {
    params.set("search", search);
  }

  if (filters.status !== "all") {
    params.set("filter[status]", filters.status);
  }

  params.set("per_page", String(perPage));
  params.set("page", String(page));

  return params;
}

async function fetchBlogs(
  locale: string,
  filters: BlogFilterValues,
  page: number,
  perPage: number,
): Promise<BlogsListResult> {
  const params = buildSearchParams(filters, page, perPage);

  const response = await fetch(
    `/api/content-management/blogs?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
      },
    },
  );

  const payload = (await response.json().catch(() => null)) as
    | BlogsListResponse
    | { success?: false; message?: string }
    | null;

  if (
    !response.ok ||
    !payload ||
    !("success" in payload) ||
    !payload.success
  ) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Failed to load blogs",
    );
  }

  const items = extractCollection(payload.data)
    .map((entry) => mapBlogToRow(entry, locale as AppLocale))
    .filter((row): row is NonNullable<typeof row> => row !== null);

  const meta = extractPaginationMeta(payload.data, {
    fallbackPage: page,
    fallbackPerPage: perPage,
    itemCount: items.length,
  });

  return {
    items,
    currentPage: meta.currentPage,
    lastPage: meta.lastPage,
    perPage: meta.perPage,
    total: meta.total,
  };
}

export function useBlogs(
  page = 1,
  perPage = BLOGS_PER_PAGE,
  filters: BlogFilterValues = DEFAULT_BLOG_FILTERS,
) {
  const locale = useLocale();

  return useQuery({
    queryKey: [
      ...contentManagementKeys.blogsList(page, perPage, filters),
      locale,
    ],
    queryFn: () => fetchBlogs(locale, filters, page, perPage),
  });
}
