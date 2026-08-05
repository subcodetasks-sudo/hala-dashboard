"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { seedOrderDetail } from "@/features/orders/queries/use-orders";
import {
  orderKeys,
  paymentOrderKeys,
  verificationOrderKeys,
} from "@/features/orders/query-keys";
import type {
  OrderReviewDetail,
  UploadFinalContractResponse,
} from "@/features/orders/types";
import { mapOrderDetailToReview } from "@/features/orders/utils/map-order-detail";

export type UploadFinalContractInput = {
  renewalRequestId: string;
  file: File;
};

async function uploadFinalContract(
  locale: string,
  input: UploadFinalContractInput,
): Promise<OrderReviewDetail | null> {
  const formData = new FormData();
  formData.append("file", input.file, input.file.name);

  const response = await fetch(
    `/api/orders/renewal-requests/${encodeURIComponent(input.renewalRequestId)}/final-contract`,
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
    | UploadFinalContractResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload?.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Unable to upload final contract",
    );
  }

  const result = payload as UploadFinalContractResponse;
  if (!result.data) {
    return null;
  }

  const appLocale = locale.startsWith("en") ? "en" : "ar";
  return mapOrderDetailToReview(result.data, appLocale);
}

/**
 * Uploads the final authenticated contract
 * (`POST .../final-contract` multipart with `file`).
 */
export function useUploadFinalContract() {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UploadFinalContractInput) =>
      uploadFinalContract(locale, input),
    onSuccess: (detail, input) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: verificationOrderKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: paymentOrderKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: orderKeys.renewalRequestAuthenticationSentStats(),
      });
      queryClient.invalidateQueries({
        queryKey: orderKeys.renewalRequestPaymentStats(),
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
