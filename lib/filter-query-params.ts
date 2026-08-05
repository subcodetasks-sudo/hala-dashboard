import type {
  EmployeeAccountStatus,
  EmployeeJobRole,
  EmployeesFilterValues,
} from "@/features/employees/types";
import type { OrderSource } from "@/features/home/types";
import type {
  InvoiceContractStatus,
  InvoicesFilterValues,
} from "@/features/invoices/types";
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
import type { TrackingFilterValues } from "@/features/tracking/types";
import { parseIsoDateParam, toIsoDate } from "@/lib/iso-date";
import { parseEnumParam } from "@/lib/parse-enum-param";

export { parseIsoDateParam, toIsoDate } from "@/lib/iso-date";

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

export function setDateParam(
  params: URLSearchParams,
  key: OrderFilterParamKey,
  value: Date | undefined,
): void {
  if (value) params.set(key, toIsoDate(value));
}

export function setSearchParam(
  params: URLSearchParams,
  value: string | undefined,
): void {
  const trimmed = value?.trim();
  if (trimmed) params.set(ORDER_FILTER_PARAM_KEYS.search, trimmed);
}

export function setEnumParam<T extends string>(
  params: URLSearchParams,
  key: OrderFilterParamKey,
  value: T | undefined,
  defaultValue: T,
): void {
  if (value && value !== defaultValue) params.set(key, value);
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

const TRACKING_FILTER_PARAM_KEYS = {
  usageDate: "usageDate",
  search: "search",
  status: "status",
  shippingCompany: "shippingCompany",
} as const;

export function serializeTrackingFilters(
  filters: TrackingFilterValues,
): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.usageDate) {
    params.set(
      TRACKING_FILTER_PARAM_KEYS.usageDate,
      toIsoDate(filters.usageDate),
    );
  }

  const search = filters.search.trim();
  if (search) {
    params.set(TRACKING_FILTER_PARAM_KEYS.search, search);
  }

  if (filters.status !== "all") {
    params.set(TRACKING_FILTER_PARAM_KEYS.status, filters.status);
  }

  if (filters.shippingCompany !== "all") {
    params.set(
      TRACKING_FILTER_PARAM_KEYS.shippingCompany,
      filters.shippingCompany,
    );
  }

  return params;
}

export function parseTrackingFilters(
  params: URLSearchParams,
  defaults: TrackingFilterValues,
): TrackingFilterValues {
  return {
    usageDate:
      parseIsoDateParam(params.get(TRACKING_FILTER_PARAM_KEYS.usageDate)) ??
      defaults.usageDate,
    search:
      params.get(TRACKING_FILTER_PARAM_KEYS.search)?.trim() ?? defaults.search,
    status: params.get(TRACKING_FILTER_PARAM_KEYS.status) ?? defaults.status,
    shippingCompany:
      params.get(TRACKING_FILTER_PARAM_KEYS.shippingCompany) ??
      defaults.shippingCompany,
  };
}

const INVOICE_FILTER_PARAM_KEYS = {
  paidAt: "paidAt",
  search: "search",
  orderType: "orderType",
  paymentMethod: "paymentMethod",
  contractStatus: "contractStatus",
} as const;

const INVOICE_ORDER_SOURCE_FILTERS = [
  "all",
  "eform",
  "manual",
] as const satisfies readonly ("all" | OrderSource)[];

const INVOICE_PAYMENT_METHOD_FILTERS = [
  "all",
  "online",
  "manual",
] as const satisfies readonly ("all" | PaymentMethod)[];

const CONTRACT_STATUS_FILTERS = [
  "all",
  "available",
  "temporarily_unavailable",
] as const satisfies readonly ("all" | InvoiceContractStatus)[];

export function serializeInvoicesFilters(
  filters: InvoicesFilterValues,
): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.paidAt) {
    params.set(INVOICE_FILTER_PARAM_KEYS.paidAt, toIsoDate(filters.paidAt));
  }

  const search = filters.search.trim();
  if (search) {
    params.set(INVOICE_FILTER_PARAM_KEYS.search, search);
  }

  if (filters.orderType !== "all") {
    params.set(INVOICE_FILTER_PARAM_KEYS.orderType, filters.orderType);
  }

  if (filters.paymentMethod !== "all") {
    params.set(INVOICE_FILTER_PARAM_KEYS.paymentMethod, filters.paymentMethod);
  }

  if (filters.contractStatus !== "all") {
    params.set(
      INVOICE_FILTER_PARAM_KEYS.contractStatus,
      filters.contractStatus,
    );
  }

  return params;
}

export function parseInvoicesFilters(
  params: URLSearchParams,
  defaults: InvoicesFilterValues,
): InvoicesFilterValues {
  return {
    paidAt:
      parseIsoDateParam(params.get(INVOICE_FILTER_PARAM_KEYS.paidAt)) ??
      defaults.paidAt,
    search:
      params.get(INVOICE_FILTER_PARAM_KEYS.search)?.trim() ?? defaults.search,
    orderType: parseEnumParam(
      params.get(INVOICE_FILTER_PARAM_KEYS.orderType),
      INVOICE_ORDER_SOURCE_FILTERS,
      defaults.orderType,
    ),
    paymentMethod: parseEnumParam(
      params.get(INVOICE_FILTER_PARAM_KEYS.paymentMethod),
      INVOICE_PAYMENT_METHOD_FILTERS,
      defaults.paymentMethod,
    ),
    contractStatus: parseEnumParam(
      params.get(INVOICE_FILTER_PARAM_KEYS.contractStatus),
      CONTRACT_STATUS_FILTERS,
      defaults.contractStatus,
    ),
  };
}

const EMPLOYEE_FILTER_PARAM_KEYS = {
  createdAt: "createdAt",
  search: "search",
  role: "role",
  status: "status",
} as const;

const ROLE_FILTERS = [
  "all",
  "review",
  "dataProcessing",
  "contractFollowUp",
] as const satisfies readonly ("all" | EmployeeJobRole)[];

const STATUS_FILTERS = [
  "all",
  "active",
  "suspended",
] as const satisfies readonly ("all" | EmployeeAccountStatus)[];

export function serializeEmployeesFilters(
  filters: EmployeesFilterValues,
): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.createdAt) {
    params.set(
      EMPLOYEE_FILTER_PARAM_KEYS.createdAt,
      toIsoDate(filters.createdAt),
    );
  }

  const search = filters.search.trim();
  if (search) {
    params.set(EMPLOYEE_FILTER_PARAM_KEYS.search, search);
  }

  if (filters.role !== "all") {
    params.set(EMPLOYEE_FILTER_PARAM_KEYS.role, filters.role);
  }

  if (filters.status !== "all") {
    params.set(EMPLOYEE_FILTER_PARAM_KEYS.status, filters.status);
  }

  return params;
}

export function parseEmployeesFilters(
  params: URLSearchParams,
  defaults: EmployeesFilterValues,
): EmployeesFilterValues {
  return {
    createdAt:
      parseIsoDateParam(params.get(EMPLOYEE_FILTER_PARAM_KEYS.createdAt)) ??
      defaults.createdAt,
    search:
      params.get(EMPLOYEE_FILTER_PARAM_KEYS.search)?.trim() ?? defaults.search,
    role: parseEnumParam(
      params.get(EMPLOYEE_FILTER_PARAM_KEYS.role),
      ROLE_FILTERS,
      defaults.role,
    ),
    status: parseEnumParam(
      params.get(EMPLOYEE_FILTER_PARAM_KEYS.status),
      STATUS_FILTERS,
      defaults.status,
    ),
  };
}
