"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { seedOrderDetail } from "@/features/orders/queries/use-orders";
import { orderKeys } from "@/features/orders/query-keys";
import type {
  OrderReviewDetail,
  ProcessRenewalRequestResponse,
} from "@/features/orders/types";
import { mapOrderDetailToReview } from "@/features/orders/utils/map-order-detail";

async function processRenewalRequest(
  locale: string,
  renewalRequestId: string,
): Promise<OrderReviewDetail | null> {
  const response = await fetch(
    `/api/orders/renewal-requests/${encodeURIComponent(renewalRequestId)}/process`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
      },
    },
  );

  const payload = (await response.json().catch(() => null)) as
    | ProcessRenewalRequestResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload?.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Unable to process renewal request",
    );
  }

  const result = payload as ProcessRenewalRequestResponse;
  if (!result.data) {
    return null;
  }

  const appLocale = locale.startsWith("en") ? "en" : "ar";
  return mapOrderDetailToReview(result.data, appLocale);
}

/**
 * Marks a renewal request as processed (`POST .../process`).
 */
export function useProcessRenewalRequest() {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (renewalRequestId: string) =>
      processRenewalRequest(locale, renewalRequestId),
    onSuccess: (detail, renewalRequestId) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: orderKeys.renewalRequestStats(),
      });
      queryClient.invalidateQueries({
        queryKey: orderKeys.renewalRequestProcessedStats(),
      });
      queryClient.invalidateQueries({
        queryKey: orderKeys.renewalRequestHeldStats(),
      });

      const detailId = detail?.id ?? renewalRequestId;

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
