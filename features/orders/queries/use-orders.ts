import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { NEW_ORDERS, filterNewOrders } from "../mock-data";
import {
  getMockOrderDetail,
  isMockOrderDetailId,
} from "../mock-order-details";
import type {
  NewOrderRow,
  OrderDetailResponse,
  OrderReviewDetail,
  OrdersFilterValues,
} from "../types";
import { orderKeys } from "@/features/orders/query-keys";
import { mapOrderDetailToReview } from "@/features/orders/utils/map-order-detail";
import { setSeededOrderDetail } from "@/features/orders/queries/order-detail-store";

export { orderKeys };

// In-memory store for list mutations (dialogs still use mock list updates)
let ordersStore: NewOrderRow[] = [...NEW_ORDERS];

export async function fetchOrders(filters?: OrdersFilterValues): Promise<NewOrderRow[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  if (filters) {
    return filterNewOrders(ordersStore, filters);
  }
  return ordersStore;
}

function mapMockOrderDetail(
  id: string,
  locale: string,
): OrderReviewDetail | null {
  const mock = getMockOrderDetail(id);
  if (!mock) return null;

  const appLocale = locale.startsWith("en") ? "en" : "ar";
  const detail = {
    ...mapOrderDetailToReview(mock, appLocale),
    // Keep the unique string mock id used in list links / the URL.
    id,
  };
  setSeededOrderDetail(id, detail);
  return detail;
}

/**
 * Fetches a renewal request from `/admin/renewal-requests/:id` via the App Router proxy.
 * Known mock ids (payment / completed / refund) resolve locally for now.
 */
export async function fetchOrderById(
  id: string,
  locale: string,
): Promise<OrderReviewDetail | null> {
  if (isMockOrderDetailId(id)) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return mapMockOrderDetail(id, locale);
  }

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
    // Temporary fallback while payment / completed / refund detail APIs catch up.
    return mapMockOrderDetail(id, locale);
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
  setSeededOrderDetail(id, detail);
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

/**
 * Seeds the in-memory detail store (e.g. from server-rendered initial data)
 * so employer/worker edits can update the cache before a client refetch.
 */
export { seedOrderDetail } from "@/features/orders/queries/order-detail-store";

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

