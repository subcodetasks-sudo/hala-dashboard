"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { OrderReviewDetail } from "@/features/orders/mock-data";
import type { EmployerFormValues } from "@/features/orders/schemas/employer-schema";

export type ReviewTabId = "employer" | "worker" | "documents";

export const NEW_ORDER_CHECKLIST_IDS = [
  "checklistEmployer",
  "checklistWorker",
  "checklistAttachments",
  "checklistContract",
  "checklistNoConflicts",
] as const;

export type NewOrderChecklistId = (typeof NEW_ORDER_CHECKLIST_IDS)[number];

type ChecklistState = Record<NewOrderChecklistId, boolean>;

type NewOrderReviewContextValue = {
  order: OrderReviewDetail;
  updateEmployer: (values: EmployerFormValues) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  activeTab: ReviewTabId;
  setActiveTab: (tab: ReviewTabId) => void;
  checklist: ChecklistState;
  toggleChecklistItem: (id: NewOrderChecklistId) => void;
  /** True when every checklist item is checked. */
  canCompleteReview: boolean;
  /** Show review actions for new orders when not editing. */
  showReviewActions: boolean;
};

const INITIAL_CHECKLIST: ChecklistState = {
  checklistEmployer: false,
  checklistWorker: false,
  checklistAttachments: false,
  checklistContract: false,
  checklistNoConflicts: false,
};

const NewOrderReviewContext =
  createContext<NewOrderReviewContextValue | null>(null);

export function NewOrderReviewProvider({
  order: initialOrder,
  children,
}: {
  order: OrderReviewDetail;
  children: ReactNode;
}) {
  const [order, setOrder] = useState(initialOrder);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<ReviewTabId>("employer");
  const [checklist, setChecklist] = useState<ChecklistState>(INITIAL_CHECKLIST);

  const toggleChecklistItem = useCallback((id: NewOrderChecklistId) => {
    setChecklist((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const updateEmployer = useCallback((values: EmployerFormValues) => {
    setOrder((prev) => ({
      ...prev,
      employerName: values.employerName,
      nationalId: values.nationalId,
      phoneLocal: values.phoneLocal,
      city: values.city,
      address: values.address,
    }));
  }, []);

  const canCompleteReview = NEW_ORDER_CHECKLIST_IDS.every(
    (id) => checklist[id]
  );

  const showReviewActions = order.status === "new" && !isEditing;

  const value = useMemo(
    () => ({
      order,
      updateEmployer,
      isEditing,
      setIsEditing,
      activeTab,
      setActiveTab,
      checklist,
      toggleChecklistItem,
      canCompleteReview,
      showReviewActions,
    }),
    [
      order,
      updateEmployer,
      isEditing,
      activeTab,
      checklist,
      toggleChecklistItem,
      canCompleteReview,
      showReviewActions,
    ]
  );

  return (
    <NewOrderReviewContext.Provider value={value}>
      {children}
    </NewOrderReviewContext.Provider>
  );
}

export function useNewOrderReview() {
  const context = useContext(NewOrderReviewContext);
  if (!context) {
    throw new Error(
      "useNewOrderReview must be used within a NewOrderReviewProvider."
    );
  }
  return context;
}
