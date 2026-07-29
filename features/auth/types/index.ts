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
