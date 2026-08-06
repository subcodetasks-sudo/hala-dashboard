"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { settingsKeys } from "@/features/settings/query-keys";
import type {
  SettingsFormValues,
  SettingsMutationResponse,
} from "@/features/settings/types";
import { buildSettingsFormData } from "@/features/settings/utils/build-settings-form-data";

export type UpsertSettingsInput = {
  values: SettingsFormValues;
  logo?: File;
};

async function upsertSettings(
  locale: string,
  input: UpsertSettingsInput,
): Promise<SettingsMutationResponse> {
  const response = await fetch("/api/settings", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
    },
    body: buildSettingsFormData(input.values, input.logo),
  });

  const payload = (await response.json().catch(() => null)) as
    | SettingsMutationResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload?.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Unable to save settings",
    );
  }

  return payload;
}

export function useUpsertSettings() {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpsertSettingsInput) => upsertSettings(locale, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.all });
    },
  });
}
