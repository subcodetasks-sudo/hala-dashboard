"use client";

import type { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  ListTodo,
  Minus,
  Pilcrow,
  Quote,
  Redo2,
  RemoveFormatting,
  Strikethrough,
  Subscript,
  Superscript,
  Table,
  Underline,
  Undo2,
  Video,
} from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type ToolbarButtonProps = {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
};

function ToolbarButton({
  label,
  active = false,
  disabled = false,
  onClick,
  children,
}: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={disabled}
          aria-label={label}
          aria-pressed={active}
          onClick={onClick}
          className={cn(
            "size-8 shrink-0 rounded-full border-none bg-[#F0F0F0] p-0 text-brand-black hover:bg-[#E6E6E6] hover:text-brand-black",
            active &&
              "bg-brand-primary/15 text-brand-primary hover:bg-brand-primary/20 hover:text-brand-primary",
          )}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={6}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

type RichTextToolbarProps = {
  editor: Editor;
  disabled?: boolean;
};

export default function RichTextToolbar({
  editor,
  disabled = false,
}: RichTextToolbarProps) {
  const t = useTranslations("Common.RichTextEditor");
  const isDisabled = disabled || !editor.isEditable;

  const setLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt(t("prompts.link"), previous ?? "https://");
    if (url === null) return;
    const trimmed = url.trim();
    if (!trimmed) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: trimmed })
      .run();
  };

  const addImage = () => {
    const url = window.prompt(t("prompts.image"), "https://");
    if (!url?.trim()) return;
    editor.chain().focus().setImage({ src: url.trim() }).run();
  };

  const addYoutube = () => {
    const url = window.prompt(t("prompts.youtube"), "https://");
    if (!url?.trim()) return;
    editor.commands.setYoutubeVideo({ src: url.trim() });
  };

  const insertTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-wrap items-center gap-1.5 border-b border-black/10 bg-[#F7F7F7] px-3 py-2">
        <ToolbarButton
          label={t("undo")}
          disabled={isDisabled || !editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 className="size-4" strokeWidth={1.75} />
        </ToolbarButton>
        <ToolbarButton
          label={t("redo")}
          disabled={isDisabled || !editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 className="size-4" strokeWidth={1.75} />
        </ToolbarButton>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <ToolbarButton
          label={t("paragraph")}
          active={editor.isActive("paragraph")}
          disabled={isDisabled}
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          <Pilcrow className="size-4" strokeWidth={1.75} />
        </ToolbarButton>
        <ToolbarButton
          label={t("heading1")}
          active={editor.isActive("heading", { level: 1 })}
          disabled={isDisabled}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <Heading1 className="size-4" strokeWidth={1.75} />
        </ToolbarButton>
        <ToolbarButton
          label={t("heading2")}
          active={editor.isActive("heading", { level: 2 })}
          disabled={isDisabled}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 className="size-4" strokeWidth={1.75} />
        </ToolbarButton>
        <ToolbarButton
          label={t("heading3")}
          active={editor.isActive("heading", { level: 3 })}
          disabled={isDisabled}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <Heading3 className="size-4" strokeWidth={1.75} />
        </ToolbarButton>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <ToolbarButton
          label={t("bold")}
          active={editor.isActive("bold")}
          disabled={isDisabled}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="size-4" strokeWidth={1.75} />
        </ToolbarButton>
        <ToolbarButton
          label={t("italic")}
          active={editor.isActive("italic")}
          disabled={isDisabled}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="size-4" strokeWidth={1.75} />
        </ToolbarButton>
        <ToolbarButton
          label={t("underline")}
          active={editor.isActive("underline")}
          disabled={isDisabled}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <Underline className="size-4" strokeWidth={1.75} />
        </ToolbarButton>
        <ToolbarButton
          label={t("strike")}
          active={editor.isActive("strike")}
          disabled={isDisabled}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="size-4" strokeWidth={1.75} />
        </ToolbarButton>
        <ToolbarButton
          label={t("code")}
          active={editor.isActive("code")}
          disabled={isDisabled}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <Code className="size-4" strokeWidth={1.75} />
        </ToolbarButton>
        <ToolbarButton
          label={t("highlight")}
          active={editor.isActive("highlight")}
          disabled={isDisabled}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
        >
          <Highlighter className="size-4" strokeWidth={1.75} />
        </ToolbarButton>
        <ToolbarButton
          label={t("subscript")}
          active={editor.isActive("subscript")}
          disabled={isDisabled}
          onClick={() => editor.chain().focus().toggleSubscript().run()}
        >
          <Subscript className="size-4" strokeWidth={1.75} />
        </ToolbarButton>
        <ToolbarButton
          label={t("superscript")}
          active={editor.isActive("superscript")}
          disabled={isDisabled}
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
        >
          <Superscript className="size-4" strokeWidth={1.75} />
        </ToolbarButton>

        <label
          className={cn(
            "inline-flex size-8 cursor-pointer items-center justify-center rounded-full bg-[#F0F0F0] text-brand-black hover:bg-[#E6E6E6]",
            isDisabled && "pointer-events-none opacity-50",
          )}
          title={t("textColor")}
        >
          <span className="sr-only">{t("textColor")}</span>
          <input
            type="color"
            disabled={isDisabled}
            className="size-4 cursor-pointer appearance-none border-0 bg-transparent p-0"
            onInput={(event) => {
              editor
                .chain()
                .focus()
                .setColor((event.target as HTMLInputElement).value)
                .run();
            }}
          />
        </label>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <ToolbarButton
          label={t("alignLeft")}
          active={editor.isActive({ textAlign: "left" })}
          disabled={isDisabled}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft className="size-4" strokeWidth={1.75} />
        </ToolbarButton>
        <ToolbarButton
          label={t("alignCenter")}
          active={editor.isActive({ textAlign: "center" })}
          disabled={isDisabled}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter className="size-4" strokeWidth={1.75} />
        </ToolbarButton>
        <ToolbarButton
          label={t("alignRight")}
          active={editor.isActive({ textAlign: "right" })}
          disabled={isDisabled}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight className="size-4" strokeWidth={1.75} />
        </ToolbarButton>
        <ToolbarButton
          label={t("alignJustify")}
          active={editor.isActive({ textAlign: "justify" })}
          disabled={isDisabled}
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        >
          <AlignJustify className="size-4" strokeWidth={1.75} />
        </ToolbarButton>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <ToolbarButton
          label={t("bulletList")}
          active={editor.isActive("bulletList")}
          disabled={isDisabled}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="size-4" strokeWidth={1.75} />
        </ToolbarButton>
        <ToolbarButton
          label={t("orderedList")}
          active={editor.isActive("orderedList")}
          disabled={isDisabled}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="size-4" strokeWidth={1.75} />
        </ToolbarButton>
        <ToolbarButton
          label={t("taskList")}
          active={editor.isActive("taskList")}
          disabled={isDisabled}
          onClick={() => editor.chain().focus().toggleTaskList().run()}
        >
          <ListTodo className="size-4" strokeWidth={1.75} />
        </ToolbarButton>
        <ToolbarButton
          label={t("blockquote")}
          active={editor.isActive("blockquote")}
          disabled={isDisabled}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="size-4" strokeWidth={1.75} />
        </ToolbarButton>
        <ToolbarButton
          label={t("codeBlock")}
          active={editor.isActive("codeBlock")}
          disabled={isDisabled}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <Code className="size-4" strokeWidth={1.75} />
        </ToolbarButton>
        <ToolbarButton
          label={t("horizontalRule")}
          disabled={isDisabled}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus className="size-4" strokeWidth={1.75} />
        </ToolbarButton>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <ToolbarButton
          label={t("link")}
          active={editor.isActive("link")}
          disabled={isDisabled}
          onClick={setLink}
        >
          <Link2 className="size-4" strokeWidth={1.75} />
        </ToolbarButton>
        <ToolbarButton
          label={t("image")}
          disabled={isDisabled}
          onClick={addImage}
        >
          <ImagePlus className="size-4" strokeWidth={1.75} />
        </ToolbarButton>
        <ToolbarButton
          label={t("youtube")}
          disabled={isDisabled}
          onClick={addYoutube}
        >
          <Video className="size-4" strokeWidth={1.75} />
        </ToolbarButton>
        <ToolbarButton
          label={t("table")}
          disabled={isDisabled}
          onClick={insertTable}
        >
          <Table className="size-4" strokeWidth={1.75} />
        </ToolbarButton>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <ToolbarButton
          label={t("clearFormat")}
          disabled={isDisabled}
          onClick={() =>
            editor.chain().focus().unsetAllMarks().clearNodes().run()
          }
        >
          <RemoveFormatting className="size-4" strokeWidth={1.75} />
        </ToolbarButton>
      </div>
    </TooltipProvider>
  );
}
