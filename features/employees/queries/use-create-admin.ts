"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { employeeKeys } from "@/features/employees/query-keys";
import type {
  CreateAdminClientFields,
  CreateAdminResponse,
  Employee,
} from "@/features/employees/types";

async function createAdmin(
  locale: string,
  input: CreateAdminClientFields,
): Promise<{ message: string; data: Employee }> {
  const formData = new FormData();
  formData.append("name", input.name);
  formData.append("email", input.email);
  formData.append("idNumber", input.idNumber);
  formData.append("nationalId", input.nationalId);
  formData.append("phone", input.phone);
  formData.append("password", input.password);
  formData.append("confirmPassword", input.confirmPassword);
  formData.append("status", input.status);
  formData.append("role", input.role);

  if (input.avatar) {
    formData.append("avatar", input.avatar, input.avatar.name);
  }

  const response = await fetch("/api/admins", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
    },
    body: formData,
  });

  const payload = (await response.json().catch(() => null)) as
    | CreateAdminResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload || !("success" in payload) || !payload.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Unable to add employee",
    );
  }

  return {
    message: payload.message,
    data: payload.data,
  };
}

/**
 * Creates an admin/employee via `POST /api/admins` (multipart → backend `/admins`).
 */
export function useCreateAdmin() {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAdminClientFields) => createAdmin(locale, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      void queryClient.invalidateQueries({
        queryKey: employeeKeys.indicators(),
      });
    },
  });
}
