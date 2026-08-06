"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { permissionKeys } from "@/features/permissions/query-keys";
import type {
  PermissionRoleRow,
  RoleDetailResponse,
} from "@/features/permissions/types";
import { mapRoleToRow } from "@/features/permissions/utils/map-role-to-row";

async function fetchRole(
  locale: string,
  roleId: string,
): Promise<PermissionRoleRow | null> {
  const response = await fetch(
    `/api/roles/${encodeURIComponent(roleId)}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
      },
    },
  );

  const payload = (await response.json().catch(() => null)) as
    | RoleDetailResponse
    | { success?: false; message?: string }
    | null;

  if (response.status === 404) {
    return null;
  }

  if (
    !response.ok ||
    !payload ||
    !("success" in payload) ||
    payload.success !== true ||
    !("data" in payload) ||
    !payload.data
  ) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Failed to load role",
    );
  }

  const row = mapRoleToRow(payload.data);
  if (!row) {
    throw new Error("Failed to load role");
  }

  return row;
}

/** Fetches a single role from `GET /v1/roles/:id` via `/api/roles/:roleId`. */
export function useRole(roleId: string) {
  const locale = useLocale();

  return useQuery({
    queryKey: [...permissionKeys.role(roleId), locale],
    queryFn: () => fetchRole(locale, roleId),
    enabled: Boolean(roleId.trim()),
    staleTime: 60 * 1000,
  });
}
