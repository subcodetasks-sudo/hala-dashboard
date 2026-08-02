"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { seedOrderDetail } from "@/features/orders/queries/use-orders";
import { orderKeys } from "@/features/orders/query-keys";
import type {
  HoldReasonValue,
  HoldRenewalRequestResponse,
  OrderReviewDetail,
} from "@/features/orders/types";
import { mapOrderDetailToReview } from "@/features/orders/utils/map-order-detail";

export type HoldRenewalRequestInput = {
  renewalRequestId: string;
  holdReason: HoldReasonValue;
  holdNotes: string;
};

async function holdRenewalRequest(
  locale: string,
  input: HoldRenewalRequestInput,
): Promise<OrderReviewDetail | null> {
  const response = await fetch(
    `/api/orders/renewal-requests/${encodeURIComponent(input.renewalRequestId)}/hold`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hold_reason: input.holdReason,
        hold_notes: input.holdNotes,
      }),
    },
  );

  const payload = (await response.json().catch(() => null)) as
    | HoldRenewalRequestResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload?.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Unable to hold renewal request",
    );
  }

  const result = payload as HoldRenewalRequestResponse;
  if (!result.data) {
    return null;
  }

  const appLocale = locale.startsWith("en") ? "en" : "ar";
  return mapOrderDetailToReview(result.data, appLocale);
}

/**
 * Holds a renewal request (`POST .../hold`) with reason + notes.
 */
export function useHoldRenewalRequest() {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: HoldRenewalRequestInput) =>
      holdRenewalRequest(locale, input),
    onSuccess: (detail, input) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: orderKeys.renewalRequestStats(),
      });
      queryClient.invalidateQueries({
        queryKey: orderKeys.renewalRequestHeldStats(),
      });

      const detailId = detail?.id ?? input.renewalRequestId;

      if (detail) {
        seedOrderDetail(detail);
        queryClient.setQueryData(
          [...orderKeys.detail(detailId), locale],
          detail,
        );
      }

      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(detailId),
      });
    },
  });
}
