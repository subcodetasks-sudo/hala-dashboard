import { Suspense } from "react";

import CompletedOrdersView from "@/features/orders/completed/components/completed-orders-view";

export default function CompletedOrdersPage() {
  return (
    <Suspense fallback={null}>
      <CompletedOrdersView />
    </Suspense>
  );
}
