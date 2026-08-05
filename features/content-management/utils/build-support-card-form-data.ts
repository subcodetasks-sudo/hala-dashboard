import type {
  SupportCardFormValues,
  SupportCardNumber,
} from "@/features/content-management/types";

/** Builds multipart body for `/admin/legal/support/cards` upsert. */
export function buildSupportCardFormData(
  cardNumber: SupportCardNumber,
  values: SupportCardFormValues,
  image?: File,
): FormData {
  const formData = new FormData();
  formData.append("card_number", String(cardNumber));
  formData.append("title[ar]", values.titleAr.trim());
  formData.append("title[en]", values.titleEn.trim());
  formData.append("description[ar]", values.descriptionAr.trim());
  formData.append("description[en]", values.descriptionEn.trim());
  formData.append("button_type", values.buttonType);
  formData.append("button_value", values.buttonValue.trim());
  formData.append("button_label[ar]", values.buttonLabelAr.trim());
  formData.append("button_label[en]", values.buttonLabelEn.trim());
  formData.append("status", "active");

  if (image && image.size > 0) {
    formData.append("image", image, image.name);
  }

  return formData;
}
