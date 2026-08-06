/** Role status shown on the permissions list. */
export type PermissionRoleStatus = "active" | "inactive";

/** Known role keys used for icon / badge styling. */
export type PermissionRoleKey =
  | "systemAdmin"
  | "review"
  | "dataProcessing"
  | "contractFollowUp"
  | "contractApproval"
  | "contractPayments";

export type PermissionsFilterValues = {
  search: string;
  /** Backend role `name`, or `"all"`. */
  role: "all" | string;
  status: "all" | PermissionRoleStatus;
};

/** Single permission nested under a role from `GET /v1/roles`. */
export type ApiPermission = {
  id: number;
  name: string;
  module: string;
  guardName: string;
  createdAt: string;
  updatedAt: string;
};

/** Role item from `GET /v1/roles`. */
export type ApiRole = {
  id: number;
  name: string;
  label: string;
  guardName: string;
  isProtected: boolean;
  permissions: ApiPermission[];
  permissionsCount: number;
  createdAt: string;
  updatedAt: string;
};

export type RolesListResponse = {
  success: boolean;
  message: string;
  data: ApiRole[];
};

/** Response from `GET /v1/roles/:id`. */
export type RoleDetailResponse = {
  success: boolean;
  message: string;
  data: ApiRole;
};

/** Row shape for the permissions data table (list UI). */
export type PermissionRoleRow = {
  id: string;
  name: string;
  label: string;
  roleKey: PermissionRoleKey | null;
  permissionsCount: number;
  status: PermissionRoleStatus;
  isProtected: boolean;
  updatedAtIso: string;
  updatedAtDateTime: string;
  permissions: ApiPermission[];
};

export type PermissionsIndicators = {
  totalRoles: number;
  activeRoles: number;
  totalEmployees: number;
  changePercent: number;
};

/** One module group from `GET /v1/permissions/grouped` or a role's permissions. */
export type ApiPermissionGroup = {
  module: string;
  permissions: ApiPermission[];
};

export type PermissionsGroupedResponse = {
  success: boolean;
  message: string;
  data: ApiPermissionGroup[];
};

/** Selected permission IDs while creating a role. */
export type CreateRoleSelectedPermissionIds = number[];

export type CreateRoleFormValues = {
  name: string;
  description: string;
  status: PermissionRoleStatus;
  permissionIds: CreateRoleSelectedPermissionIds;
};
