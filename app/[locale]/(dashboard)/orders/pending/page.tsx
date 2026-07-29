import { Suspense } from "react";

import PendingOrdersView from "@/features/orders/pending/components/pending-orders-view";

export default function PendingOrdersPage() {
  return (
    <Suspense fallback={null}>
      <PendingOrdersView />
    </Suspense>
  );
}
