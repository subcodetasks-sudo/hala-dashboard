"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { seedOrderDetail } from "@/features/orders/queries/order-detail-store";
import { orderKeys } from "@/features/orders/query-keys";
import type {
  DocumentCollection,
  OrderReviewDetail,
  UploadRenewalDocumentResponse,
} from "@/features/orders/types";
import { mapOrderDetailToReview } from "@/features/orders/utils/map-order-detail";

export type UploadRenewalDocumentInput = {
  renewalRequestId: string;
  collection: DocumentCollection;
  file: File;
};

async function uploadRenewalDocument(
  locale: string,
  input: UploadRenewalDocumentInput,
): Promise<OrderReviewDetail | null> {
  const formData = new FormData();
  formData.append("collection", input.collection);
  formData.append("file", input.file, input.file.name);

  const response = await fetch(
    `/api/orders/renewal-requests/${encodeURIComponent(input.renewalRequestId)}/documents`,
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
    | UploadRenewalDocumentResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload?.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Unable to upload document",
    );
  }

  const result = payload as UploadRenewalDocumentResponse;
  if (!result.data) {
    return null;
  }

  const appLocale = locale.startsWith("en") ? "en" : "ar";
  return mapOrderDetailToReview(result.data, appLocale);
}

/**
 * Replaces a renewal-request document (`POST .../documents` multipart).
 * Sends `collection` + `file` form fields matching the backend contract.
 */
export function useUploadRenewalDocument() {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UploadRenewalDocumentInput) =>
      uploadRenewalDocument(locale, input),
    onSuccess: (detail, input) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
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
