"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { contentManagementKeys } from "@/features/content-management/query-keys";
import type {
  BlogFormValues,
  BlogMutationResponse,
} from "@/features/content-management/types";
import { buildBlogFormData } from "@/features/content-management/utils/build-blog-form-data";

export type CreateBlogInput = {
  values: BlogFormValues;
  image?: File;
};

async function createBlog(
  locale: string,
  input: CreateBlogInput,
): Promise<BlogMutationResponse> {
  const response = await fetch("/api/content-management/blogs", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
    },
    body: buildBlogFormData(input.values, input.image),
  });

  const payload = (await response.json().catch(() => null)) as
    | BlogMutationResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload?.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Unable to create blog",
    );
  }

  return payload;
}

export function useCreateBlog() {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateBlogInput) => createBlog(locale, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contentManagementKeys.blogs(),
      });
    },
  });
}
