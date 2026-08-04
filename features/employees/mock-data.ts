import type {
  EmployeeDetail,
  EmployeeJobRole,
  EmployeePermissionKey,
  EmployeeRow,
  EmployeesFilterValues,
} from "@/features/employees/types";

export const DEFAULT_EMPLOYEES_FILTERS: EmployeesFilterValues = {
  createdAt: undefined,
  search: "",
  role: "all",
  status: "all",
};

const BASE_EMPLOYEE = {
  name: "عبد الله القحطاني",
  phone: "+966 514 111 001",
  createdDate: "Tuesday, 12 January 2026",
  createdTime: "10:30 AM",
  createdAtIso: "2026-01-12",
  createdAtDateTime: "2026-01-12 10:30:00",
  status: "active" as const,
} as const;

const ROLE_CYCLE: EmployeeJobRole[] = [
  "review",
  "dataProcessing",
  "contractFollowUp",
];

const TARGET_CYCLE = [20, 10, 15, 5, 20, 10, 15, 5, 20] as const;

const EMAIL_CYCLE = [
  "khaled@example.com",
  "abdullah@example.com",
] as const;

const ROLE_PERMISSIONS: Record<EmployeeJobRole, EmployeePermissionKey[]> = {
  review: [
    "accessNewRequests",
    "editDuringReview",
    "holdWithReason",
    "approveAsProcessed",
  ],
  dataProcessing: [
    "enterOrderData",
    "uploadDocuments",
    "editDuringReview",
    "approveAsProcessed",
  ],
  contractFollowUp: [
    "followUpContracts",
    "sendForVerification",
    "uploadDocuments",
    "holdWithReason",
  ],
};

const ACTIVITY_CYCLE = [
  { todayRequests: 8, thisWeek: 34, totalCompleted: 142 },
  { todayRequests: 5, thisWeek: 21, totalCompleted: 98 },
  { todayRequests: 12, thisWeek: 40, totalCompleted: 176 },
] as const;

/** Sample employees matching the filled list design. */
export const EMPLOYEES: EmployeeRow[] = TARGET_CYCLE.map((dailyTarget, index) => {
  const n = String(index + 1).padStart(2, "0");
  return {
    id: `emp-${n}`,
    ...BASE_EMPLOYEE,
    employeeNumber: `EMP-${String(index + 1).padStart(3, "0")}`,
    email: EMAIL_CYCLE[index % EMAIL_CYCLE.length],
    role: ROLE_CYCLE[index % ROLE_CYCLE.length],
    dailyTarget,
  };
});

/** Builds a profile detail payload from a list row. */
export function toEmployeeDetail(row: EmployeeRow): EmployeeDetail {
  const index = Math.max(
    0,
    EMPLOYEES.findIndex((employee) => employee.id === row.id),
  );
  const activity = ACTIVITY_CYCLE[index % ACTIVITY_CYCLE.length];
  const now = new Date();
  const lastLoginIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  return {
    ...row,
    lastLoginAtDateTime: `${lastLoginIso} 08:30:00`,
    activity: { ...activity },
    permissions: ROLE_PERMISSIONS[row.role],
  };
}

function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function filterEmployees(
  employees: EmployeeRow[],
  filters: EmployeesFilterValues,
): EmployeeRow[] {
  const search = filters.search.trim().toLowerCase();
  const createdIso = filters.createdAt
    ? toIsoDate(filters.createdAt)
    : undefined;

  return employees.filter((employee) => {
    if (filters.role !== "all" && employee.role !== filters.role) {
      return false;
    }

    if (filters.status !== "all" && employee.status !== filters.status) {
      return false;
    }

    if (createdIso && employee.createdAtIso !== createdIso) {
      return false;
    }

    if (search) {
      const haystack = [
        employee.employeeNumber,
        employee.name,
        employee.phone,
        employee.email,
        employee.role,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(search)) return false;
    }

    return true;
  });
}
