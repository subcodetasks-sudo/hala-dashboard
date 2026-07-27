import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  NEW_ORDERS,
  filterNewOrders,
  getOrderReviewByOrderId,
} from "../mock-data";
import type {
  NewOrderRow,
  OrderReviewDetail,
  OrdersFilterValues,
} from "../types";

// In-memory store for initial state and mutations (enables instant client-side query updates)
let ordersStore: NewOrderRow[] = [...NEW_ORDERS];
const orderDetailsStore: Record<string, OrderReviewDetail> = {};

// Query Key Factory
export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (filters?: OrdersFilterValues) => [...orderKeys.lists(), { filters }] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
};

// API Fetch / Post Simulation handlers
export async function fetchOrders(filters?: OrdersFilterValues): Promise<NewOrderRow[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  if (filters) {
    return filterNewOrders(ordersStore, filters);
  }
  return ordersStore;
}

export async function fetchOrderById(id: string): Promise<OrderReviewDetail | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  if (orderDetailsStore[id]) {
    return orderDetailsStore[id];
  }
  const detail = getOrderReviewByOrderId(id);
  if (detail) {
    orderDetailsStore[id] = detail;
  }
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

// React Query Hooks

/**
 * Custom hook for querying all orders with optional filter criteria.
 */
export function useOrders(filters?: OrdersFilterValues) {
  return useQuery({
    queryKey: orderKeys.list(filters),
    queryFn: () => fetchOrders(filters),
  });
}

/**
 * Custom hook for querying a single order by ID.
 */
export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => fetchOrderById(id),
    enabled: Boolean(id),
  });
}

/**
 * Custom hook for creating a new order (POST).
 */
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
}

/**
 * Custom hook for updating an order (PUT/PATCH).
 */
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
