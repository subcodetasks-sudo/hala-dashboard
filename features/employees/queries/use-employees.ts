"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { employeeKeys } from "@/features/employees/query-keys";
import type {
  AdminDetailResponse,
  EmployeeDetail,
} from "@/features/employees/types";
import { mapAdminToEmployeeDetail } from "@/features/employees/utils/map-admin-to-employee-row";
import type { AppLocale } from "@/lib/format-datetime";

export type { EmployeeIndicators } from "@/features/employees/queries/use-employee-indicators";
export { useEmployeeIndicators } from "@/features/employees/queries/use-employee-indicators";

async function fetchEmployee(
  locale: string,
  employeeId: string,
): Promise<EmployeeDetail | null> {
  const response = await fetch(
    `/api/admins/${encodeURIComponent(employeeId)}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
      },
    },
  );

  const payload = (await response.json().catch(() => null)) as
    | AdminDetailResponse
    | { success?: false; message?: string }
    | null;

  if (response.status === 404) {
    return null;
  }

  if (!response.ok || !payload || !("success" in payload) || !payload.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Failed to load employee",
    );
  }

  const appLocale: AppLocale = locale === "en" ? "en" : "ar";
  return mapAdminToEmployeeDetail(payload.data, appLocale);
}

/**
 * Single employee profile for the details page (`GET /admins/:id`).
 */
export function useEmployee(employeeId: string) {
  const locale = useLocale();

  return useQuery({
    queryKey: [...employeeKeys.detail(employeeId), locale],
    queryFn: () => fetchEmployee(locale, employeeId),
    enabled: Boolean(employeeId),
  });
}
