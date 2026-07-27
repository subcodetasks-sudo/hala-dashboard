export type OrderSource = "eform" | "manual";
export type OrderStatus =
  | "new"
  | "pending"
  | "processing"
  | "processed"
  | "completed";

export type MockOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  handlerName: string;
  createdDate: string;
  createdTime: string;
  source: OrderSource;
  executionDate: string;
  status: OrderStatus;
};
