import { Suspense } from "react";

import VerificationOrdersView from "@/features/orders/verification/components/verification-orders-view";

export default function VerificationOrdersPage() {
  return (
    <Suspense fallback={null}>
      <VerificationOrdersView />
    </Suspense>
  );
}
