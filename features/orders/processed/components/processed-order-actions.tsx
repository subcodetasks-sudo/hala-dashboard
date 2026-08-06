"use client";

import { ChevronLeft, Eye, MoreVertical } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";

import CustomIcon from "@/components/custom-svg";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SendContractForAuthDialog from "@/features/orders/processed/components/send-contract-for-auth-dialog";
import ViewDownloadContractDialog from "@/features/orders/components/view-download-contract-dialog";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type ProcessedOrderActionsProps = {
  orderId: string;
  orderNumber: string;
  employerName: string;
  workerName: string;
};

const ITEM_CLASS =
  "cursor-pointer gap-3 rounded-2xl border-none bg-brand-primary/8 px-3.5 py-3 text-sm font-semibold text-brand-black focus:bg-brand-primary/15 data-highlighted:bg-brand-primary/15";

function ActionItemContent({
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}) {
  return (
    <span className="flex w-full items-center gap-3">
      <span className="flex size-5 shrink-0 items-center justify-center text-brand-black">
        {icon}
      </span>
      <span className="min-w-0 flex-1 text-start">{label}</span>
      <ChevronLeft
        className="size-4 shrink-0 text-brand-black ltr:rotate-180"
        strokeWidth={1.75}
        aria-hidden
      />
    </span>
  );
}

export default function ProcessedOrderActions({
  orderId,
  orderNumber,
  employerName,
  workerName,
}: ProcessedOrderActionsProps) {
  const t = useTranslations("Orders.Processed.table");
  const [isContractDialogOpen, setContractDialogOpen] = useState(false);
  const [isSendForAuthOpen, setSendForAuthOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            aria-label={t("actions")}
            className="size-9 rounded-xl border-none bg-brand-primary p-0 text-brand-white hover:bg-brand-primary/90 data-[state=open]:bg-brand-accent data-[state=open]:hover:bg-brand-accent"
          >
            <MoreVertical className="size-4" strokeWidth={1.75} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className={cn(
            "w-auto min-w-66 rounded-3xl border border-brand-primary/15 bg-white p-3",
            "shadow-[0_0_0_1px_rgba(14,165,180,0.08),0_12px_28px_rgba(14,165,180,0.12)] ring-0"
          )}
        >
          <div className="flex flex-col gap-2">
            <DropdownMenuItem asChild className={ITEM_CLASS}>
              <Link href={`/orders/${orderId}`}>
                <ActionItemContent
                  icon={<Eye className="size-5" strokeWidth={1.75} />}
                  label={t("viewDetails")}
                />
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              className={ITEM_CLASS}
              onSelect={() => setContractDialogOpen(true)}
            >
              <ActionItemContent
                icon={
                  <CustomIcon
                    src="/svg/receipt-item.svg"
                    size={20}
                    className="text-brand-black"
                  />
                }
                label={t("viewDownloadContract")}
              />
            </DropdownMenuItem>

            <DropdownMenuItem
              className={ITEM_CLASS}
              onSelect={() => setSendForAuthOpen(true)}
            >
              <ActionItemContent
                icon={
                  <CustomIcon
                    src="/svg/maximize.svg"
                    size={20}
                    className="text-brand-black"
                  />
                }
                label={t("sendForVerification")}
              />
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <ViewDownloadContractDialog
        open={isContractDialogOpen}
        onOpenChange={setContractDialogOpen}
        orderId={orderId}
        orderNumber={orderNumber}
      />

      <SendContractForAuthDialog
        open={isSendForAuthOpen}
        onOpenChange={setSendForAuthOpen}
        orderId={orderId}
        orderNumber={orderNumber}
        employerName={employerName}
        workerName={workerName}
      />
    </>
  );
}
