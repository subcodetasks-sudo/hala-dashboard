"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { profileKeys } from "@/features/profile/query-keys";
import type { Employee, ProfileResponse } from "@/features/profile/types";

async function fetchProfile(locale: string): Promise<Employee> {
  const response = await fetch("/api/profile", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
    },
  });

  const payload = (await response.json().catch(() => null)) as
    | ProfileResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload || !("success" in payload) || !payload.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Failed to load profile",
    );
  }

  return payload.data;
}

export function useProfile() {
  const locale = useLocale();

  return useQuery({
    queryKey: profileKeys.me(),
    queryFn: () => fetchProfile(locale),
  });
}

export function useSetProfile() {
  const queryClient = useQueryClient();

  return (employee: Employee) => {
    queryClient.setQueryData<Employee>(profileKeys.me(), employee);
  };
}

export function useClearProfile() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.removeQueries({ queryKey: profileKeys.me() });
  };
}
