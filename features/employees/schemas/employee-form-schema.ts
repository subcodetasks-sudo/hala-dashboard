import { z } from "zod";

import { toSaudiPhoneLocal } from "@/features/orders/mock-data";

export type EmployeeFormMessages = {
  nationalIdRequired: string;
  nationalIdFormat: string;
  nameRequired: string;
  phoneRequired: string;
  phoneFormat: string;
  emailRequired: string;
  emailInvalid: string;
  roleRequired: string;
  passwordRequired: string;
  passwordMin: string;
  passwordUppercase: string;
  passwordLowercase: string;
  passwordSymbol: string;
  confirmPasswordRequired: string;
  passwordsMismatch: string;
};

export type EmployeeFormValues = {
  /**
   * Backend `national_id` / `id_number` (رقم الهوية الوطنية).
   * Sent as both fields on create/update — the form only exposes one ID input.
   */
  nationalId: string;
  name: string;
  phone: string;
  email: string;
  /** Backend role `name` from `/api/roles`, e.g. `review-officer`. */
  role: string;
  password: string;
  confirmPassword: string;
};

type CreateEmployeeFormSchemaOptions = {
  messages: EmployeeFormMessages;
  /** When true, blank password is allowed (edit flow — omit from API body). */
  passwordOptional?: boolean;
};

/**
 * 10-digit National / Employee ID (`/^\d{10}$/`).
 */
const SAUDI_ID_REGEX = /^\d{10}$/;

const PASSWORD_HAS_UPPERCASE = /[A-Z]/;
const PASSWORD_HAS_LOWERCASE = /[a-z]/;
const PASSWORD_HAS_SYMBOL = /[^A-Za-z0-9]/;

type PasswordRuleMessages = Pick<
  EmployeeFormMessages,
  | "passwordMin"
  | "passwordUppercase"
  | "passwordLowercase"
  | "passwordSymbol"
>;

/** Apply backend password rules; reports the first failing rule only. */
function addPasswordStrengthIssues(
  value: string,
  ctx: z.RefinementCtx,
  messages: PasswordRuleMessages,
): void {
  if (value.length < 8) {
    ctx.addIssue({ code: "custom", message: messages.passwordMin });
    return;
  }

  if (!PASSWORD_HAS_UPPERCASE.test(value)) {
    ctx.addIssue({ code: "custom", message: messages.passwordUppercase });
    return;
  }

  if (!PASSWORD_HAS_LOWERCASE.test(value)) {
    ctx.addIssue({ code: "custom", message: messages.passwordLowercase });
    return;
  }

  if (!PASSWORD_HAS_SYMBOL.test(value)) {
    ctx.addIssue({ code: "custom", message: messages.passwordSymbol });
  }
}

function saudiIdField(requiredMessage: string, formatMessage: string) {
  return z
    .string()
    .trim()
    .min(1, requiredMessage)
    .regex(SAUDI_ID_REGEX, formatMessage);
}

/** Normalize to API-style Saudi mobile: `05` + 8 digits. */
export function toSaudiMobileApi(phone: string): string {
  return `0${toSaudiPhoneLocal(phone)}`;
}

export function createEmployeeFormSchema({
  messages,
  passwordOptional = false,
}: CreateEmployeeFormSchemaOptions) {
  const passwordField = passwordOptional
    ? z.string().superRefine((value, ctx) => {
        if (value.length === 0) return;
        addPasswordStrengthIssues(value, ctx, messages);
      })
    : z
        .string()
        .min(1, messages.passwordRequired)
        .superRefine((value, ctx) => {
          addPasswordStrengthIssues(value, ctx, messages);
        });

  const confirmPasswordField = passwordOptional
    ? z.string()
    : z.string().min(1, messages.confirmPasswordRequired);

  return z
    .object({
      nationalId: saudiIdField(
        messages.nationalIdRequired,
        messages.nationalIdFormat,
      ),
      name: z.string().trim().min(1, messages.nameRequired),
      phone: z
        .string()
        .trim()
        .min(1, messages.phoneRequired)
        .refine(
          (value) => /^5\d{8}$/.test(toSaudiPhoneLocal(value)),
          messages.phoneFormat,
        ),
      email: z
        .string()
        .trim()
        .min(1, messages.emailRequired)
        .email(messages.emailInvalid),
      role: z.string().trim().min(1, messages.roleRequired),
      password: passwordField,
      confirmPassword: confirmPasswordField,
    })
    .superRefine((values, ctx) => {
      const trimmedPass = values.password ? values.password.trim() : "";
      const trimmedConfirm = values.confirmPassword
        ? values.confirmPassword.trim()
        : "";

      if (passwordOptional) {
        const hasPassword = trimmedPass.length > 0;
        const hasConfirm = trimmedConfirm.length > 0;

        if (hasPassword && !hasConfirm) {
          ctx.addIssue({
            code: "custom",
            message: messages.confirmPasswordRequired,
            path: ["confirmPassword"],
          });
          return;
        }

        if (hasPassword && trimmedPass !== trimmedConfirm) {
          ctx.addIssue({
            code: "custom",
            message: messages.passwordsMismatch,
            path: ["confirmPassword"],
          });
          return;
        }

        if (!hasPassword && hasConfirm) {
          ctx.addIssue({
            code: "custom",
            message: messages.passwordRequired,
            path: ["password"],
          });
          return;
        }

        return;
      }

      if (trimmedPass !== trimmedConfirm) {
        ctx.addIssue({
          code: "custom",
          message: messages.passwordsMismatch,
          path: ["confirmPassword"],
        });
      }
    });
}
