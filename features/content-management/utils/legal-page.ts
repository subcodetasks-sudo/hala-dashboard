import type { LegalPageKind } from "@/features/content-management/types";

export function parseLegalPageKind(value: string): LegalPageKind | null {
  if (value === "terms" || value === "privacy" || value === "support") {
    return value;
  }
  return null;
}

export function legalBackendBasePath(page: LegalPageKind): string {
  return `/admin/legal/${page}`;
}
