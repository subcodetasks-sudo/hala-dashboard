import type { Employee } from "@/features/profile/types";

export type AdminLoginData = {
  token: string;
  tokenType: string;
  admin: Employee;
};

export type AdminLoginResponse = {
  success: boolean;
  message: string;
  data: AdminLoginData;
};

export type AuthSession = {
  token: string;
  tokenType: string;
  admin: Employee;
};

export type AdminLogoutResponse = {
  success: boolean;
  message: string;
};

export type RoleName =
  | "admin"
  | "contract-officer"
  | "data-entry"
  | "review-officer"
  | "super-admin";

export type Permission = {
  id: number;
  name: string;
  module: string;
  guardName: string;
  createdAt: string;
  updatedAt: string;
};

export type Role = {
  id: number;
  name: string;
  label: string;
  guardName: string;
  isProtected: boolean;
  permissions: Permission[];
  permissionsCount: number;
  createdAt: string;
  updatedAt: string;
};

export type RolesResponse = {
  success: boolean;
  message: string;
  data: Role[];
};

