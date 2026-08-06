"use client";

import { useSearchParams } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import { usePathname, useRouter } from "@/i18n/navigation";

type UseUrlFiltersOptions<T> = {
  defaults: T;
  serialize: (filters: T) => URLSearchParams;
  parse: (params: URLSearchParams, defaults: T) => T;
};

type UseUrlFiltersResult<T> = {
  draftFilters: T;
  setDraftFilters: Dispatch<SetStateAction<T>>;
  appliedFilters: T;
  applyFilters: () => void;
  clearFilters: () => void;
};

/**
 * Syncs draft/applied filter state with the URL query string.
 * Generic across list pages (orders, employees, invoices, etc.).
 */
export function useUrlFilters<T>({
  defaults,
  serialize,
  parse,
}: UseUrlFiltersOptions<T>): UseUrlFiltersResult<T> {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  const parseRef = useRef(parse);
  const defaultsRef = useRef(defaults);
  parseRef.current = parse;
  defaultsRef.current = defaults;

  const [draftFilters, setDraftFilters] = useState<T>(() =>
    parse(new URLSearchParams(queryString), defaults),
  );
  const [appliedFilters, setAppliedFilters] = useState<T>(() =>
    parse(new URLSearchParams(queryString), defaults),
  );

  useEffect(() => {
    const next = parseRef.current(
      new URLSearchParams(queryString),
      defaultsRef.current,
    );
    setDraftFilters(next);
    setAppliedFilters(next);
  }, [queryString]);

  function applyFilters(): void {
    setAppliedFilters(draftFilters);
    const params = serialize(draftFilters);
    const nextQuery = params.toString();
    router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname);
  }

  function clearFilters(): void {
    setDraftFilters(defaultsRef.current);
    setAppliedFilters(defaultsRef.current);
    router.push(pathname);
  }

  return {
    draftFilters,
    setDraftFilters,
    appliedFilters,
    applyFilters,
    clearFilters,
  };
}
