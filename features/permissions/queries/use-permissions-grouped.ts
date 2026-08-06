"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { permissionKeys } from "@/features/permissions/query-keys";
import type {
  ApiPermission,
  ApiPermissionGroup,
  PermissionsGroupedResponse,
} from "@/features/permissions/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parsePermission(entry: unknown): ApiPermission | null {
  if (!isRecord(entry)) return null;

  const id =
    typeof entry.id === "number"
      ? entry.id
      : typeof entry.id === "string" && entry.id.trim()
        ? Number(entry.id)
        : NaN;
  const name = typeof entry.name === "string" ? entry.name.trim() : "";
  const moduleName =
    typeof entry.module === "string"
      ? entry.module.trim()
      : typeof entry.module_name === "string"
        ? entry.module_name.trim()
        : "";
  const guardName =
    typeof entry.guardName === "string"
      ? entry.guardName
      : typeof entry.guard_name === "string"
        ? entry.guard_name
        : "web";
  const createdAt =
    typeof entry.createdAt === "string"
      ? entry.createdAt
      : typeof entry.created_at === "string"
        ? entry.created_at
        : "";
  const updatedAt =
    typeof entry.updatedAt === "string"
      ? entry.updatedAt
      : typeof entry.updated_at === "string"
        ? entry.updated_at
        : "";

  if (!Number.isFinite(id) || !name || !moduleName) {
    return null;
  }

  return {
    id,
    name,
    module: moduleName,
    guardName,
    createdAt,
    updatedAt,
  };
}

function parsePermissionGroup(entry: unknown): ApiPermissionGroup | null {
  if (!isRecord(entry)) return null;

  const moduleName =
    typeof entry.module === "string"
      ? entry.module.trim()
      : typeof entry.name === "string"
        ? entry.name.trim()
        : "";

  if (!moduleName) return null;

  const rawPermissions = Array.isArray(entry.permissions)
    ? entry.permissions
    : [];

  const permissions = rawPermissions
    .map(parsePermission)
    .filter((permission): permission is ApiPermission => permission !== null);

  return { module: moduleName, permissions };
}

/** Normalizes `data` from `GET /v1/permissions/grouped` into typed groups. */
export function mapPermissionsGroupedResponse(
  data: unknown,
): ApiPermissionGroup[] {
  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .map(parsePermissionGroup)
    .filter((group): group is ApiPermissionGroup => group !== null);
}

async function fetchPermissionsGrouped(
  locale: string,
): Promise<ApiPermissionGroup[]> {
  const response = await fetch("/api/permissions/grouped", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
    },
  });

  const payload = (await response.json().catch(() => null)) as
    | PermissionsGroupedResponse
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
        : "Failed to load grouped permissions",
    );
  }

  return mapPermissionsGroupedResponse(payload.data);
}

/** Fetches grouped permissions from `GET /v1/permissions/grouped`. */
export function usePermissionsGrouped() {
  const locale = useLocale();

  return useQuery({
    queryKey: [...permissionKeys.grouped(), locale],
    queryFn: () => fetchPermissionsGrouped(locale),
    staleTime: 5 * 60 * 1000,
  });
}
