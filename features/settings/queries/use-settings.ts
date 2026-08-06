"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { settingsKeys } from "@/features/settings/query-keys";
import type {
  SettingsApiItem,
  SettingsShowResponse,
} from "@/features/settings/types";

async function fetchSettings(locale: string): Promise<SettingsApiItem | null> {
  const response = await fetch("/api/settings", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
    },
  });

  const payload = (await response.json().catch(() => null)) as
    | SettingsShowResponse
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
        : "Failed to load settings",
    );
  }

  return payload.data ?? null;
}

export function useSettings() {
  const locale = useLocale();

  return useQuery({
    queryKey: [...settingsKeys.detail(), locale],
    queryFn: () => fetchSettings(locale),
  });
}
