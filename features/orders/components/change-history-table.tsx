"use client";

import { useLocale, useTranslations } from "next-intl";

import CustomIcon from "@/components/custom-svg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

type ActionBadgeStyle = {
  bg: string;
  text: string;
  dot: string;
  defaultLabel: string;
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

const ACTION_STYLES: Record<string, ActionBadgeStyle> = {
  startReview: {
    bg: "bg-[#EAEFFF]",
    text: "text-[#3D66FF]",
    dot: "bg-[#3D66FF]",
    defaultLabel: "بدء مراجعة ..",
  },
  review_started: {
    bg: "bg-[#EAEFFF]",
    text: "text-[#3D66FF]",
    dot: "bg-[#3D66FF]",
    defaultLabel: "بدء مراجعة ..",
  },
  under_review: {
    bg: "bg-[#EAEFFF]",
    text: "text-[#3D66FF]",
    dot: "bg-[#3D66FF]",
    defaultLabel: "بدء مراجعة ..",
  },
  held: {
    bg: "bg-[#FDF0FA]",
    text: "text-[#C22BB0]",
    dot: "bg-[#C22BB0]",
    defaultLabel: "تعليق الطلب",
  },
  pendOrder: {
    bg: "bg-[#FDF0FA]",
    text: "text-[#C22BB0]",
    dot: "bg-[#C22BB0]",
    defaultLabel: "تعليق الطلب",
  },
  processed: {
    bg: "bg-[#E8FAEA]",
    text: "text-[#22AD38]",
    dot: "bg-[#22AD38]",
    defaultLabel: "تمت المعالجة",
  },
  processOrder: {
    bg: "bg-[#E8FAEA]",
    text: "text-[#22AD38]",
    dot: "bg-[#22AD38]",
    defaultLabel: "تمت المعالجة",
  },
  sent_for_authentication: {
    bg: "bg-[#F0EBFF]",
    text: "text-[#6A2BEE]",
    dot: "bg-[#6A2BEE]",
    defaultLabel: "تم الإرسال للمصادقة",
  },
  sendForAuth: {
    bg: "bg-[#F0EBFF]",
    text: "text-[#6A2BEE]",
    dot: "bg-[#6A2BEE]",
    defaultLabel: "تم الإرسال للمصادقة",
  },
  awaiting_payment: {
    bg: "bg-[#FFF2E5]",
    text: "text-[#E07212]",
    dot: "bg-[#E07212]",
    defaultLabel: "بانتظار الدفع",
  },
  awaitPayment: {
    bg: "bg-[#FFF2E5]",
    text: "text-[#E07212]",
    dot: "bg-[#E07212]",
    defaultLabel: "بانتظار الدفع",
  },
  completed: {
    bg: "bg-[#E5FAF9]",
    text: "text-[#0DBDB2]",
    dot: "bg-[#0DBDB2]",
    defaultLabel: "مكتمل",
  },
  completeOrder: {
    bg: "bg-[#E5FAF9]",
    text: "text-[#0DBDB2]",
    dot: "bg-[#0DBDB2]",
    defaultLabel: "مكتمل",
  },
  cancelled: {
    bg: "bg-[#FEE2E2]",
    text: "text-[#EF4444]",
    dot: "bg-[#EF4444]",
    defaultLabel: "ملغى",
  },
  new: {
    bg: "bg-[#E0F2FE]",
    text: "text-[#0284C7]",
    dot: "bg-[#0284C7]",
    defaultLabel: "جديد",
  },
};

const DEFAULT_STYLE: ActionBadgeStyle = {
  bg: "bg-slate-100",
  text: "text-slate-700",
  dot: "bg-slate-500",
  defaultLabel: "",
};

function getActionBadgeStyle(actionType: string): ActionBadgeStyle {
  if (ACTION_STYLES[actionType]) {
    return ACTION_STYLES[actionType];
  }
  const normalized = actionType.toLowerCase().replace(/\s+/g, "_");
  for (const [key, style] of Object.entries(ACTION_STYLES)) {
    if (normalized.includes(key.toLowerCase())) {
      return style;
    }
  }
  return DEFAULT_STYLE;
}

function formatHistoryDateTime(rawDate: string, locale: string) {
  if (!rawDate) {
    return { dateStr: "—", timeStr: "—", relativeStr: "" };
  }

  const cleanDateStr = rawDate.replace(" ", "T");
  const date = new Date(cleanDateStr);

  if (isNaN(date.getTime())) {
    return { dateStr: rawDate, timeStr: "", relativeStr: "" };
  }

  const isAr = locale.startsWith("ar");

  const dateStr = date.toLocaleDateString(isAr ? "ar" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    calendar: "gregory",
  });

  const timeStr = date.toLocaleTimeString(isAr ? "ar" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    calendar: "gregory",
  });

  const now = new Date();
  const diffMs = Math.max(0, now.getTime() - date.getTime());
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  let relativeStr = "";
  if (diffMins < 1) {
    relativeStr = isAr ? "الآن" : "Just now";
  } else if (diffMins < 60) {
    relativeStr = isAr ? `منذ ${diffMins}د` : `${diffMins}m ago`;
  } else if (diffHours < 24) {
    relativeStr = isAr ? `منذ ${diffHours}س` : `${diffHours}h ago`;
  } else {
    relativeStr = isAr ? `منذ ${diffDays}ي` : `${diffDays}d ago`;
  }

  return { dateStr, timeStr, relativeStr };
}

export default function ChangeHistoryTable({ rows }: ChangeHistoryTableProps) {
  const t = useTranslations("Orders.New.Review.employer");
  const locale = useLocale();

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
        <Table className="w-full">
          <TableHeader className="bg-[#EDF6F7] text-brand-black border-none [&_tr]:border-none">
            <TableRow className="border-none hover:bg-[#EDF6F7]">
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
          <TableBody className="divide-y divide-gray-100">
            {rows.map((row) => {
              const badgeStyle = getActionBadgeStyle(row.actionType);
              let label = row.actionType;

              if (row.actionType === "startReview" || row.actionType === "review_started" || row.actionType === "بدء مراجعة الطلب") {
                label = "بدء مراجعة ..";
              } else if (row.actionType === "held" || row.actionType === "Request put on hold") {
                label = "تعليق الطلب";
              } else if (badgeStyle.defaultLabel) {
                label = badgeStyle.defaultLabel;
              }

              const { dateStr, timeStr, relativeStr } = formatHistoryDateTime(
                row.dateTime,
                locale,
              );

              const initials = getInitials(row.employee || "");

              return (
                <TableRow
                  key={row.id}
                  className="border-none hover:bg-slate-50/50"
                >
                  <TableCell className="px-4 py-3.5 text-start border-none">
                    <div className="flex items-center gap-2.5">
                      <span className="inline-flex size-4 shrink-0 rounded-full border border-black/20" />
                      <Avatar className="size-9 shrink-0 overflow-hidden rounded-full border border-black/5">
                        <AvatarImage src="" alt={row.employee} />
                        <AvatarFallback className="rounded-full bg-[#EBF3F5] text-xs font-bold text-brand-dark-blue">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-bold text-brand-black">
                        {row.employee}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3.5 text-center border-none">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold ${badgeStyle.bg} ${badgeStyle.text}`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${badgeStyle.dot}`}
                      />
                      {label}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3.5 text-end border-none">
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="text-sm font-bold text-brand-black">
                        {dateStr}
                      </span>
                      <span className="text-xs text-brand-gris/70">
                        {timeStr}
                        {relativeStr ? (
                          <>
                            <span className="mx-1">•</span>
                            {relativeStr}
                          </>
                        ) : null}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}


