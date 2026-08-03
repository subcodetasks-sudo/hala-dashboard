import type { OrderSource } from "@/features/home/types";
import type {
  CancelledOrdersFilterValues,
  CompletedOrdersFilterValues,
  DeliveryStatus,
  OrderRefundMethod,
  OrderRefundStatus,
  OrderStatus,
  OrdersFilterValues,
  PaymentMethod,
  PaymentOrdersFilterValues,
  PendingOrdersFilterValues,
  ProcessedOrdersFilterValues,
  RefundOrdersFilterValues,
  SuspensionReason,
  VerificationOrderStatus,
  VerificationOrdersFilterValues,
} from "@/features/orders/types";

/** Shared query param keys used across one or more order filter bars. */
export const ORDER_FILTER_PARAM_KEYS = {
  fromDate: "fromDate",
  toDate: "toDate",
  expectedExecution: "expectedExecution",
  createdAt: "createdAt",
  contractUploadedAt: "contractUploadedAt",
  cancelledAt: "cancelledAt",
  requestedAt: "requestedAt",
  search: "search",
  source: "source",
  orderType: "orderType",
  status: "status",
  suspensionReason: "suspensionReason",
  deliveryStatus: "deliveryStatus",
  paymentMethod: "paymentMethod",
  cancellationSource: "cancellationSource",
  cancellationReason: "cancellationReason",
  refundStatus: "refundStatus",
  refundMethod: "refundMethod",
} as const;

export type OrderFilterParamKey =
  (typeof ORDER_FILTER_PARAM_KEYS)[keyof typeof ORDER_FILTER_PARAM_KEYS];

export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseIsoDateParam(value: string | null): Date | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function setDateParam(
  params: URLSearchParams,
  key: OrderFilterParamKey,
  value: Date | undefined
) {
  if (value) params.set(key, toIsoDate(value));
}

export function setSearchParam(
  params: URLSearchParams,
  value: string | undefined
) {
  const trimmed = value?.trim();
  if (trimmed) params.set(ORDER_FILTER_PARAM_KEYS.search, trimmed);
}

export function setEnumParam<T extends string>(
  params: URLSearchParams,
  key: OrderFilterParamKey,
  value: T | undefined,
  defaultValue: T
) {
  if (value && value !== defaultValue) params.set(key, value);
}

function parseEnumParam<T extends string>(
  value: string | null,
  allowed: readonly T[],
  fallback: T
): T {
  if (value && (allowed as readonly string[]).includes(value)) {
    return value as T;
  }
  return fallback;
}

const ORDER_SOURCES = ["eform", "manual"] as const satisfies readonly OrderSource[];
const ORDER_SOURCE_FILTERS = ["all", ...ORDER_SOURCES] as const;
const DELIVERY_STATUSES = [
  "required",
  "notRequired",
] as const satisfies readonly DeliveryStatus[];
const DELIVERY_STATUS_FILTERS = ["all", ...DELIVERY_STATUSES] as const;
const PAYMENT_METHODS = [
  "online",
  "manual",
] as const satisfies readonly PaymentMethod[];
const PAYMENT_METHOD_FILTERS = ["all", ...PAYMENT_METHODS] as const;
const REFUND_STATUSES = [
  "pending",
  "approved",
  "rejected",
  "completed",
] as const satisfies readonly OrderRefundStatus[];
const REFUND_STATUS_FILTERS = ["all", ...REFUND_STATUSES] as const;
const REFUND_METHODS = [
  "bank_transfer",
  "wallet",
  "cash",
] as const satisfies readonly OrderRefundMethod[];
const REFUND_METHOD_FILTERS = ["all", ...REFUND_METHODS] as const;
const VERIFICATION_STATUSES = [
  "sentForVerification",
  "finalContractUploaded",
] as const satisfies readonly VerificationOrderStatus[];
const VERIFICATION_STATUS_FILTERS = ["all", ...VERIFICATION_STATUSES] as const;
const SUSPENSION_REASONS = [
  "employer_data_incomplete",
  "worker_data_unclear",
  "missing_document",
  "unclear_document",
  "data_conflict",
  "other",
] as const satisfies readonly SuspensionReason[];
const SUSPENSION_REASON_FILTERS = ["all", ...SUSPENSION_REASONS] as const;

const ALL_ORDER_STATUSES = [
  "draft",
  "new",
  "under_review",
  "processed",
  "held",
  "sent_for_authentication",
  "awaiting_payment",
  "completed",
  "cancelled",
] as const satisfies readonly OrderStatus[];
const ALL_ORDER_STATUS_FILTERS = ["all", ...ALL_ORDER_STATUSES] as const;

export function serializeOrdersFilters(
  filters: OrdersFilterValues
): URLSearchParams {
  const params = new URLSearchParams();
  setDateParam(params, ORDER_FILTER_PARAM_KEYS.fromDate, filters.fromDate);
  setDateParam(params, ORDER_FILTER_PARAM_KEYS.toDate, filters.toDate);
  setDateParam(
    params,
    ORDER_FILTER_PARAM_KEYS.expectedExecution,
    filters.expectedExecution
  );
  setSearchParam(params, filters.search);
  setEnumParam(
    params,
    ORDER_FILTER_PARAM_KEYS.source,
    filters.source,
    "all"
  );
  if (filters.status != null) {
    setEnumParam(
      params,
      ORDER_FILTER_PARAM_KEYS.status,
      filters.status,
      "all"
    );
  }
  return params;
}

export function parseOrdersFilters(
  params: URLSearchParams,
  defaults: OrdersFilterValues
): OrdersFilterValues {
  return {
    fromDate:
      parseIsoDateParam(params.get(ORDER_FILTER_PARAM_KEYS.fromDate)) ??
      defaults.fromDate,
    toDate:
      parseIsoDateParam(params.get(ORDER_FILTER_PARAM_KEYS.toDate)) ??
      defaults.toDate,
    expectedExecution:
      parseIsoDateParam(
        params.get(ORDER_FILTER_PARAM_KEYS.expectedExecution)
      ) ?? defaults.expectedExecution,
    search: params.get(ORDER_FILTER_PARAM_KEYS.search)?.trim() ?? defaults.search,
    source: parseEnumParam(
      params.get(ORDER_FILTER_PARAM_KEYS.source),
      ORDER_SOURCE_FILTERS,
      defaults.source
    ),
    ...(defaults.status != null || params.has(ORDER_FILTER_PARAM_KEYS.status)
      ? {
          status: parseEnumParam(
            params.get(ORDER_FILTER_PARAM_KEYS.status),
            ALL_ORDER_STATUS_FILTERS,
            defaults.status ?? "all"
          ),
        }
      : {}),
  };
}

export function serializePendingOrdersFilters(
  filters: PendingOrdersFilterValues
): URLSearchParams {
  const params = new URLSearchParams();
  setDateParam(params, ORDER_FILTER_PARAM_KEYS.fromDate, filters.fromDate);
  setDateParam(params, ORDER_FILTER_PARAM_KEYS.toDate, filters.toDate);
  setSearchParam(params, filters.search);
  setEnumParam(
    params,
    ORDER_FILTER_PARAM_KEYS.suspensionReason,
    filters.suspensionReason,
    "all"
  );
  return params;
}

export function parsePendingOrdersFilters(
  params: URLSearchParams,
  defaults: PendingOrdersFilterValues
): PendingOrdersFilterValues {
  return {
    fromDate:
      parseIsoDateParam(params.get(ORDER_FILTER_PARAM_KEYS.fromDate)) ??
      defaults.fromDate,
    toDate:
      parseIsoDateParam(params.get(ORDER_FILTER_PARAM_KEYS.toDate)) ??
      defaults.toDate,
    search: params.get(ORDER_FILTER_PARAM_KEYS.search)?.trim() ?? defaults.search,
    suspensionReason: parseEnumParam(
      params.get(ORDER_FILTER_PARAM_KEYS.suspensionReason),
      SUSPENSION_REASON_FILTERS,
      defaults.suspensionReason
    ),
  };
}

export function serializeProcessedOrdersFilters(
  filters: ProcessedOrdersFilterValues
): URLSearchParams {
  const params = new URLSearchParams();
  setDateParam(params, ORDER_FILTER_PARAM_KEYS.fromDate, filters.fromDate);
  setDateParam(params, ORDER_FILTER_PARAM_KEYS.toDate, filters.toDate);
  setDateParam(
    params,
    ORDER_FILTER_PARAM_KEYS.expectedExecution,
    filters.expectedExecution
  );
  setSearchParam(params, filters.search);
  setEnumParam(
    params,
    ORDER_FILTER_PARAM_KEYS.orderType,
    filters.orderType,
    "all"
  );
  return params;
}

export function parseProcessedOrdersFilters(
  params: URLSearchParams,
  defaults: ProcessedOrdersFilterValues
): ProcessedOrdersFilterValues {
  return {
    fromDate:
      parseIsoDateParam(params.get(ORDER_FILTER_PARAM_KEYS.fromDate)) ??
      defaults.fromDate,
    toDate:
      parseIsoDateParam(params.get(ORDER_FILTER_PARAM_KEYS.toDate)) ??
      defaults.toDate,
    expectedExecution:
      parseIsoDateParam(
        params.get(ORDER_FILTER_PARAM_KEYS.expectedExecution)
      ) ?? defaults.expectedExecution,
    search: params.get(ORDER_FILTER_PARAM_KEYS.search)?.trim() ?? defaults.search,
    orderType: parseEnumParam(
      params.get(ORDER_FILTER_PARAM_KEYS.orderType),
      ORDER_SOURCE_FILTERS,
      defaults.orderType
    ),
  };
}

export function serializeVerificationOrdersFilters(
  filters: VerificationOrdersFilterValues
): URLSearchParams {
  const params = new URLSearchParams();
  setDateParam(params, ORDER_FILTER_PARAM_KEYS.fromDate, filters.fromDate);
  setDateParam(params, ORDER_FILTER_PARAM_KEYS.toDate, filters.toDate);
  setSearchParam(params, filters.search);
  setEnumParam(params, ORDER_FILTER_PARAM_KEYS.status, filters.status, "all");
  return params;
}

export function parseVerificationOrdersFilters(
  params: URLSearchParams,
  defaults: VerificationOrdersFilterValues
): VerificationOrdersFilterValues {
  return {
    fromDate:
      parseIsoDateParam(params.get(ORDER_FILTER_PARAM_KEYS.fromDate)) ??
      defaults.fromDate,
    toDate:
      parseIsoDateParam(params.get(ORDER_FILTER_PARAM_KEYS.toDate)) ??
      defaults.toDate,
    search: params.get(ORDER_FILTER_PARAM_KEYS.search)?.trim() ?? defaults.search,
    status: parseEnumParam(
      params.get(ORDER_FILTER_PARAM_KEYS.status),
      VERIFICATION_STATUS_FILTERS,
      defaults.status
    ),
  };
}

export function serializePaymentOrdersFilters(
  filters: PaymentOrdersFilterValues
): URLSearchParams {
  const params = new URLSearchParams();
  setDateParam(params, ORDER_FILTER_PARAM_KEYS.createdAt, filters.createdAt);
  setDateParam(
    params,
    ORDER_FILTER_PARAM_KEYS.contractUploadedAt,
    filters.contractUploadedAt
  );
  setSearchParam(params, filters.search);
  setEnumParam(
    params,
    ORDER_FILTER_PARAM_KEYS.orderType,
    filters.orderType,
    "all"
  );
  setEnumParam(
    params,
    ORDER_FILTER_PARAM_KEYS.deliveryStatus,
    filters.deliveryStatus,
    "all"
  );
  return params;
}

export function parsePaymentOrdersFilters(
  params: URLSearchParams,
  defaults: PaymentOrdersFilterValues
): PaymentOrdersFilterValues {
  return {
    createdAt:
      parseIsoDateParam(params.get(ORDER_FILTER_PARAM_KEYS.createdAt)) ??
      defaults.createdAt,
    contractUploadedAt:
      parseIsoDateParam(
        params.get(ORDER_FILTER_PARAM_KEYS.contractUploadedAt)
      ) ?? defaults.contractUploadedAt,
    search: params.get(ORDER_FILTER_PARAM_KEYS.search)?.trim() ?? defaults.search,
    orderType: parseEnumParam(
      params.get(ORDER_FILTER_PARAM_KEYS.orderType),
      ORDER_SOURCE_FILTERS,
      defaults.orderType
    ),
    deliveryStatus: parseEnumParam(
      params.get(ORDER_FILTER_PARAM_KEYS.deliveryStatus),
      DELIVERY_STATUS_FILTERS,
      defaults.deliveryStatus
    ),
  };
}

export function serializeCompletedOrdersFilters(
  filters: CompletedOrdersFilterValues
): URLSearchParams {
  const params = new URLSearchParams();
  setDateParam(params, ORDER_FILTER_PARAM_KEYS.fromDate, filters.fromDate);
  setDateParam(params, ORDER_FILTER_PARAM_KEYS.toDate, filters.toDate);
  setSearchParam(params, filters.search);
  setEnumParam(
    params,
    ORDER_FILTER_PARAM_KEYS.orderType,
    filters.orderType,
    "all"
  );
  setEnumParam(
    params,
    ORDER_FILTER_PARAM_KEYS.paymentMethod,
    filters.paymentMethod,
    "all"
  );
  setEnumParam(
    params,
    ORDER_FILTER_PARAM_KEYS.deliveryStatus,
    filters.deliveryStatus,
    "all"
  );
  return params;
}

export function parseCompletedOrdersFilters(
  params: URLSearchParams,
  defaults: CompletedOrdersFilterValues
): CompletedOrdersFilterValues {
  return {
    fromDate:
      parseIsoDateParam(params.get(ORDER_FILTER_PARAM_KEYS.fromDate)) ??
      defaults.fromDate,
    toDate:
      parseIsoDateParam(params.get(ORDER_FILTER_PARAM_KEYS.toDate)) ??
      defaults.toDate,
    search: params.get(ORDER_FILTER_PARAM_KEYS.search)?.trim() ?? defaults.search,
    orderType: parseEnumParam(
      params.get(ORDER_FILTER_PARAM_KEYS.orderType),
      ORDER_SOURCE_FILTERS,
      defaults.orderType
    ),
    paymentMethod: parseEnumParam(
      params.get(ORDER_FILTER_PARAM_KEYS.paymentMethod),
      PAYMENT_METHOD_FILTERS,
      defaults.paymentMethod
    ),
    deliveryStatus: parseEnumParam(
      params.get(ORDER_FILTER_PARAM_KEYS.deliveryStatus),
      DELIVERY_STATUS_FILTERS,
      defaults.deliveryStatus
    ),
  };
}

export function serializeCancelledOrdersFilters(
  filters: CancelledOrdersFilterValues
): URLSearchParams {
  const params = new URLSearchParams();
  setDateParam(
    params,
    ORDER_FILTER_PARAM_KEYS.cancelledAt,
    filters.cancelledAt
  );
  setSearchParam(params, filters.search);
  setEnumParam(
    params,
    ORDER_FILTER_PARAM_KEYS.orderType,
    filters.orderType,
    "all"
  );
  setEnumParam(
    params,
    ORDER_FILTER_PARAM_KEYS.cancellationSource,
    filters.cancellationSource,
    "all"
  );
  setEnumParam(
    params,
    ORDER_FILTER_PARAM_KEYS.cancellationReason,
    filters.cancellationReason,
    "all"
  );
  return params;
}

export function parseCancelledOrdersFilters(
  params: URLSearchParams,
  defaults: CancelledOrdersFilterValues
): CancelledOrdersFilterValues {
  const sourceParam = params
    .get(ORDER_FILTER_PARAM_KEYS.cancellationSource)
    ?.trim();
  const reasonParam = params
    .get(ORDER_FILTER_PARAM_KEYS.cancellationReason)
    ?.trim();

  return {
    cancelledAt:
      parseIsoDateParam(params.get(ORDER_FILTER_PARAM_KEYS.cancelledAt)) ??
      defaults.cancelledAt,
    search: params.get(ORDER_FILTER_PARAM_KEYS.search)?.trim() ?? defaults.search,
    orderType: parseEnumParam(
      params.get(ORDER_FILTER_PARAM_KEYS.orderType),
      ORDER_SOURCE_FILTERS,
      defaults.orderType
    ),
    cancellationSource: sourceParam || defaults.cancellationSource,
    cancellationReason: reasonParam || defaults.cancellationReason,
  };
}

export function serializeRefundOrdersFilters(
  filters: RefundOrdersFilterValues
): URLSearchParams {
  const params = new URLSearchParams();
  setDateParam(
    params,
    ORDER_FILTER_PARAM_KEYS.requestedAt,
    filters.requestedAt
  );
  setSearchParam(params, filters.search);
  setEnumParam(
    params,
    ORDER_FILTER_PARAM_KEYS.orderType,
    filters.orderType,
    "all"
  );
  setEnumParam(
    params,
    ORDER_FILTER_PARAM_KEYS.refundStatus,
    filters.refundStatus,
    "all"
  );
  setEnumParam(
    params,
    ORDER_FILTER_PARAM_KEYS.refundMethod,
    filters.refundMethod,
    "all"
  );
  return params;
}

export function parseRefundOrdersFilters(
  params: URLSearchParams,
  defaults: RefundOrdersFilterValues
): RefundOrdersFilterValues {
  return {
    requestedAt:
      parseIsoDateParam(params.get(ORDER_FILTER_PARAM_KEYS.requestedAt)) ??
      defaults.requestedAt,
    search: params.get(ORDER_FILTER_PARAM_KEYS.search)?.trim() ?? defaults.search,
    orderType: parseEnumParam(
      params.get(ORDER_FILTER_PARAM_KEYS.orderType),
      ORDER_SOURCE_FILTERS,
      defaults.orderType
    ),
    refundStatus: parseEnumParam(
      params.get(ORDER_FILTER_PARAM_KEYS.refundStatus),
      REFUND_STATUS_FILTERS,
      defaults.refundStatus
    ),
    refundMethod: parseEnumParam(
      params.get(ORDER_FILTER_PARAM_KEYS.refundMethod),
      REFUND_METHOD_FILTERS,
      defaults.refundMethod
    ),
  };
}
