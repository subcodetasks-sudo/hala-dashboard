import type {
  InvoiceContractStatus,
  InvoicesFilterValues,
  OrderSource,
  PaymentMethod,
} from "@/features/invoices/types";
import { parseIsoDateParam, toIsoDate } from "@/lib/iso-date";
import { parseEnumParam } from "@/lib/parse-enum-param";

const INVOICE_FILTER_PARAM_KEYS = {
  paidAt: "paidAt",
  search: "search",
  orderType: "orderType",
  paymentMethod: "paymentMethod",
  contractStatus: "contractStatus",
} as const;

const ORDER_SOURCE_FILTERS = ["all", "eform", "manual"] as const satisfies readonly (
  | "all"
  | OrderSource
)[];

const PAYMENT_METHOD_FILTERS = [
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
      ORDER_SOURCE_FILTERS,
      defaults.orderType,
    ),
    paymentMethod: parseEnumParam(
      params.get(INVOICE_FILTER_PARAM_KEYS.paymentMethod),
      PAYMENT_METHOD_FILTERS,
      defaults.paymentMethod,
    ),
    contractStatus: parseEnumParam(
      params.get(INVOICE_FILTER_PARAM_KEYS.contractStatus),
      CONTRACT_STATUS_FILTERS,
      defaults.contractStatus,
    ),
  };
}
