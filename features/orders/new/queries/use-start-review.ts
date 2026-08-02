"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { seedOrderDetail } from "@/features/orders/queries/use-orders";
import { orderKeys } from "@/features/orders/query-keys";
import type {
  OrderReviewDetail,
  StartReviewResponse,
} from "@/features/orders/types";
import { mapOrderDetailToReview } from "@/features/orders/utils/map-order-detail";

async function startReview(
  locale: string,
  renewalRequestId: string,
): Promise<OrderReviewDetail | null> {
  const response = await fetch(
    `/api/orders/renewal-requests/${encodeURIComponent(renewalRequestId)}/start-review`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
      },
    },
  );

  const payload = (await response.json().catch(() => null)) as
    | StartReviewResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload?.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Unable to start review",
    );
  }

  const result = payload as StartReviewResponse;
  if (!result.data) {
    return null;
  }

  const appLocale = locale.startsWith("en") ? "en" : "ar";
  return mapOrderDetailToReview(result.data, appLocale);
}

/**
 * Starts review for a renewal request (`POST .../start-review`).
 * Assigns the order to the current admin and moves it out of `new`.
 */
export function useStartReview() {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (renewalRequestId: string) =>
      startReview(locale, renewalRequestId),
    onSuccess: (detail, renewalRequestId) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: orderKeys.renewalRequestStats(),
      });

      const detailId = detail?.id ?? renewalRequestId;

      if (detail) {
        seedOrderDetail(detail);
        queryClient.setQueryData([...orderKeys.detail(detailId), locale], detail);
      }

      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(detailId),
      });
    },
  });
}
