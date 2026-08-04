"use client";

import { ChevronsLeft, ChevronsRight, Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";

import CustomIcon from "@/components/custom-svg";
import SelectField from "@/components/select-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type EntryMode = "single" | "bulk";

export default function AddTrackingModal() {
  const t = useTranslations("Tracking.modal");
  const tButton = useTranslations("Tracking");
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<EntryMode>("bulk");
  const [company, setCompany] = useState("aramex");
  const [singleTrackingNumber, setSingleTrackingNumber] = useState("");
  const [numbersText, setNumbersText] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const shippingCompanyOptions = [
    { value: "aramex", label: "أرامكس (Aramex)" },
    { value: "smsa", label: "سمسا (SMSA)" },
    { value: "spl", label: "سبل (SPL)" },
    { value: "dhl", label: "DHL" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
    setSingleTrackingNumber("");
    setNumbersText("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Stub file handling for demonstration
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-11 shrink-0 gap-2 rounded-xl border-black/10 bg-brand-gris px-5 font-semibold text-brand-white hover:bg-brand-gris/80 hover:text-brand-white">
          <Plus className="size-4" strokeWidth={2} />
          <span>{tButton("addNumbers")}</span>
        </Button>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/50 supports-backdrop-filter:backdrop-blur-sm"
        className="max-h-[85vh] overflow-y-auto no-scrollbar gap-0 rounded-xl border-none bg-white p-6 ring-0 sm:max-w-md md:max-w-lg"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-3 border-b border-black/10 pb-4">
          <DialogTitle className="text-base font-bold text-brand-black">
            {t("title")}
          </DialogTitle>
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              aria-label="Close"
              className="size-9 shrink-0 rounded-xl bg-brand-background p-0 text-brand-gris hover:bg-brand-background/80 hover:text-brand-black"
            >
              <X className="size-4" strokeWidth={2} />
            </Button>
          </DialogClose>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* Main Body Section */}
          <div className="flex flex-col gap-10 py-10">
            {/* Center Hero Icon & Heading */}
            <div className="flex flex-col items-center gap-5 text-center">
              <div className="flex size-16 items-center justify-center rounded-3xl bg-brand-primary/10">
                <CustomIcon
                  src="/svg/box-add.svg"
                  size={28}
                  className="text-brand-primary"
                />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-brand-black">
                  {t("heading")}
                </h3>
              </div>
            </div>

            {/* Mode Selector Tabs */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMode("single")}
                className={cn(
                  "h-12 rounded-2xl flex items-center justify-center gap-2.5 text-sm font-bold transition-all",
                  mode === "single"
                    ? "bg-brand-primary text-white shadow-sm"
                    : "bg-brand-primary/10 text-brand-gris hover:bg-brand-primary/15",
                )}
              >
                <CustomIcon
                  src="/svg/folder-add.svg"
                  size={18}
                  className={
                    mode === "single" ? "text-white" : "text-brand-gris"
                  }
                />
                <span>{t("modeSingle")}</span>
              </button>

              <button
                type="button"
                onClick={() => setMode("bulk")}
                className={cn(
                  "h-12 rounded-2xl flex items-center justify-center gap-2.5 text-sm font-bold transition-all",
                  mode === "bulk"
                    ? "bg-brand-primary text-white shadow-sm"
                    : "bg-brand-primary/10 text-brand-gris hover:bg-brand-primary/15",
                )}
              >
                <CustomIcon
                  src="/svg/folder-open.svg"
                  size={18}
                  className={mode === "bulk" ? "text-white" : "text-brand-gris"}
                />
                <span>{t("modeBulk")}</span>
              </button>
            </div>

            {/* Shipping Company Select */}
            <div className="space-y-1.5 text-start">
              <label className="block text-xs font-semibold text-brand-black px-1">
                {t("companyLabel")} <span className="text-brand-accent">*</span>
              </label>
              <SelectField
                id="modal-shipping-company"
                label=""
                iconSrc="/svg/truck.svg"
                value={company}
                placeholder={t("companyPlaceholder")}
                options={shippingCompanyOptions}
                onChange={setCompany}
                readOnly={false}
                variant="form"
                triggerClassName="h-11! rounded-full! border-black/10! bg-white!"
              />
            </div>

            {/* Mode-Specific Content */}
            {mode === "single" ? (
              /* Single Entry Mode */
              <div className="space-y-1.5 text-start">
                <label className="block text-xs font-semibold text-brand-black px-1">
                  {t("trackingNumberLabel")}{" "}
                  <span className="text-brand-accent">*</span>
                </label>
                <div className="relative flex items-center">
                  <CustomIcon
                    src="/svg/tag-2.svg"
                    size={18}
                    className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-brand-gris"
                  />
                  <Input
                    value={singleTrackingNumber}
                    onChange={(e) => setSingleTrackingNumber(e.target.value)}
                    placeholder={t("trackingNumberPlaceholder")}
                    className="h-11 rounded-full border-black/10 bg-white ps-10 pe-4 text-start text-sm font-semibold text-brand-black focus-visible:ring-brand-primary"
                  />
                </div>
              </div>
            ) : (
              /* Bulk Entry Mode */
              <div className="flex flex-col gap-6">
                {/* Drag & Drop File Box */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand-primary/30 bg-brand-primary/5 p-6 text-center transition-colors hover:border-brand-primary/50 cursor-pointer"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <div className="size-12 rounded-full bg-white shadow-sm flex items-center justify-center text-brand-primary mb-2">
                    <CustomIcon
                      src="/svg/download-cloud.svg"
                      size={22}
                      className="text-brand-black"
                    />
                  </div>
                  <p className="text-sm font-bold text-brand-primary">
                    {t("uploadTitle")}
                  </p>
                  <p className="text-xs text-brand-gris mt-1">
                    {t("uploadSubtitle")}
                  </p>
                  <p className="text-[11px] text-brand-gris/80 mt-1.5">
                    {t("uploadNote")}
                  </p>
                  <p className="text-[10px] text-brand-gris/60 mt-0.5">
                    {t("uploadLimit")}
                  </p>
                </div>

                {/* Divider */}
                <div className="relative flex items-center justify-center my-1">
                  <div className="w-full border-t border-black/10" />
                  <span className="absolute bg-white px-3 text-xs font-bold text-brand-black">
                    {t("orManual")}
                  </span>
                </div>

                {/* Textarea for Manual List */}
                <div className="space-y-1.5 text-start">
                  <label className="block text-xs font-semibold text-brand-black px-1">
                    {t("numbersListLabel")}
                  </label>
                  <Textarea
                    value={numbersText}
                    onChange={(e) => setNumbersText(e.target.value)}
                    placeholder={`${t("numbersListPlaceholder")}\n\n410001\n523000\n523333\n125559`}
                    rows={4}
                    className="rounded-2xl border-black/10 p-4 text-start font-mono text-sm leading-relaxed focus:border-brand-primary"
                  />
                  <p className="text-xs text-brand-gris text-center mt-6">
                    {t("numbersListHint")}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Action Buttons */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="h-12 flex-1 gap-2 rounded-2xl bg-brand-background font-semibold text-brand-black hover:bg-brand-background/80"
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              className="group relative h-12 flex-[1.4] items-center justify-center gap-2 overflow-hidden rounded-2xl border-none bg-brand-dark-blue px-5 font-semibold text-brand-white shadow-sm transition-all duration-300 hover:bg-brand-dark-blue/90 active:scale-[0.98]"
            >
              <span
                className="confirm-chevron-start inline-flex items-center"
                aria-hidden
              >
                <ChevronsLeft
                  className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5 ltr:rotate-180"
                  strokeWidth={2.25}
                />
              </span>
              <span>
                {mode === "single" ? t("submitSingle") : t("submitBulk")}
              </span>
              <span
                className="confirm-chevron-end inline-flex items-center"
                aria-hidden
              >
                <ChevronsRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 ltr:rotate-180"
                  strokeWidth={2.25}
                />
              </span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
