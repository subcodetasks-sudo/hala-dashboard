import { notFound } from "next/navigation";

import OrderView from "@/features/orders/components/order-view";
import { getOrderReviewByOrderId } from "@/features/orders/mock-data";

type OrderPageProps = {
  params: Promise<{ orderId: string }>;
};

export default async function OrderPage({ params }: OrderPageProps) {
  const { orderId } = await params;
  const order = getOrderReviewByOrderId(orderId);

  if (!order) {
    notFound();
  }

  return <OrderView order={order} />;
}
