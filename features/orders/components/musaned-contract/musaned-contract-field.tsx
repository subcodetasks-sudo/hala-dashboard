import { cn } from "@/lib/utils";

type MusanedContractFieldProps = {
  value: string | null | undefined;
  className?: string;
  /** Minimum visual width of blank underline when empty */
  blankClassName?: string;
  dir?: "ltr" | "rtl" | "auto";
};

/** Filled value or underlined blank for hand-fill later. */
export function MusanedContractField({
  value,
  className,
  blankClassName,
  dir = "auto",
}: MusanedContractFieldProps) {
  const filled = value?.trim();

  if (filled) {
    return (
      <span
        dir={dir}
        className={cn(
          "inline border-b border-black/80 px-1 font-medium text-black",
          className,
        )}
      >
        {filled}
      </span>
    );
  }

  return (
    <span
      aria-hidden
      className={cn(
        "inline-block min-w-[8rem] border-b border-black/70 align-baseline",
        blankClassName,
        className,
      )}
    >
      &nbsp;
    </span>
  );
}

type MusanedSignatureSlotProps = {
  imageUrl: string | null | undefined;
  printedName: string | null | undefined;
  labelEn: string;
  labelAr: string;
};

export function MusanedSignatureSlot({
  imageUrl,
  printedName,
  labelEn,
  labelAr,
}: MusanedSignatureSlotProps) {
  const name = printedName?.trim() || null;

  return (
    <div className="flex flex-col gap-1 break-inside-avoid">
      <p className="text-[9pt] text-black/70">(Signature over printed name)</p>
      <p className="text-[9pt] text-black/70" dir="rtl">
        (التوقيع فوق الاسم المطبوع)
      </p>
      <div className="flex h-16 w-44 items-end justify-center border-b border-black/80 bg-transparent">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- print/iframe-safe remote signature
          <img
            src={imageUrl}
            alt=""
            className="max-h-14 max-w-[10rem] object-contain"
          />
        ) : null}
      </div>
      <p className="min-h-[1.25rem] text-[10pt] font-semibold text-black">
        {name ?? (
          <span className="inline-block w-40 border-b border-black/40">&nbsp;</span>
        )}
      </p>
      <p className="text-[10pt] font-bold text-black">{labelEn}</p>
      <p className="text-[10pt] font-bold text-black" dir="rtl">
        {labelAr}
      </p>
      <p className="mt-2 text-[9pt] text-black">
        Date signed / تاريخ التوقيع:{" "}
        <span className="inline-block min-w-[6rem] border-b border-black/70">
          &nbsp;
        </span>
      </p>
    </div>
  );
}
