"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { usePathname, useRouter } from "@/i18n/navigation";

type UseOrderFiltersOptions<T> = {
  defaults: T;
  serialize: (filters: T) => URLSearchParams;
  parse: (params: URLSearchParams, defaults: T) => T;
};

export function useOrderFilters<T>({
  defaults,
  serialize,
  parse,
}: UseOrderFiltersOptions<T>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  const parseRef = useRef(parse);
  const defaultsRef = useRef(defaults);
  parseRef.current = parse;
  defaultsRef.current = defaults;

  const [draftFilters, setDraftFilters] = useState<T>(() =>
    parse(new URLSearchParams(queryString), defaults)
  );
  const [appliedFilters, setAppliedFilters] = useState<T>(() =>
    parse(new URLSearchParams(queryString), defaults)
  );

  useEffect(() => {
    const next = parseRef.current(
      new URLSearchParams(queryString),
      defaultsRef.current
    );
    setDraftFilters(next);
    setAppliedFilters(next);
  }, [queryString]);

  function applyFilters() {
    setAppliedFilters(draftFilters);
    const params = serialize(draftFilters);
    const nextQuery = params.toString();
    router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname);
  }

  return {
    draftFilters,
    setDraftFilters,
    appliedFilters,
    applyFilters,
  };
}
