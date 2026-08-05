"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

import { createRichTextExtensions } from "@/components/rich-text-editor/extensions";
import RichTextToolbar from "@/components/rich-text-editor/rich-text-toolbar";
import { cn } from "@/lib/utils";

export type RichTextEditorProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
  minHeightClassName?: string;
  maxCharacters?: number;
  showCharacterCount?: boolean;
};

function normalizeEditorHtml(html: string): string {
  if (!html || html === "<p></p>" || html === "<p><br></p>") {
    return "";
  }
  return html;
}

export default function RichTextEditor({
  id,
  value,
  onChange,
  placeholder,
  disabled = false,
  invalid = false,
  className,
  minHeightClassName = "min-h-80",
  maxCharacters,
  showCharacterCount = true,
}: RichTextEditorProps) {
  const t = useTranslations("Common.RichTextEditor");
  const resolvedPlaceholder = placeholder ?? t("placeholder");
  const placeholderRef = useRef(resolvedPlaceholder);
  placeholderRef.current = resolvedPlaceholder;

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const valueRef = useRef(value);
  valueRef.current = value;

  /** Skip pushing empty/programmatic updates back into the form. */
  const suppressUpdateRef = useRef(true);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: createRichTextExtensions({
      placeholder: () => placeholderRef.current,
      maxCharacters,
    }),
    content: value || "",
    editable: !disabled,
    editorProps: {
      attributes: {
        id: id ?? "",
        class: cn(
          "max-h-112 overflow-y-auto px-4 py-4 text-start text-sm leading-relaxed text-brand-black outline-none",
          minHeightClassName,
        ),
      },
    },
    onCreate: ({ editor: current }) => {
      const initial = valueRef.current || "";
      if (initial && normalizeEditorHtml(current.getHTML()) !== normalizeEditorHtml(initial)) {
        suppressUpdateRef.current = true;
        current.commands.setContent(initial, { emitUpdate: false });
      }
      suppressUpdateRef.current = false;
    },
    onUpdate: ({ editor: current }) => {
      if (suppressUpdateRef.current) return;
      onChangeRef.current(normalizeEditorHtml(current.getHTML()));
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [disabled, editor]);

  useEffect(() => {
    if (!editor || editor.isDestroyed) return;

    const next = value || "";
    const current = normalizeEditorHtml(editor.getHTML());
    const normalizedNext = normalizeEditorHtml(next);

    if (current === normalizedNext) return;

    suppressUpdateRef.current = true;
    editor.commands.setContent(next, { emitUpdate: false });
    suppressUpdateRef.current = false;
  }, [editor, value]);

  useEffect(() => {
    if (!editor) return;
    editor.view.dispatch(editor.state.tr);
  }, [editor, resolvedPlaceholder]);

  const characters = editor?.storage.characterCount?.characters() ?? 0;
  const words = editor?.storage.characterCount?.words() ?? 0;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-black/10 bg-[#FBFBFB]",
        invalid && "border-brand-accent ring-3 ring-brand-accent/20",
        disabled && "opacity-60",
        className,
      )}
    >
      {editor ? <RichTextToolbar editor={editor} disabled={disabled} /> : null}

      <EditorContent
        editor={editor}
        className={cn(
          "rich-text-editor [&_.ProseMirror]:outline-none",
          "[&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none",
          "[&_.ProseMirror_p.is-editor-empty:first-child::before]:float-start",
          "[&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0",
          "[&_.ProseMirror_p.is-editor-empty:first-child::before]:text-brand-gris/60",
          "[&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
          "[&_.ProseMirror_h1]:mb-3 [&_.ProseMirror_h1]:text-2xl [&_.ProseMirror_h1]:font-bold",
          "[&_.ProseMirror_h2]:mb-2.5 [&_.ProseMirror_h2]:text-xl [&_.ProseMirror_h2]:font-bold",
          "[&_.ProseMirror_h3]:mb-2 [&_.ProseMirror_h3]:text-lg [&_.ProseMirror_h3]:font-semibold",
          "[&_.ProseMirror_h4]:mb-2 [&_.ProseMirror_h4]:text-base [&_.ProseMirror_h4]:font-semibold",
          "[&_.ProseMirror_p]:mb-3 [&_.ProseMirror_p]:last:mb-0",
          "[&_.ProseMirror_ul]:mb-3 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:ps-5",
          "[&_.ProseMirror_ol]:mb-3 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:ps-5",
          "[&_.ProseMirror_blockquote]:my-3 [&_.ProseMirror_blockquote]:border-s-4 [&_.ProseMirror_blockquote]:border-brand-primary/40 [&_.ProseMirror_blockquote]:ps-4 [&_.ProseMirror_blockquote]:text-brand-gris",
          "[&_.ProseMirror_pre]:mb-3 [&_.ProseMirror_pre]:overflow-x-auto [&_.ProseMirror_pre]:rounded-xl [&_.ProseMirror_pre]:bg-brand-dark-blue [&_.ProseMirror_pre]:p-4 [&_.ProseMirror_pre]:text-brand-white",
          "[&_.ProseMirror_code]:rounded-md [&_.ProseMirror_code]:bg-brand-background [&_.ProseMirror_code]:px-1.5 [&_.ProseMirror_code]:py-0.5 [&_.ProseMirror_code]:text-[0.9em]",
          "[&_.ProseMirror_pre_code]:bg-transparent [&_.ProseMirror_pre_code]:p-0",
          "[&_.ProseMirror_hr]:my-4 [&_.ProseMirror_hr]:border-black/10",
          "[&_.ProseMirror_img]:my-3 [&_.ProseMirror_img]:max-w-full [&_.ProseMirror_img]:rounded-xl",
          "[&_.ProseMirror_a]:text-brand-primary [&_.ProseMirror_a]:underline [&_.ProseMirror_a]:underline-offset-2",
          "[&_.ProseMirror_mark]:rounded-sm [&_.ProseMirror_mark]:bg-brand-light-yellow [&_.ProseMirror_mark]:px-0.5",
          "[&_.ProseMirror_table]:my-3 [&_.ProseMirror_table]:w-full [&_.ProseMirror_table]:border-collapse",
          "[&_.ProseMirror_td]:border [&_.ProseMirror_td]:border-black/10 [&_.ProseMirror_td]:px-3 [&_.ProseMirror_td]:py-2",
          "[&_.ProseMirror_th]:border [&_.ProseMirror_th]:border-black/10 [&_.ProseMirror_th]:bg-brand-background [&_.ProseMirror_th]:px-3 [&_.ProseMirror_th]:py-2 [&_.ProseMirror_th]:text-start [&_.ProseMirror_th]:font-semibold",
          "[&_.ProseMirror_ul[data-type=taskList]]:list-none [&_.ProseMirror_ul[data-type=taskList]]:ps-0",
          "[&_.ProseMirror_ul[data-type=taskList]_li]:flex [&_.ProseMirror_ul[data-type=taskList]_li]:items-start [&_.ProseMirror_ul[data-type=taskList]_li]:gap-2",
          "[&_.ProseMirror_ul[data-type=taskList]_li_label]:mt-1",
          disabled && "pointer-events-none",
        )}
      />

      {showCharacterCount && editor ? (
        <div className="flex items-center justify-between gap-3 border-t border-black/10 px-4 py-2 text-xs text-brand-gris">
          <span>
            {t("words", { count: words })} · {t("characters", { count: characters })}
          </span>
          {typeof maxCharacters === "number" ? (
            <span
              className={cn(
                characters > maxCharacters && "font-semibold text-brand-accent",
              )}
            >
              {characters}/{maxCharacters}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
