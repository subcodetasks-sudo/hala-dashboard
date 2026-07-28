"use client";

import { Eye } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import StartReviewDialog from "@/features/orders/new/components/start-review-dialog";

type StartReviewActionProps = {
  orderId: string;
  orderNumber: string;
  customerName: string;
  handlerName: string;
  label: string;
};

export default function StartReviewAction({
  orderId,
  orderNumber,
  customerName,
  handlerName,
  label,
}: StartReviewActionProps) {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className="h-9 gap-2 rounded-full border-none bg-brand-primary px-4 text-brand-white hover:bg-brand-primary/90"
      >
        <Eye className="size-4" strokeWidth={1.75} />
        <span>{label}</span>
      </Button>

      <StartReviewDialog
        open={isOpen}
        onOpenChange={setOpen}
        orderId={orderId}
        orderNumber={orderNumber}
        customerName={customerName}
        handlerName={handlerName}
      />
    </>
  );
}
