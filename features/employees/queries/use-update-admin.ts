"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { employeeKeys } from "@/features/employees/query-keys";
import type {
  UpdateAdminClientFields,
  UpdateAdminResponse,
  Employee,
} from "@/features/employees/types";

async function updateAdmin(
  locale: string,
  adminId: string,
  input: UpdateAdminClientFields,
): Promise<{ message: string; data: Employee }> {
  const formData = new FormData();
  formData.append("name", input.name);
  formData.append("email", input.email);
  formData.append("idNumber", input.idNumber);
  formData.append("nationalId", input.nationalId);
  formData.append("phone", input.phone);
  formData.append("status", input.status);
  formData.append("role", input.role);

  const password = input.password?.trim() ?? "";
  const confirmPassword = input.confirmPassword?.trim() ?? "";

  if (password) {
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
  }

  if (input.avatar) {
    formData.append("avatar", input.avatar, input.avatar.name);
  }

  const response = await fetch(`/api/admins/${encodeURIComponent(adminId)}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
    },
    body: formData,
  });

  const payload = (await response.json().catch(() => null)) as
    | UpdateAdminResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload || !("success" in payload) || !payload.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Unable to update employee",
    );
  }

  return {
    message: payload.message,
    data: payload.data,
  };
}

/**
 * Updates an admin/employee via `PUT /api/admins/:id` (multipart → backend `/admins/:id`).
 */
export function useUpdateAdmin() {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      adminId,
      input,
    }: {
      adminId: string;
      input: UpdateAdminClientFields;
    }) => updateAdmin(locale, adminId, input),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      void queryClient.invalidateQueries({
        queryKey: employeeKeys.indicators(),
      });
      void queryClient.invalidateQueries({
        queryKey: employeeKeys.detail(variables.adminId),
      });
    },
  });
}
