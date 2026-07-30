import type { HomeEmployeeRoleKey } from "@/features/employees/types";

/**
 * Role names from `/v1/roles` behind each home dashboard employee card.
 * Matching is exact (case and separator insensitive), so a new backend role
 * has to be listed here to be counted.
 */
export const HOME_EMPLOYEE_ROLE_GROUPS: readonly {
  key: HomeEmployeeRoleKey;
  roleNames: readonly string[];
}[] = [
  {
    key: "review",
    roleNames: ["review-officer", "review", "reviewer"],
  },
  {
    key: "dataProcessing",
    roleNames: ["data-entry", "data-processing"],
  },
  {
    key: "contractFollowUp",
    roleNames: ["contract-officer", "contract-follow-up"],
  },
] as const;

export const AVATAR_FALLBACK_CLASSES = [
  "bg-brand-primary",
  "bg-brand-accent",
  "bg-brand-success",
  "bg-[#E8913A]",
  "bg-[#8B6BB5]",
] as const;
