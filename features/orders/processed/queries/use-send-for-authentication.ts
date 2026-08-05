"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { seedOrderDetail } from "@/features/orders/queries/use-orders";
import { orderKeys } from "@/features/orders/query-keys";
import type {
  OrderReviewDetail,
  SendForAuthenticationResponse,
} from "@/features/orders/types";
import { mapOrderDetailToReview } from "@/features/orders/utils/map-order-detail";

async function sendForAuthentication(
  locale: string,
  renewalRequestId: string,
): Promise<OrderReviewDetail | null> {
  const response = await fetch(
    `/api/orders/renewal-requests/${encodeURIComponent(renewalRequestId)}/send-for-authentication`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
      },
    },
  );

  const payload = (await response.json().catch(() => null)) as
    | SendForAuthenticationResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload?.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Unable to send renewal request for authentication",
    );
  }

  const result = payload as SendForAuthenticationResponse;
  if (!result.data) {
    return null;
  }

  const appLocale = locale.startsWith("en") ? "en" : "ar";
  return mapOrderDetailToReview(result.data, appLocale);
}

/**
 * Sends a processed renewal request for authentication
 * (`POST .../send-for-authentication`).
 */
export function useSendForAuthentication() {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (renewalRequestId: string) =>
      sendForAuthentication(locale, renewalRequestId),
    onSuccess: (detail, renewalRequestId) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: orderKeys.renewalRequestProcessedStats(),
      });
      queryClient.invalidateQueries({
        queryKey: orderKeys.renewalRequestAuthenticationSentStats(),
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
