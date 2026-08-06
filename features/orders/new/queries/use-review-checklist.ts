"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { newOrderReviewKeys } from "@/features/orders/query-keys";
import type { HoldReasonValue } from "@/features/orders/types";

export const NEW_ORDER_CHECKLIST_IDS = [
  "checklistEmployer",
  "checklistWorker",
  "checklistAttachments",
  "checklistContract",
  "checklistNoConflicts",
] as const;

export type NewOrderChecklistId = (typeof NEW_ORDER_CHECKLIST_IDS)[number];

export type ReviewChecklistState = Record<NewOrderChecklistId, boolean>;

export const INITIAL_REVIEW_CHECKLIST: ReviewChecklistState = {
  checklistEmployer: false,
  checklistWorker: false,
  checklistAttachments: false,
  checklistContract: false,
  checklistNoConflicts: false,
};

/** Checklist rows left unchecked when reopening a held order for review. */
const HOLD_REASON_UNCHECKED: Partial<
  Record<HoldReasonValue, NewOrderChecklistId[]>
> = {
  employer_data_incomplete: ["checklistEmployer"],
  worker_data_unclear: ["checklistWorker"],
  missing_document: ["checklistAttachments"],
  unclear_document: ["checklistAttachments"],
  data_conflict: ["checklistNoConflicts"],
  other: [...NEW_ORDER_CHECKLIST_IDS],
};

const HELD_ORDER_ALWAYS_UNCHECKED: NewOrderChecklistId[] = [
  "checklistContract",
];

function isInitialReviewChecklist(state: ReviewChecklistState): boolean {
  return NEW_ORDER_CHECKLIST_IDS.every((id) => !state[id]);
}

export function getHeldOrderChecklistState(
  holdReason: HoldReasonValue | null | undefined,
): ReviewChecklistState {
  const unchecked = new Set<NewOrderChecklistId>(HELD_ORDER_ALWAYS_UNCHECKED);

  for (const id of holdReason ? (HOLD_REASON_UNCHECKED[holdReason] ?? []) : []) {
    unchecked.add(id);
  }

  return NEW_ORDER_CHECKLIST_IDS.reduce<ReviewChecklistState>((acc, id) => {
    acc[id] = !unchecked.has(id);
    return acc;
  }, {} as ReviewChecklistState);
}

type UseReviewChecklistOptions = {
  isHeld?: boolean;
  holdReason?: HoldReasonValue | null;
};

/**
 * Client-only review checklist state (not persisted to the server).
 * Kept in React Query so the sidebar can share it without a context provider.
 */
export function useReviewChecklist(
  orderId: string,
  options: UseReviewChecklistOptions = {},
) {
  const { isHeld = false, holdReason = null } = options;
  const queryClient = useQueryClient();

  const { data: checklist = INITIAL_REVIEW_CHECKLIST } = useQuery({
    queryKey: newOrderReviewKeys.checklist(orderId),
    queryFn: () => INITIAL_REVIEW_CHECKLIST,
    staleTime: Infinity,
    gcTime: Infinity,
    initialData: INITIAL_REVIEW_CHECKLIST,
  });

  useEffect(() => {
    if (!isHeld) return;

    const queryKey = newOrderReviewKeys.checklist(orderId);
    const current = queryClient.getQueryData<ReviewChecklistState>(queryKey);

    if (current && !isInitialReviewChecklist(current)) {
      return;
    }

    queryClient.setQueryData(
      queryKey,
      getHeldOrderChecklistState(holdReason),
    );
  }, [holdReason, isHeld, orderId, queryClient]);

  const toggleChecklistItem = (id: NewOrderChecklistId) => {
    queryClient.setQueryData<ReviewChecklistState>(
      newOrderReviewKeys.checklist(orderId),
      (prev = INITIAL_REVIEW_CHECKLIST) => ({
        ...prev,
        [id]: !prev[id],
      })
    );
  };

  const canCompleteReview = NEW_ORDER_CHECKLIST_IDS.every((id) => checklist[id]);

  return {
    checklist,
    toggleChecklistItem,
    canCompleteReview,
  };
}
