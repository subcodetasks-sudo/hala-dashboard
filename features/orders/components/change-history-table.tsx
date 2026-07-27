"use client";

import { useTranslations } from "next-intl";

import CustomIcon from "@/components/custom-svg";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ChangeHistoryRow } from "@/features/orders/types";

type ChangeHistoryTableProps = {
  rows: ChangeHistoryRow[];
};

export default function ChangeHistoryTable({ rows }: ChangeHistoryTableProps) {
  const t = useTranslations("Orders.New.Review.employer");

  return (
    <section className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm sm:p-5">
      <h4 className="flex items-center gap-2 text-base font-bold text-brand-dark-blue">
        <CustomIcon
          src="/svg/profile-2user.svg"
          size={22}
          className="text-brand-dark-blue"
        />
        <span>{t("changeHistory")}</span>
      </h4>

      <div className="overflow-x-auto">
        <Table className="w-full text-end">
          <TableHeader className="bg-brand-background text-brand-black border-none [&_tr]:border-none">
            <TableRow className="border-none hover:bg-brand-background">
              <TableHead className="h-11 px-4 text-start font-bold text-brand-black border-none">
                {t("historyEmployee")}
              </TableHead>
              <TableHead className="h-11 px-4 text-center font-bold text-brand-black border-none">
                {t("historyAction")}
              </TableHead>
              <TableHead className="h-11 px-4 text-end font-bold text-brand-black border-none">
                {t("historyDateTime")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                className="border-none hover:bg-transparent"
              >
                <TableCell className="px-4 py-3.5 text-start border-none">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex size-4 shrink-0 rounded-full border border-black/20" />
                    <div className="relative size-9 shrink-0 overflow-hidden rounded-full bg-slate-200">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                        alt={row.employee}
                        className="size-full object-cover"
                      />
                    </div>
                    <span className="text-sm font-bold text-brand-black">
                      {row.employee}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3.5 text-center border-none">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E5EEFF] px-4 py-1.5 text-xs font-semibold text-[#1B4DFF]">
                    <span className="size-1.5 rounded-full bg-[#1B4DFF]" />
                    {row.actionType === "startReview"
                      ? `${t("actionStartReview")} ..`
                      : row.actionType}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3.5 text-end border-none">
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-sm font-bold text-brand-black">
                      الثلاثاء، 12 يناير 2026
                    </span>
                    <span className="text-xs text-brand-gris/70">
                      10:35 ص <span className="mx-0.5">•</span> منذ 5د
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
