import { Suspense } from "react";

import OrderView from "@/features/orders/components/order-view";

type OrderPageProps = {
  params: Promise<{ orderId: string }>;
};

export default async function OrderPage({ params }: OrderPageProps) {
  const { orderId } = await params;
  return (
    <Suspense fallback={null}>
      <OrderView orderId={orderId} />
    </Suspense>
  );
}
