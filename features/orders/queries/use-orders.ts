import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { NEW_ORDERS, filterNewOrders } from "../mock-data";
import type {
  NewOrderRow,
  OrderDetailResponse,
  OrderReviewDetail,
  OrdersFilterValues,
} from "../types";
import type { EmployerFormValues } from "@/features/orders/schemas/employer-schema";
import type { WorkerFormValues } from "@/features/orders/schemas/worker-schema";
import { orderKeys } from "@/features/orders/query-keys";
import { mapOrderDetailToReview } from "@/features/orders/utils/map-order-detail";

export { orderKeys };

// In-memory store for list mutations (dialogs still use mock list updates)
let ordersStore: NewOrderRow[] = [...NEW_ORDERS];
const orderDetailsStore: Record<string, OrderReviewDetail> = {};

export async function fetchOrders(filters?: OrdersFilterValues): Promise<NewOrderRow[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  if (filters) {
    return filterNewOrders(ordersStore, filters);
  }
  return ordersStore;
}

/**
 * Fetches a renewal request from `/admin/renewal-requests/:id` via the App Router proxy.
 */
export async function fetchOrderById(
  id: string,
  locale: string,
): Promise<OrderReviewDetail | null> {
  const response = await fetch(`/api/orders/renewal-requests/${encodeURIComponent(id)}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
    },
  });

  const payload = (await response.json().catch(() => null)) as
    | OrderDetailResponse
    | { success?: false; message?: string }
    | null;

  if (response.status === 404) {
    return null;
  }

  if (!response.ok || !payload || !("success" in payload) || !payload.success) {
    throw new Error(
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Failed to load renewal request",
    );
  }

  const appLocale = locale.startsWith("en") ? "en" : "ar";
  const detail = mapOrderDetailToReview(payload.data, appLocale);
  orderDetailsStore[id] = detail;
  return detail;
}

export async function createOrder(newOrder: Omit<NewOrderRow, "id">): Promise<NewOrderRow> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const created: NewOrderRow = {
    ...newOrder,
    id: String(ordersStore.length + 1),
  };
  ordersStore = [created, ...ordersStore];
  return created;
}

export async function updateOrder(id: string, updates: Partial<NewOrderRow>): Promise<NewOrderRow> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  let updatedOrder: NewOrderRow | undefined;
  ordersStore = ordersStore.map((ord) => {
    if (ord.id === id) {
      updatedOrder = { ...ord, ...updates };
      return updatedOrder;
    }
    return ord;
  });
  if (!updatedOrder) {
    throw new Error(`Order with ID ${id} not found`);
  }
  return updatedOrder;
}

function ensureOrderDetail(id: string): OrderReviewDetail {
  if (orderDetailsStore[id]) {
    return orderDetailsStore[id];
  }
  throw new Error(`Order detail with ID ${id} not loaded`);
}

export async function updateOrderReviewDetail(
  id: string,
  updates: Partial<OrderReviewDetail>
): Promise<OrderReviewDetail> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const current = ensureOrderDetail(id);
  const updated = { ...current, ...updates };
  orderDetailsStore[id] = updated;
  return updated;
}

export async function updateOrderEmployer(
  id: string,
  values: EmployerFormValues
): Promise<OrderReviewDetail> {
  return updateOrderReviewDetail(id, {
    employerName: values.employerName,
    nationalId: values.nationalId,
    phoneLocal: values.phoneLocal,
    city: values.city,
    address: values.address,
  });
}

export async function updateOrderWorker(
  id: string,
  values: WorkerFormValues
): Promise<OrderReviewDetail> {
  return updateOrderReviewDetail(id, {
    workerName: values.workerName,
    workerPhoneLocal: values.workerPhoneLocal,
    workerBirthDate: values.birthDate,
    workerHomeAddress: values.homeAddress,
    workerPassportIssuePlace: values.passportIssuePlace,
    workerPassportNumber: values.passportNumber,
    workerPassportIssueDate: values.passportIssueDate,
    workerPassportExpiryDate: values.passportExpiryDate,
  });
}

/**
 * Seeds the in-memory detail store (e.g. from server-rendered initial data)
 * so employer/worker edits can update the cache before a client refetch.
 */
export function seedOrderDetail(order: OrderReviewDetail) {
  orderDetailsStore[order.id] = order;
}

export function useOrders(filters?: OrdersFilterValues) {
  return useQuery({
    queryKey: orderKeys.list(filters),
    queryFn: () => fetchOrders(filters),
  });
}

/**
 * Custom hook for querying a single renewal request by ID.
 */
export function useOrder(id: string) {
  const locale = useLocale();

  return useQuery({
    queryKey: [...orderKeys.detail(id), locale],
    queryFn: () => fetchOrderById(id, locale),
    enabled: Boolean(id),
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<NewOrderRow> }) =>
      updateOrder(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(data.id) });
    },
  });
}

export function useUpdateOrderEmployer() {
  const queryClient = useQueryClient();
  const locale = useLocale();

  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: EmployerFormValues }) =>
      updateOrderEmployer(id, values),
    onSuccess: (data) => {
      queryClient.setQueryData([...orderKeys.detail(data.id), locale], data);
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
}

export function useUpdateOrderWorker() {
  const queryClient = useQueryClient();
  const locale = useLocale();

  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: WorkerFormValues }) =>
      updateOrderWorker(id, values),
    onSuccess: (data) => {
      queryClient.setQueryData([...orderKeys.detail(data.id), locale], data);
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
}
