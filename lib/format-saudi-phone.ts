/**
 * Formats a Saudi phone number for display with a leading `0`
 * instead of the `+966` / `966` country code.
 *
 * @example
 * toSaudiPhoneWithLeadingZero("+966 514 111 001") // "0514111001"
 * toSaudiPhoneWithLeadingZero("966514111001")     // "0514111001"
 * toSaudiPhoneWithLeadingZero("0514111001")       // "0514111001"
 * toSaudiPhoneWithLeadingZero("514111001")        // "0514111001"
 */
export function toSaudiPhoneWithLeadingZero(
  phone: string | null | undefined,
): string {
  if (phone == null) {
    return "";
  }

  const trimmed = phone.trim();
  if (!trimmed) {
    return "";
  }

  const digits = trimmed.replace(/\D/g, "");
  if (!digits) {
    return trimmed;
  }

  let localDigits = digits;

  if (digits.startsWith("966") && digits.length > 3) {
    localDigits = digits.slice(3);
  }

  if (localDigits.startsWith("0")) {
    return localDigits;
  }

  return `0${localDigits}`;
}

/**
 * Formats a Saudi phone number for API submission (`+966` + 9 local digits).
 *
 * @example
 * toSaudiPhoneInternational("0514111001") // "+966514111001"
 */
export function toSaudiPhoneInternational(
  phone: string | null | undefined,
): string {
  const withLeadingZero = toSaudiPhoneWithLeadingZero(phone);
  const digits = withLeadingZero.replace(/\D/g, "");

  if (digits.startsWith("0") && digits.length >= 10) {
    return `+966${digits.slice(1, 10)}`;
  }

  if (digits.length >= 9) {
    return `+966${digits.slice(-9)}`;
  }

  return withLeadingZero ? `+966${digits}` : "";
}
