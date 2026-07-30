import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrderReviewFromApiMock } from "../api-mock-data";
import { NEW_ORDERS, filterNewOrders } from "../mock-data";
import type {
  NewOrderRow,
  OrderReviewDetail,
  OrdersFilterValues,
} from "../types";
import type { EmployerFormValues } from "@/features/orders/schemas/employer-schema";
import type { WorkerFormValues } from "@/features/orders/schemas/worker-schema";
import { orderKeys } from "@/features/orders/query-keys";

export { orderKeys };

// In-memory store for initial state and mutations (enables instant client-side query updates)
let ordersStore: NewOrderRow[] = [...NEW_ORDERS];
const orderDetailsStore: Record<string, OrderReviewDetail> = {};

// API Fetch / Post Simulation handlers
export async function fetchOrders(filters?: OrdersFilterValues): Promise<NewOrderRow[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  if (filters) {
    return filterNewOrders(ordersStore, filters);
  }
  return ordersStore;
}

export async function fetchOrderById(id: string): Promise<OrderReviewDetail | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  if (orderDetailsStore[id]) {
    return orderDetailsStore[id];
  }
  const detail = getOrderReviewFromApiMock(id);
  if (detail) {
    orderDetailsStore[id] = detail;
  }
  return detail ?? null;
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
  const detail = getOrderReviewFromApiMock(id);
  if (!detail) {
    throw new Error(`Order detail with ID ${id} not found`);
  }
  orderDetailsStore[id] = detail;
  return detail;
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

/**
 * Updates employer fields on the order review detail cache.
 */
export function useUpdateOrderEmployer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: EmployerFormValues }) =>
      updateOrderEmployer(id, values),
    onSuccess: (data) => {
      queryClient.setQueryData(orderKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
}

/**
 * Updates worker fields on the order review detail cache.
 */
export function useUpdateOrderWorker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: WorkerFormValues }) =>
      updateOrderWorker(id, values),
    onSuccess: (data) => {
      queryClient.setQueryData(orderKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
}
