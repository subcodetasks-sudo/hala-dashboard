import { Suspense } from "react";

import ProcessedOrdersView from "@/features/orders/processed/components/processed-orders-view";

export default function ProcessedOrdersPage() {
  return (
    <Suspense fallback={null}>
      <ProcessedOrdersView />
    </Suspense>
  );
}
