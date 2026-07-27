import type { MockOrder } from "@/features/home/types";

/** RTL: first item renders on the right (matches design order). */
export const MOCK_INDICATORS = [
  {
    key: "processing" as const,
    value: "342",
    change: "+24%",
    iconSrc: "/svg/wallet.svg",
    bgClassName: "bg-brand-primary/10",
  },
  {
    key: "verification" as const,
    value: "342",
    change: "+24%",
    iconSrc: "/svg/wallet.svg",
    bgClassName: "bg-brand-primary/10",
  },
  {
    key: "payment" as const,
    value: "14",
    change: "+24%",
    iconSrc: "/svg/receipt-item.svg",
    bgClassName: "bg-brand-primary/10",
  },
  {
    key: "completed" as const,
    value: "182",
    change: "+24%",
    iconSrc: "/svg/directbox-notif.svg",
    bgClassName: "bg-brand-primary/10",
  },
  {
    key: "cancelled" as const,
    value: "04",
    change: "+24%",
    iconSrc: "/svg/receipt-minus.svg",
    bgClassName: "bg-brand-accent/10",
    valueClassName: "text-brand-accent",
  },
  {
    key: "refund" as const,
    value: "06",
    change: "+24%",
    iconSrc: "/svg/receipt.svg",
    bgClassName: "bg-brand-accent/10",
    valueClassName: "text-brand-accent",
  },
];

/** RTL: first item renders on the right (matches design order). */
export const MOCK_EMPLOYEE_GROUPS = [
  {
    key: "review" as const,
    count: "02",
    avatars: [
      {
        name: "سارة",
        fallback: "س",
        fallbackClassName: "bg-[#E8913A]",
      },
      {
        name: "محمد",
        fallback: "م",
        fallbackClassName: "bg-brand-primary",
      },
    ],
  },
  {
    key: "dataProcessing" as const,
    count: "04",
    avatars: [
      {
        name: "Fahad Alotaibi",
        src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop",
      },
      {
        name: "نورة",
        fallback: "ن",
        fallbackClassName: "bg-[#8B6BB5]",
      },
      {
        name: "Yousef Ibrahim",
        src: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=96&h=96&fit=crop",
      },
      {
        name: "هدى",
        fallback: "ه",
        fallbackClassName: "bg-brand-success",
      },
    ],
  },
  {
    key: "contractFollowUp" as const,
    count: "06",
    avatars: [
      {
        name: "Sara Ahmed",
        src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop",
      },
      {
        name: "خالد",
        fallback: "خ",
        fallbackClassName: "bg-brand-accent",
      },
      {
        name: "Layla Hassan",
        src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop",
      },
      {
        name: "عمر",
        fallback: "ع",
        fallbackClassName: "bg-brand-primary",
      },
      {
        name: "Noura Saleh",
        src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=96&h=96&fit=crop",
      },
      {
        name: "فهد",
        fallback: "ف",
        fallbackClassName: "bg-[#E8913A]",
      },
    ],
  },
];

export const MOCK_ORDERS: MockOrder[] = [
  {
    id: "1",
    orderNumber: "#ORD-01",
    customerName: "Abdulaziz Al-Dosari",
    customerPhone: "+966 514 111 001",
    handlerName: "Sara Ahmed",
    createdDate: "Tuesday, 12 January 2026",
    createdTime: "10:24 AM",
    source: "eform",
    executionDate: "Wednesday, 19 February 2026",
    status: "new",
  },
  {
    id: "2",
    orderNumber: "#ORD-02",
    customerName: "Noura Alharbi",
    customerPhone: "+966 512 222 014",
    handlerName: "Omar Ali",
    createdDate: "Monday, 11 January 2026",
    createdTime: "02:15 PM",
    source: "manual",
    executionDate: "Thursday, 20 February 2026",
    status: "new",
  },
  {
    id: "3",
    orderNumber: "#ORD-03",
    customerName: "Khalid Alotaibi",
    customerPhone: "+966 555 333 021",
    handlerName: "Layla Hassan",
    createdDate: "Sunday, 10 January 2026",
    createdTime: "09:05 AM",
    source: "eform",
    executionDate: "Friday, 21 February 2026",
    status: "new",
  },
  {
    id: "4",
    orderNumber: "#ORD-04",
    customerName: "Huda Mansour",
    customerPhone: "+966 501 444 088",
    handlerName: "Fahad Alotaibi",
    createdDate: "Saturday, 9 January 2026",
    createdTime: "04:40 PM",
    source: "manual",
    executionDate: "Monday, 23 February 2026",
    status: "new",
  },
  {
    id: "5",
    orderNumber: "#ORD-05",
    customerName: "Yousef Ibrahim",
    customerPhone: "+966 540 555 099",
    handlerName: "Maha Alharbi",
    createdDate: "Friday, 8 January 2026",
    createdTime: "11:30 AM",
    source: "eform",
    executionDate: "Tuesday, 24 February 2026",
    status: "new",
  },
];
