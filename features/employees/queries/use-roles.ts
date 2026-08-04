"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { employeeKeys } from "@/features/employees/query-keys";
import type {
  Role,
  RolesResponse,
} from "@/features/employees/types";
import { extractCollection } from "@/lib/api-payload";

async function fetchRoles(locale: string): Promise<Role[]> {
  const response = await fetch("/api/roles", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
    },
  });

  const payload = (await response.json().catch(() => null)) as
    | RolesResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload || !("success" in payload) || !payload.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Failed to load roles",
    );
  }

  return extractCollection(payload.data, ["data", "roles", "lists"]) as Role[];
}

/** Fetches the canonical role IDs and names from `GET /v1/roles`. */
export function useRoles() {
  const locale = useLocale();

  return useQuery({
    queryKey: [...employeeKeys.roles(), locale],
    queryFn: () => fetchRoles(locale),
    staleTime: 5 * 60 * 1000,
  });
}
