import type { HomeIndicatorKey } from "@/features/home/types";

/** Static card chrome for home indicators (values come from stats APIs). */
export const HOME_INDICATOR_META: {
  key: HomeIndicatorKey;
  iconSrc: string;
  bgClassName: string;
  valueClassName?: string;
  route: string;
}[] = [
  {
    key: "processing",
    iconSrc: "/svg/wallet.svg",
    bgClassName: "bg-brand-primary/10",
    route: "/orders/processed",
  },
  {
    key: "verification",
    iconSrc: "/svg/wallet.svg",
    bgClassName: "bg-brand-primary/10",
    route: "/orders/verification",
  },
  {
    key: "payment",
    iconSrc: "/svg/receipt-item.svg",
    bgClassName: "bg-brand-primary/10",
    route: "/orders/payment",
  },
  {
    key: "completed",
    iconSrc: "/svg/directbox-notif.svg",
    bgClassName: "bg-brand-primary/10",
    route: "/orders/completed",
  },
  {
    key: "cancelled",
    iconSrc: "/svg/receipt-minus.svg",
    bgClassName: "bg-brand-accent/10",
    valueClassName: "text-brand-accent",
    route: "/orders/cancelled",
  },
  {
    key: "refund",
    iconSrc: "/svg/receipt.svg",
    bgClassName: "bg-brand-accent/10",
    valueClassName: "text-brand-accent",
    route: "/orders/refunds",
  },
];

