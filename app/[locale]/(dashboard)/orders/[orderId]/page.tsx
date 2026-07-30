import { notFound } from "next/navigation";

import { getOrderReviewFromApiMock } from "@/features/orders/api-mock-data";
import OrderView from "@/features/orders/components/order-view";

type OrderPageProps = {
  params: Promise<{ orderId: string }>;
};

export default async function OrderPage({ params }: OrderPageProps) {
  const { orderId } = await params;
  const order = getOrderReviewFromApiMock(orderId);

  if (!order) {
    notFound();
  }

  return <OrderView order={order} />;
}
