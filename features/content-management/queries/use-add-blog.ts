"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addBlogToStore } from "@/features/content-management/mock-data";
import { contentManagementKeys } from "@/features/content-management/query-keys";
import type {
  AddBlogFormValues,
  ContentRow,
} from "@/features/content-management/types";

async function createBlog(values: AddBlogFormValues): Promise<ContentRow> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const now = new Date();
  const row: ContentRow = {
    id: `blog-${now.getTime()}`,
    category: "blog",
    title: values.title,
    summary: values.summary,
    keywords: values.keywords,
    content: values.content,
    readingTime: values.readingTime,
    typeLabel: "Blog",
    updatedDate: now.toLocaleDateString("ar-SA", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    updatedTime: now.toLocaleTimeString("ar-SA", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    updatedAtIso: now.toISOString().slice(0, 10),
    appearance: "blogPage",
    author: "systemAdmin",
    status: values.status,
  };

  return addBlogToStore(row);
}

/**
 * Creates a blog article and refreshes list + indicators.
 */
export function useAddBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contentManagementKeys.all,
      });
    },
  });
}
