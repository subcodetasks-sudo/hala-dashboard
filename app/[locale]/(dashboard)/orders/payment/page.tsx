import { Suspense } from "react";

import PaymentOrdersView from "@/features/orders/payment/components/payment-orders-view";

export default function PaymentOrdersPage() {
  return (
    <Suspense fallback={null}>
      <PaymentOrdersView />
    </Suspense>
  );
}
