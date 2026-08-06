export type LocalizedText = {
  ar: string;
  en: string;
};

export type SettingsApiItem = {
  id: number;
  description: LocalizedText;
  phone: string;
  email: string;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  linkedin: string | null;
  youtube: string | null;
  tiktok: string | null;
  snapchat: string | null;
  whatsapp: string | null;
  logo: string | null;
  commercial_register?: string | null;
  commercialRegister?: string | null;
  tax_number?: string | null;
  taxNumber?: string | null;
  tax_amount?: number | string | null;
  taxAmount?: number | string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type SettingsShowResponse = {
  success: boolean;
  message: string;
  data: SettingsApiItem | null;
};

export type SettingsMutationResponse = {
  success: boolean;
  message: string;
  data: SettingsApiItem;
};

export type SettingsFormValues = {
  descriptionAr: string;
  descriptionEn: string;
  phone: string;
  email: string;
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  tiktok: string;
  snapchat: string;
  whatsapp: string;
  commercialRegister: string;
  taxNumber: string;
  taxAmount: string;
};
