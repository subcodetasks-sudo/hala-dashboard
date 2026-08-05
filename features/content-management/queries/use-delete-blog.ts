"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { contentManagementKeys } from "@/features/content-management/query-keys";
import type { BlogMutationResponse } from "@/features/content-management/types";

async function deleteBlog(
  locale: string,
  id: number,
): Promise<BlogMutationResponse> {
  const response = await fetch(
    `/api/content-management/blogs/${encodeURIComponent(String(id))}`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
      },
    },
  );

  const payload = (await response.json().catch(() => null)) as
    | BlogMutationResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload?.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Unable to delete blog",
    );
  }

  return payload;
}

export function useDeleteBlog() {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteBlog(locale, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contentManagementKeys.blogs(),
      });
    },
  });
}
