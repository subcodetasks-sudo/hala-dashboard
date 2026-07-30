import type { Employee } from "@/features/profile/types";

export type { Employee, EmployeeRole } from "@/features/profile/types";

/** Query params for `GET /admins`. */
export type AdminsListFilters = {
  search?: string;
  status?: string;
  role?: string;
  createdFrom?: string;
  createdTo?: string;
  sort?: string;
  perPage?: number;
  page?: number;
};

/** Paginator wrapper returned by `/admins`. */
export type AdminsListPage = {
  data: Employee[];
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
  from?: number | null;
  to?: number | null;
};

export type AdminsListResponse = {
  success: boolean;
  message: string;
  data: AdminsListPage;
};

export type Role = {
  id: number;
  name: string;
  label: string;
};

export type RolesResponse = {
  success: boolean;
  message: string;
  data: Role[] | { data: Role[] };
};

export type HomeEmployeeRoleKey =
  | "review"
  | "dataProcessing"
  | "contractFollowUp";

export type EmployeeGroupAvatar = {
  name: string;
  src?: string;
  fallback?: string;
  fallbackClassName?: string;
};

export type EmployeeRoleGroup = {
  key: HomeEmployeeRoleKey;
  count: number;
  avatars: EmployeeGroupAvatar[];
};
