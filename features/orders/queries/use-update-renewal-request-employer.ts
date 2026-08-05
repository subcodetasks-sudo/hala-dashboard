"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import {
  seedOrderDetail,
  updateOrderReviewDetail,
} from "@/features/orders/queries/order-detail-store";
import { isMockOrderDetailId } from "@/features/orders/mock-order-details";
import { orderKeys } from "@/features/orders/query-keys";
import type { UpdateEmployerInput } from "@/features/orders/schemas/employer-schema";
import type {
  OrderReviewDetail,
  UpdateRenewalEmployerResponse,
} from "@/features/orders/types";
import { mapOrderDetailToReview } from "@/features/orders/utils/map-order-detail";
import { toSaudiPhoneInternational } from "@/lib/format-saudi-phone";

export type UpdateRenewalRequestEmployerInput = {
  renewalRequestId: string;
  values: UpdateEmployerInput;
};

async function updateRenewalRequestEmployerMock(
  input: UpdateRenewalRequestEmployerInput,
  locale: "ar" | "en",
): Promise<OrderReviewDetail> {
  return updateOrderReviewDetail(input.renewalRequestId, {
    employerNameAr: input.values.employerNameAr,
    employerNameEn: input.values.employerNameEn,
    employerName:
      locale === "en"
        ? input.values.employerNameEn || input.values.employerNameAr
        : input.values.employerNameAr || input.values.employerNameEn,
    nationalId: input.values.nationalId,
    phoneLocal: input.values.phoneLocal,
    city: input.values.city,
    cityId: input.values.cityId,
    passportIssuePlace: input.values.passportIssuePlace || "—",
    passportIssuePlaceId: input.values.passportIssuePlaceId,
  });
}

async function updateRenewalRequestEmployer(
  locale: string,
  input: UpdateRenewalRequestEmployerInput,
): Promise<OrderReviewDetail | null> {
  if (input.values.passportIssuePlaceId == null) {
    throw new Error("Passport issue place is required");
  }

  const response = await fetch(
    `/api/orders/renewal-requests/${encodeURIComponent(input.renewalRequestId)}/employer`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Accept-Language": locale,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        national_id: input.values.nationalId.trim(),
        phone: toSaudiPhoneInternational(input.values.phoneLocal),
        employer_name_ar: input.values.employerNameAr.trim(),
        employer_name_en: input.values.employerNameEn.trim(),
        city_id: input.values.cityId,
        passport_issue_place_id: input.values.passportIssuePlaceId,
      }),
    },
  );

  const payload = (await response.json().catch(() => null)) as
    | UpdateRenewalEmployerResponse
    | { success?: false; message?: string }
    | null;

  if (!response.ok || !payload?.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Unable to update employer data",
    );
  }

  const result = payload as UpdateRenewalEmployerResponse;
  if (!result.data) {
    return null;
  }

  const appLocale = locale.startsWith("en") ? "en" : "ar";
  return mapOrderDetailToReview(result.data, appLocale);
}

/**
 * Updates employer data on a renewal request (`PUT .../employer`).
 */
export function useUpdateRenewalRequestEmployer() {
  const locale = useLocale();
  const queryClient = useQueryClient();
  const appLocale = locale.startsWith("en") ? "en" : "ar";

  return useMutation({
    mutationFn: (input: UpdateRenewalRequestEmployerInput) =>
      isMockOrderDetailId(input.renewalRequestId)
        ? updateRenewalRequestEmployerMock(input, appLocale)
        : updateRenewalRequestEmployer(locale, input),
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
