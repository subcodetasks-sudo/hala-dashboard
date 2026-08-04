"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { employeeKeys } from "@/features/employees/query-keys";

async function toggleAdminStatus(
  locale: string,
  adminId: string,
  action: "activate" | "deactivate",
): Promise<{ message: string }> {
  const response = await fetch(
    `/api/admins/${encodeURIComponent(adminId)}/${action}`,
    {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
      },
    },
  );

  const payload = (await response.json().catch(() => null)) as
    | { success?: boolean; message?: string }
    | null;

  if (!response.ok || !payload || !payload.success) {
    throw new Error(
      payload?.message ||
        (action === "deactivate"
          ? "Unable to deactivate account"
          : "Unable to activate account"),
    );
  }

  return {
    message: payload.message || "",
  };
}

export function useDeactivateAdmin() {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (adminId: string) =>
      toggleAdminStatus(locale, adminId, "deactivate"),
    onSuccess: (_data, adminId) => {
      void queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      void queryClient.invalidateQueries({
        queryKey: employeeKeys.indicators(),
      });
      void queryClient.invalidateQueries({
        queryKey: employeeKeys.detail(adminId),
      });
    },
  });
}

export function useActivateAdmin() {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (adminId: string) =>
      toggleAdminStatus(locale, adminId, "activate"),
    onSuccess: (_data, adminId) => {
      void queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      void queryClient.invalidateQueries({
        queryKey: employeeKeys.indicators(),
      });
      void queryClient.invalidateQueries({
        queryKey: employeeKeys.detail(adminId),
      });
    },
  });
}
