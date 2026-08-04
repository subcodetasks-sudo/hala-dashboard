import type { Employee } from "@/features/profile/types";

export type { Employee, EmployeeRole } from "@/features/profile/types";

/** Account status shown on the employees list. */
export type EmployeeAccountStatus = "active" | "suspended";

/** Job-role filter keys for the employees list UI. */
export type EmployeeJobRole =
  | "review"
  | "dataProcessing"
  | "contractFollowUp";

/** Row shape for the employees data table (list UI). */
export type EmployeeRow = {
  id: string;
  employeeNumber: string;
  name: string;
  phone: string;
  email: string;
  role: EmployeeJobRole;
  dailyTarget: number;
  status: EmployeeAccountStatus;
  createdAtIso: string;
  createdDate: string;
  createdTime: string;
  createdAtDateTime: string;
  avatarUrl?: string;
};

/** Activity counters shown on the employee profile. */
export type EmployeeActivityStats = {
  todayRequests: number;
  thisWeek: number;
  totalCompleted: number;
};

/** Permission copy keys under `Employees.Details.permissions.items`. */
export type EmployeePermissionKey =
  | "accessNewRequests"
  | "editDuringReview"
  | "holdWithReason"
  | "approveAsProcessed"
  | "enterOrderData"
  | "uploadDocuments"
  | "followUpContracts"
  | "sendForVerification";

/** Full employee profile for the details page. */
export type EmployeeDetail = EmployeeRow & {
  lastLoginAtDateTime: string;
  activity: EmployeeActivityStats;
  permissions: EmployeePermissionKey[];
};

export type EmployeesFilterValues = {
  createdAt: Date | undefined;
  search: string;
  role: "all" | EmployeeJobRole;
  status: "all" | EmployeeAccountStatus;
};

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
