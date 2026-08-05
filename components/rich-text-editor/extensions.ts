import CharacterCount from "@tiptap/extension-character-count";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import { Link } from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { TableKit } from "@tiptap/extension-table";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextAlign from "@tiptap/extension-text-align";
import { Color, TextStyle } from "@tiptap/extension-text-style";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import Youtube from "@tiptap/extension-youtube";
import StarterKit from "@tiptap/starter-kit";
import type { Extensions } from "@tiptap/react";

type CreateRichTextExtensionsOptions = {
  placeholder?: string | (() => string);
  maxCharacters?: number;
};

export function createRichTextExtensions({
  placeholder = "",
  maxCharacters,
}: CreateRichTextExtensionsOptions = {}): Extensions {
  return [
    StarterKit.configure({
      heading: { levels: [1, 2, 3, 4] },
      link: false,
      underline: false,
    }),
    Underline,
    TextStyle,
    Color,
    Highlight.configure({ multicolor: true }),
    Link.configure({
      openOnClick: false,
      autolink: true,
      linkOnPaste: true,
      HTMLAttributes: {
        class: "text-brand-primary underline underline-offset-2",
        rel: "noopener noreferrer nofollow",
        target: "_blank",
      },
    }),
    Image.configure({
      allowBase64: true,
      HTMLAttributes: {
        class: "max-w-full h-auto rounded-xl",
      },
    }),
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    Placeholder.configure({
      placeholder,
      emptyEditorClass: "is-editor-empty",
    }),
    Typography,
    Subscript,
    Superscript,
    TaskList.configure({
      HTMLAttributes: {
        class: "list-none ps-0",
      },
    }),
    TaskItem.configure({
      nested: true,
      HTMLAttributes: {
        class: "flex items-start gap-2",
      },
    }),
    TableKit.configure({
      table: {
        resizable: true,
        HTMLAttributes: {
          class: "border-collapse w-full overflow-hidden rounded-lg",
        },
      },
    }),
    Youtube.configure({
      controls: true,
      nocookie: true,
      HTMLAttributes: {
        class: "aspect-video w-full rounded-xl overflow-hidden",
      },
    }),
    CharacterCount.configure({
      limit: maxCharacters,
    }),
  ];
}
