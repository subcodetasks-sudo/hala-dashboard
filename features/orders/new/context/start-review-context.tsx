"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type StartReviewOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  handlerName: string;
};

type StartReviewContextValue = {
  order: StartReviewOrder | null;
  isOpen: boolean;
  openStartReview: (order: StartReviewOrder) => void;
  closeStartReview: () => void;
  setOpen: (open: boolean) => void;
};

const StartReviewContext = createContext<StartReviewContextValue | null>(null);

export function StartReviewProvider({ children }: { children: ReactNode }) {
  const [order, setOrder] = useState<StartReviewOrder | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openStartReview = useCallback((next: StartReviewOrder) => {
    setOrder(next);
    setIsOpen(true);
  }, []);

  const closeStartReview = useCallback(() => {
    setIsOpen(false);
    setOrder(null);
  }, []);

  const setOpen = useCallback((open: boolean) => {
    setIsOpen(open);
    if (!open) setOrder(null);
  }, []);

  const value = useMemo(
    () => ({
      order,
      isOpen,
      openStartReview,
      closeStartReview,
      setOpen,
    }),
    [order, isOpen, openStartReview, closeStartReview, setOpen]
  );

  return (
    <StartReviewContext.Provider value={value}>
      {children}
    </StartReviewContext.Provider>
  );
}

export function useStartReview() {
  const context = useContext(StartReviewContext);
  if (!context) {
    throw new Error("useStartReview must be used within a StartReviewProvider.");
  }
  return context;
}
