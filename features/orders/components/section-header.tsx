import CustomIcon from "@/components/custom-svg";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type ReviewFormSectionHeaderProps = {
  title: string;
  iconSrc: string;
  isEditing?: boolean;
  /** When false, hide edit/save/cancel controls (read-only form). Default true. */
  canEdit?: boolean;
  editLabel?: string;
  saveLabel?: string;
  cancelLabel?: string;
  isSaving?: boolean;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
};

export default function ReviewFormSectionHeader({
  title,
  iconSrc,
  isEditing = false,
  canEdit = true,
  editLabel,
  saveLabel,
  cancelLabel,
  isSaving = false,
  onEdit,
  onSave,
  onCancel,
}: ReviewFormSectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h3 className="flex items-center gap-2 text-base font-bold text-brand-black">
        <span className="inline-flex rounded-xl bg-brand-primary/10 p-3 text-brand-primary">
          <CustomIcon src={iconSrc} size={20} />
        </span>
        <span>{title}</span>
      </h3>

      {canEdit && onEdit && onSave && onCancel ? (
        isEditing ? (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={isSaving}
              className="h-10 rounded-full bg-brand-background px-4 font-semibold text-brand-black hover:bg-brand-background/80"
            >
              {cancelLabel}
            </Button>
            <Button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              aria-busy={isSaving}
              className="h-10 gap-2 rounded-full border-none bg-brand-primary px-4 font-semibold text-brand-white hover:bg-brand-primary/90"
            >
              {isSaving ? (
                <Spinner className="size-4 text-brand-white" />
              ) : null}
              {saveLabel}
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            onClick={onEdit}
            disabled={isSaving}
            aria-busy={isSaving}
            className="h-10 gap-2 rounded-full border-none bg-brand-primary px-4 font-semibold text-brand-white hover:bg-brand-primary/90"
          >
            {isSaving ? (
              <Spinner className="size-4 text-brand-white" />
            ) : (
              <CustomIcon
                src="/svg/brush.svg"
                size={16}
                className="text-brand-white"
              />
            )}
            {editLabel}
          </Button>
        )
      ) : null}
    </div>
  );
}
