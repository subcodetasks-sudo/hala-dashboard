import type { SettingsFormValues } from "@/features/settings/types";

/** Builds multipart body for `/admin/settings` upsert. */
export function buildSettingsFormData(
  values: SettingsFormValues,
  logo?: File,
): FormData {
  const formData = new FormData();

  formData.append("description[ar]", values.descriptionAr.trim());
  formData.append("description[en]", values.descriptionEn.trim());
  formData.append("phone", values.phone.trim());
  formData.append("email", values.email.trim());
  formData.append("facebook", values.facebook.trim());
  formData.append("twitter", values.twitter.trim());
  formData.append("instagram", values.instagram.trim());
  formData.append("linkedin", values.linkedin.trim());
  formData.append("youtube", values.youtube.trim());
  formData.append("tiktok", values.tiktok.trim());
  formData.append("snapchat", values.snapchat.trim());
  formData.append("whatsapp", values.whatsapp.trim());
  formData.append("commercial_register", values.commercialRegister.trim());
  formData.append("tax_number", values.taxNumber.trim());
  formData.append("tax_amount", values.taxAmount.trim() || "0");

  if (logo && logo.size > 0) {
    formData.append("logo", logo, logo.name);
  }

  return formData;
}
