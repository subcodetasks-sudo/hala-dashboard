import type { OrderReviewDetail } from "@/features/orders/types";

export type MusanedContractData = {
  employerNameEn: string | null;
  employerNameAr: string | null;
  nationalId: string | null;
  employerPhone: string | null;
  employerCity: string | null;
  workerNameEn: string | null;
  workerNameAr: string | null;
  workerPhone: string | null;
  workerPhilippinesAddress: string | null;
  workerPassportNumber: string | null;
  workerPassportIssueDate: string | null;
  workerPassportIssuePlace: string | null;
  siteOfEmployment: string | null;
  monthlySalary: string | null;
  employerSignatureUrl: string | null;
  workerSignatureUrl: string | null;
};

function clean(value: string | null | undefined): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed === "—") return null;
  return trimmed;
}

function formatSalary(salary: number | null | undefined): string | null {
  if (salary == null || !Number.isFinite(salary)) return null;
  return String(salary);
}

/** Maps order review detail → Musaned fillable fields (null = blank underline). */
export function mapOrderToMusanedContract(
  order: OrderReviewDetail,
): MusanedContractData {
  const employerSig = order.documents.find((d) => d.type === "employerSignature");
  const workerSig = order.documents.find((d) => d.type === "workerSignature");

  const city = clean(order.city);
  const passportPlace = clean(order.workerPassportIssuePlace);
  const issueDate = clean(order.workerPassportIssueDate);

  return {
    employerNameEn: clean(order.employerNameEn),
    employerNameAr: clean(order.employerNameAr),
    nationalId: clean(order.nationalId),
    employerPhone: clean(order.phoneLocal),
    employerCity: city,
    workerNameEn: clean(order.workerNameEn),
    workerNameAr: clean(order.workerNameAr),
    workerPhone: clean(order.workerPhoneLocal),
    workerPhilippinesAddress: clean(order.workerHomeAddress),
    workerPassportNumber: clean(order.workerPassportNumber),
    workerPassportIssueDate: issueDate,
    workerPassportIssuePlace: passportPlace,
    siteOfEmployment: city,
    monthlySalary: formatSalary(order.salary),
    employerSignatureUrl: clean(employerSig?.url),
    workerSignatureUrl: clean(workerSig?.url),
  };
}

export function formatPassportIssue(
  data: MusanedContractData,
): string | null {
  const date = data.workerPassportIssueDate;
  const place = data.workerPassportIssuePlace;
  if (date && place) return `${date} / ${place}`;
  return date ?? place;
}
