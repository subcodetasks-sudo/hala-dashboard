"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { seedOrderDetail } from "@/features/orders/queries/use-orders";
import {
  completedOrderKeys,
  orderKeys,
} from "@/features/orders/query-keys";
import type {
  ConfirmPaymentResponse,
  OrderReviewDetail,
} from "@/features/orders/types";
import { mapOrderDetailToReview } from "@/features/orders/utils/map-order-detail";

export type ConfirmPaymentInput = {
  renewalRequestId: string;
  paymentProof: File;
  confirmed: boolean;
  notificationText: string;
};

async function confirmPayment(
  locale: string,
  input: ConfirmPaymentInput,
): Promise<OrderReviewDetail | null> {
  const formData = new FormData();
  formData.append("payment_proof", input.paymentProof, input.paymentProof.name);
  formData.append("confirmed", input.confirmed ? "1" : "0");
  formData.append("notification_text", input.notificationText);

  const response = await fetch(
    `/api/orders/renewal-requests/${encodeURIComponent(input.renewalRequestId)}/confirm-payment`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
      },
      body: formData,
    },
  );

  const payload = (await response.json().catch(() => null)) as
    | ConfirmPaymentResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload?.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Unable to confirm payment",
    );
  }

  const result = payload as ConfirmPaymentResponse;
  if (!result.data) {
    return null;
  }

  const appLocale = locale.startsWith("en") ? "en" : "ar";
  return mapOrderDetailToReview(result.data, appLocale);
}

/**
 * Confirms payment for an order
 * (`POST .../confirm-payment` multipart with `payment_proof`, `confirmed`, `notification_text`).
 */
export function useConfirmPayment() {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ConfirmPaymentInput) =>
      confirmPayment(locale, input),
    onSuccess: (detail, input) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: completedOrderKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: orderKeys.renewalRequestPaymentStats(),
      });
      queryClient.invalidateQueries({
        queryKey: orderKeys.renewalRequestCompletedStats(),
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
