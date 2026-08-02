import CustomIcon from "@/components/custom-svg";
import { Button } from "@/components/ui/button";

type ReviewFormSectionHeaderProps = {
  title: string;
  iconSrc: string;
  isEditing: boolean;
  /** When false, hide edit/save/cancel controls (read-only form). Default true. */
  canEdit?: boolean;
  editLabel: string;
  saveLabel: string;
  cancelLabel: string;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
};

export default function ReviewFormSectionHeader({
  title,
  iconSrc,
  isEditing,
  canEdit = true,
  editLabel,
  saveLabel,
  cancelLabel,
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

      {canEdit ? (
        isEditing ? (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              className="h-10 rounded-xl bg-brand-background px-4 font-semibold text-brand-black hover:bg-brand-background/80"
            >
              {cancelLabel}
            </Button>
            <Button
              type="button"
              onClick={onSave}
              className="h-10 gap-2 rounded-xl border-none bg-brand-primary px-4 font-semibold text-brand-white hover:bg-brand-primary/90"
            >
              {saveLabel}
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            onClick={onEdit}
            className="h-10 gap-2 rounded-xl border-none bg-brand-primary px-4 font-semibold text-brand-white hover:bg-brand-primary/90"
          >
            <CustomIcon
              src="/svg/brush.svg"
              size={16}
              className="text-brand-white"
            />
            {editLabel}
          </Button>
        )
      ) : null}
    </div>
  );
}
