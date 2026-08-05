"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import {
  seedOrderDetail,
  updateOrderReviewDetail,
} from "@/features/orders/queries/order-detail-store";
import { isMockOrderDetailId } from "@/features/orders/mock-order-details";
import { orderKeys } from "@/features/orders/query-keys";
import type {
  OrderReviewDetail,
  UpdateRenewalRequestWorkerResponse,
} from "@/features/orders/types";
import type { WorkerFormValues } from "@/features/orders/schemas/worker-schema";
import { mapOrderDetailToReview } from "@/features/orders/utils/map-order-detail";
import { toSaudiPhoneInternational } from "@/lib/format-saudi-phone";

export type UpdateRenewalRequestWorkerInput = {
  renewalRequestId: string;
  values: WorkerFormValues;
  passportIssuePlaceId: number;
  salary: number | null;
};

async function updateRenewalRequestWorkerMock(
  input: UpdateRenewalRequestWorkerInput,
  locale: "ar" | "en",
): Promise<OrderReviewDetail> {
  return updateOrderReviewDetail(input.renewalRequestId, {
    workerNameAr: input.values.workerNameAr,
    workerNameEn: input.values.workerNameEn,
    workerName:
      locale === "en"
        ? input.values.workerNameEn || input.values.workerNameAr
        : input.values.workerNameAr || input.values.workerNameEn,
    workerPhoneLocal: input.values.workerPhoneLocal,
    workerBirthDate: input.values.birthDate,
    workerHomeAddress: input.values.homeAddress,
    workerPassportIssuePlace: input.values.passportIssuePlace,
    workerPassportIssuePlaceId: input.passportIssuePlaceId,
    workerPassportNumber: input.values.passportNumber,
    workerPassportIssueDate: input.values.passportIssueDate,
    workerPassportExpiryDate: input.values.passportExpiryDate,
  });
}

async function updateRenewalRequestWorker(
  locale: string,
  input: UpdateRenewalRequestWorkerInput,
): Promise<OrderReviewDetail | null> {
  if (input.salary == null) {
    throw new Error("Worker salary is required");
  }

  const response = await fetch(
    `/api/orders/renewal-requests/${encodeURIComponent(input.renewalRequestId)}/worker`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        worker_name_ar: input.values.workerNameAr.trim(),
        worker_name_en: input.values.workerNameEn.trim(),
        worker_phone: toSaudiPhoneInternational(input.values.workerPhoneLocal),
        birth_date: input.values.birthDate.trim(),
        philippines_address: input.values.homeAddress.trim(),
        worker_passport_issue_place_id: input.passportIssuePlaceId,
        passport_number: input.values.passportNumber.trim(),
        passport_issue_date: input.values.passportIssueDate.trim(),
        passport_expiry_date: input.values.passportExpiryDate.trim(),
        salary: input.salary,
      }),
    },
  );

  const payload = (await response.json().catch(() => null)) as
    | UpdateRenewalRequestWorkerResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload?.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Unable to update worker data",
    );
  }

  const result = payload as UpdateRenewalRequestWorkerResponse;
  if (!result.data) {
    return null;
  }

  const appLocale = locale.startsWith("en") ? "en" : "ar";
  return mapOrderDetailToReview(result.data, appLocale);
}

/**
 * Updates worker data on a renewal request (`PUT .../worker`).
 */
export function useUpdateRenewalRequestWorker() {
  const locale = useLocale();
  const queryClient = useQueryClient();
  const appLocale = locale.startsWith("en") ? "en" : "ar";

  return useMutation({
    mutationFn: (input: UpdateRenewalRequestWorkerInput) =>
      isMockOrderDetailId(input.renewalRequestId)
        ? updateRenewalRequestWorkerMock(input, appLocale)
        : updateRenewalRequestWorker(locale, input),
    onSuccess: (detail, input) => {
      const detailId = detail?.id ?? input.renewalRequestId;

      if (detail) {
        seedOrderDetail(detail);
        queryClient.setQueryData(
          [...orderKeys.detail(detailId), locale],
          detail,
        );
      }

      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(detailId),
      });
    },
  });
}
