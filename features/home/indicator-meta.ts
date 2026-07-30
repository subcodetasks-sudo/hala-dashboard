import type { HomeIndicatorKey } from "@/features/home/types";

/** Static card chrome for home indicators (values come from stats APIs). */
export const HOME_INDICATOR_META: {
  key: HomeIndicatorKey;
  iconSrc: string;
  bgClassName: string;
  valueClassName?: string;
}[] = [
  {
    key: "processing",
    iconSrc: "/svg/wallet.svg",
    bgClassName: "bg-brand-primary/10",
  },
  {
    key: "verification",
    iconSrc: "/svg/wallet.svg",
    bgClassName: "bg-brand-primary/10",
  },
  {
    key: "payment",
    iconSrc: "/svg/receipt-item.svg",
    bgClassName: "bg-brand-primary/10",
  },
  {
    key: "completed",
    iconSrc: "/svg/directbox-notif.svg",
    bgClassName: "bg-brand-primary/10",
  },
  {
    key: "cancelled",
    iconSrc: "/svg/receipt-minus.svg",
    bgClassName: "bg-brand-accent/10",
    valueClassName: "text-brand-accent",
  },
  {
    key: "refund",
    iconSrc: "/svg/receipt.svg",
    bgClassName: "bg-brand-accent/10",
    valueClassName: "text-brand-accent",
  },
];
