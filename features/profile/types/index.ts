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
  phone: string;
  avatar: string | null;
  status: string;
  statusLabel: string;
  roles: EmployeeRole[];
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
};

export type ProfileResponse = {
  success: boolean;
  message: string;
  data: Employee;
};
