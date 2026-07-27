"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { OrderReviewDetail } from "@/features/orders/types";
import type { EmployerFormValues } from "@/features/orders/schemas/employer-schema";
import type { WorkerFormValues } from "@/features/orders/schemas/worker-schema";

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
  updateWorker: (values: WorkerFormValues) => void;
  editingTab: ReviewTabId | null;
  isEditing: boolean;
  startEditing: (tab: ReviewTabId) => void;
  stopEditing: () => void;
  activeTab: ReviewTabId;
  setActiveTab: (tab: ReviewTabId) => void;
  checklist: ChecklistState;
  toggleChecklistItem: (id: NewOrderChecklistId) => void;
  /** True when every checklist item is checked. */
  canCompleteReview: boolean;
  /** Show review actions for new orders when not editing. */
  showReviewActions: boolean;
  isApproveProcessOpen: boolean;
  openApproveProcess: () => void;
  closeApproveProcess: () => void;
  setApproveProcessOpen: (open: boolean) => void;
  isPendOrderOpen: boolean;
  openPendOrder: () => void;
  closePendOrder: () => void;
  setPendOrderOpen: (open: boolean) => void;
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
  const [editingTab, setEditingTab] = useState<ReviewTabId | null>(null);
  const [activeTab, setActiveTab] = useState<ReviewTabId>("employer");
  const [checklist, setChecklist] = useState<ChecklistState>(INITIAL_CHECKLIST);
  const [isApproveProcessOpen, setIsApproveProcessOpen] = useState(false);
  const [isPendOrderOpen, setIsPendOrderOpen] = useState(false);

  const toggleChecklistItem = useCallback((id: NewOrderChecklistId) => {
    setChecklist((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const openApproveProcess = useCallback(() => {
    setIsApproveProcessOpen(true);
  }, []);

  const closeApproveProcess = useCallback(() => {
    setIsApproveProcessOpen(false);
  }, []);

  const setApproveProcessOpen = useCallback((open: boolean) => {
    setIsApproveProcessOpen(open);
  }, []);

  const openPendOrder = useCallback(() => {
    setIsPendOrderOpen(true);
  }, []);

  const closePendOrder = useCallback(() => {
    setIsPendOrderOpen(false);
  }, []);

  const setPendOrderOpen = useCallback((open: boolean) => {
    setIsPendOrderOpen(open);
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

  const updateWorker = useCallback((values: WorkerFormValues) => {
    setOrder((prev) => ({
      ...prev,
      workerName: values.workerName,
      workerPhoneLocal: values.workerPhoneLocal,
      workerBirthDate: values.birthDate,
      workerHomeAddress: values.homeAddress,
      workerPassportIssuePlace: values.passportIssuePlace,
      workerPassportNumber: values.passportNumber,
      workerPassportIssueDate: values.passportIssueDate,
      workerPassportExpiryDate: values.passportExpiryDate,
    }));
  }, []);

  const startEditing = useCallback((tab: ReviewTabId) => {
    setEditingTab(tab);
  }, []);

  const stopEditing = useCallback(() => {
    setEditingTab(null);
  }, []);

  const isEditing = editingTab !== null;

  const canCompleteReview = NEW_ORDER_CHECKLIST_IDS.every(
    (id) => checklist[id]
  );

  const showReviewActions = order.status === "new" && !isEditing;

  const value = useMemo(
    () => ({
      order,
      updateEmployer,
      updateWorker,
      editingTab,
      isEditing,
      startEditing,
      stopEditing,
      activeTab,
      setActiveTab,
      checklist,
      toggleChecklistItem,
      canCompleteReview,
      showReviewActions,
      isApproveProcessOpen,
      openApproveProcess,
      closeApproveProcess,
      setApproveProcessOpen,
      isPendOrderOpen,
      openPendOrder,
      closePendOrder,
      setPendOrderOpen,
    }),
    [
      order,
      updateEmployer,
      updateWorker,
      editingTab,
      isEditing,
      startEditing,
      stopEditing,
      activeTab,
      checklist,
      toggleChecklistItem,
      canCompleteReview,
      showReviewActions,
      isApproveProcessOpen,
      openApproveProcess,
      closeApproveProcess,
      setApproveProcessOpen,
      isPendOrderOpen,
      openPendOrder,
      closePendOrder,
      setPendOrderOpen,
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
