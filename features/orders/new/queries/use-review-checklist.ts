"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { newOrderReviewKeys } from "@/features/orders/query-keys";

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

/**
 * Client-only review checklist state (not persisted to the server).
 * Kept in React Query so the sidebar can share it without a context provider.
 */
export function useReviewChecklist(orderId: string) {
  const queryClient = useQueryClient();

  const { data: checklist = INITIAL_REVIEW_CHECKLIST } = useQuery({
    queryKey: newOrderReviewKeys.checklist(orderId),
    queryFn: () => INITIAL_REVIEW_CHECKLIST,
    staleTime: Infinity,
    gcTime: Infinity,
    initialData: INITIAL_REVIEW_CHECKLIST,
  });

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
