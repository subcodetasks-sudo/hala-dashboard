export type EmployeeRole = {
  id: number;
  name: string;
  label: string;
};

export type Employee = {
  id: number;
  name: string;
  email: string;
  idNumber: string;
  nationalId?: string | null;
  phone: string;
  avatar: string | null;
  status: string;
  statusLabel: string;
  roles: EmployeeRole[];
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
  /** Optional fields some admin list payloads include. */
  employeeNumber?: string | null;
  dailyTarget?: number | null;
};

export type ProfileResponse = {
  success: boolean;
  message: string;
  data: Employee;
};
