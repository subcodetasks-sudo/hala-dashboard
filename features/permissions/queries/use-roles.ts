"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { permissionKeys } from "@/features/permissions/query-keys";
import type {
  PermissionRoleRow,
  RolesListResponse,
} from "@/features/permissions/types";
import { mapRoleToRow } from "@/features/permissions/utils/map-role-to-row";
import { extractCollection } from "@/lib/api-payload";

async function fetchRoles(locale: string): Promise<PermissionRoleRow[]> {
  const response = await fetch("/api/roles", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
    },
  });

  const payload = (await response.json().catch(() => null)) as
    | RolesListResponse
    | { success?: false; message?: string }
    | null;

  if (
    !response.ok ||
    !payload ||
    !("success" in payload) ||
    payload.success !== true
  ) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Failed to load roles",
    );
  }

  return extractCollection(payload.data, ["data", "roles", "lists"])
    .map(mapRoleToRow)
    .filter((row): row is PermissionRoleRow => row !== null);
}

/** Fetches roles from `GET /v1/roles` via `/api/roles`. */
export function useRoles() {
  const locale = useLocale();

  return useQuery({
    queryKey: [...permissionKeys.roles(), locale],
    queryFn: () => fetchRoles(locale),
    staleTime: 60 * 1000,
  });
}
