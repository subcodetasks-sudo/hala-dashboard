"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { contentManagementKeys } from "@/features/content-management/query-keys";
import type {
  WorkStepsHeaderApiItem,
  WorkStepsHeaderShowResponse,
} from "@/features/content-management/types";

async function fetchWorkStepsHeader(
  locale: string,
): Promise<WorkStepsHeaderApiItem | null> {
  const response = await fetch("/api/content-management/work-steps/header", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
    },
  });

  const payload = (await response.json().catch(() => null)) as
    | WorkStepsHeaderShowResponse
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
        : "Failed to load work steps header",
    );
  }

  return payload.data ?? null;
}

export function useWorkStepsHeader() {
  const locale = useLocale();

  return useQuery({
    queryKey: [...contentManagementKeys.workStepsHeader(), locale],
    queryFn: () => fetchWorkStepsHeader(locale),
  });
}
