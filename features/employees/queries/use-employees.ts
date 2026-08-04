"use client";

import { useQuery } from "@tanstack/react-query";

import {
  DEFAULT_EMPLOYEES_FILTERS,
  EMPLOYEES,
  filterEmployees,
  toEmployeeDetail,
} from "@/features/employees/mock-data";
import { employeeKeys } from "@/features/employees/query-keys";
import type {
  EmployeeDetail,
  EmployeeRow,
  EmployeesFilterValues,
} from "@/features/employees/types";

export type EmployeeIndicators = {
  total: number;
  active: number;
  suspended: number;
  changePercent: number;
};

const employeesStore: EmployeeRow[] = [...EMPLOYEES];

export async function fetchEmployees(
  filters: EmployeesFilterValues = DEFAULT_EMPLOYEES_FILTERS,
): Promise<EmployeeRow[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return filterEmployees(employeesStore, filters);
}

export async function fetchEmployeeIndicators(): Promise<EmployeeIndicators> {
  await new Promise((resolve) => setTimeout(resolve, 150));

  const active = employeesStore.filter((row) => row.status === "active").length;
  const suspended = employeesStore.filter(
    (row) => row.status === "suspended",
  ).length;

  return {
    total: employeesStore.length,
    active,
    suspended,
    changePercent: 24,
  };
}

export async function fetchEmployee(
  employeeId: string,
): Promise<EmployeeDetail | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const row = employeesStore.find((employee) => employee.id === employeeId);
  return row ? toEmployeeDetail(row) : null;
}

/**
 * Lists employees with optional filter criteria.
 */
export function useEmployees(
  filters: EmployeesFilterValues = DEFAULT_EMPLOYEES_FILTERS,
) {
  return useQuery({
    queryKey: employeeKeys.list(filters),
    queryFn: () => fetchEmployees(filters),
  });
}

/**
 * Single employee profile for the details page.
 */
export function useEmployee(employeeId: string) {
  return useQuery({
    queryKey: employeeKeys.detail(employeeId),
    queryFn: () => fetchEmployee(employeeId),
    enabled: Boolean(employeeId),
  });
}

/**
 * Summary indicator cards for the employees page.
 */
export function useEmployeeIndicators() {
  return useQuery({
    queryKey: employeeKeys.indicators(),
    queryFn: fetchEmployeeIndicators,
  });
}
