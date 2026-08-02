"use client";

import { useMemo } from "react";

import { can, type Can } from "@/features/auth/lib/can";
import { useProfile } from "@/features/profile/queries/use-profile";

/** Client-side permission helper backed by the current profile query. */
export function useCan(): Can & {
  isPending: boolean;
  isError: boolean;
} {
  const { data: profile, isPending, isError } = useProfile();
  const permissions = useMemo(() => can(profile), [profile]);

  return {
    ...permissions,
    isPending,
    isError,
  };
}
