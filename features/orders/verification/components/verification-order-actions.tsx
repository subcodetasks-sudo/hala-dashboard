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
import ViewDownloadContractDialog from "@/features/orders/components/view-download-contract-dialog";
import type { VerificationOrderStatus } from "@/features/orders/types";
import UploadFinalContractDialog from "@/features/orders/verification/components/upload-final-contract-dialog";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type VerificationOrderActionsProps = {
  orderId: string;
  orderNumber: string;
  status: VerificationOrderStatus;
};

const ITEM_CLASS =
  "cursor-pointer gap-3 rounded-2xl border-none bg-brand-primary/8 px-3.5 py-3.5 text-sm font-bold text-brand-dark-blue focus:bg-brand-primary/15 data-highlighted:bg-brand-primary/15";

function ActionItemContent({
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}) {
  return (
    <span className="flex w-full items-center gap-3">
      <span className="flex size-5 shrink-0 items-center justify-center text-brand-dark-blue">
        {icon}
      </span>
      <span className="min-w-0 flex-1 text-start">{label}</span>
      <ChevronLeft
        className="size-4 shrink-0 text-brand-dark-blue ltr:rotate-180"
        strokeWidth={1.75}
        aria-hidden
      />
    </span>
  );
}

export default function VerificationOrderActions({
  orderId,
  orderNumber,
  status,
}: VerificationOrderActionsProps) {
  const t = useTranslations("Orders.Verification.table");
  const [isContractDialogOpen, setContractDialogOpen] = useState(false);
  const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);

  const alreadyUploaded = status === "finalContractUploaded";

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
            "w-auto min-w-72 rounded-3xl border-none bg-white p-3",
            "shadow-[0_8px_28px_rgba(0,49,66,0.12)] ring-0"
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
                    className="text-brand-dark-blue"
                  />
                }
                label={t("viewDownloadContract")}
              />
            </DropdownMenuItem>

            <DropdownMenuItem
              className={ITEM_CLASS}
              disabled={alreadyUploaded}
              onSelect={() => {
                if (alreadyUploaded) return;
                setUploadDialogOpen(true);
              }}
            >
              <ActionItemContent
                icon={
                  <CustomIcon
                    src="/svg/maximize.svg"
                    size={20}
                    className="text-brand-dark-blue"
                  />
                }
                label={t("uploadFinalContract")}
              />
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <ViewDownloadContractDialog
        open={isContractDialogOpen}
        onOpenChange={setContractDialogOpen}
        orderNumber={orderNumber}
        showConfirmAction={!alreadyUploaded}
        confirmLabel={t("confirmUploadFinalContract")}
        onConfirmSend={() => {
          setContractDialogOpen(false);
          setUploadDialogOpen(true);
        }}
      />

      <UploadFinalContractDialog
        open={isUploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        orderId={orderId}
        orderNumber={orderNumber}
      />
    </>
  );
}
