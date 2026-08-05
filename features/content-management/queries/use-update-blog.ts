"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { contentManagementKeys } from "@/features/content-management/query-keys";
import type {
  BlogFormValues,
  BlogMutationResponse,
} from "@/features/content-management/types";
import { buildBlogFormData } from "@/features/content-management/utils/build-blog-form-data";

export type UpdateBlogInput = {
  id: number;
  values: BlogFormValues;
  image?: File;
};

async function updateBlog(
  locale: string,
  input: UpdateBlogInput,
): Promise<BlogMutationResponse> {
  const response = await fetch(
    `/api/content-management/blogs/${encodeURIComponent(String(input.id))}`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
      },
      body: buildBlogFormData(input.values, input.image),
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
        : "Unable to update blog",
    );
  }

  return payload;
}

export function useUpdateBlog() {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateBlogInput) => updateBlog(locale, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contentManagementKeys.blogs(),
      });
    },
  });
}
