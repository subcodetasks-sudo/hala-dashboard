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
