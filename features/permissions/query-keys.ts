export const permissionKeys = {
  all: ["permissions"] as const,
  grouped: () => [...permissionKeys.all, "grouped"] as const,
  roles: () => [...permissionKeys.all, "roles"] as const,
  role: (id: string) => [...permissionKeys.roles(), id] as const,
};
