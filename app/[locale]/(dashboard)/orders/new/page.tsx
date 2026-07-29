import { Suspense } from "react";

import NewOrdersView from "@/features/orders/new/components/new-orders-view";

export default function NewOrdersPage() {
  return (
    <Suspense fallback={null}>
      <NewOrdersView />
    </Suspense>
  );
}
