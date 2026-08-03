"use client";

import {
  Bold,
  ImagePlus,
  Italic,
  Link2,
  Type,
} from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BlogContentEditorProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  invalid?: boolean;
};

type ToolbarAction = {
  id: string;
  label: string;
  icon: ReactNode;
  onClick: () => void;
};

function applyFormat(command: string, value?: string) {
  document.execCommand(command, false, value);
}

export default function BlogContentEditor({
  id,
  value,
  onChange,
  placeholder,
  disabled = false,
  invalid = false,
}: BlogContentEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (!value && el.innerHTML) {
      el.innerHTML = "";
      return;
    }
    if (value && el.innerHTML === "") {
      el.innerHTML = value;
    }
  }, [value]);

  const syncValue = () => {
    const next = editorRef.current?.innerHTML ?? "";
    const normalized = next === "<br>" ? "" : next;
    onChange(normalized);
  };

  const runCommand = (command: string, commandValue?: string) => {
    if (disabled) return;
    editorRef.current?.focus();
    applyFormat(command, commandValue);
    syncValue();
  };

  /** RTL: first item renders on the right (matches design order). */
  const actions: ToolbarAction[] = [
    {
      id: "type",
      label: "Heading",
      icon: <Type className="size-4" strokeWidth={1.75} />,
      onClick: () => runCommand("formatBlock", "h3"),
    },
    {
      id: "bold",
      label: "Bold",
      icon: <Bold className="size-4" strokeWidth={1.75} />,
      onClick: () => runCommand("bold"),
    },
    {
      id: "italic",
      label: "Italic",
      icon: <Italic className="size-4" strokeWidth={1.75} />,
      onClick: () => runCommand("italic"),
    },
    {
      id: "link",
      label: "Link",
      icon: <Link2 className="size-4" strokeWidth={1.75} />,
      onClick: () => {
        const url = window.prompt("URL");
        if (url) runCommand("createLink", url);
      },
    },
    {
      id: "image",
      label: "Image",
      icon: <ImagePlus className="size-4" strokeWidth={1.75} />,
      onClick: () => {
        const url = window.prompt("Image URL");
        if (url) runCommand("insertImage", url);
      },
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {actions.map((action) => (
          <Button
            key={action.id}
            type="button"
            variant="ghost"
            disabled={disabled}
            aria-label={action.label}
            onClick={action.onClick}
            className="size-9 shrink-0 rounded-full border-none bg-[#F0F0F0] p-0 text-brand-black hover:bg-[#E6E6E6] hover:text-brand-black"
          >
            {action.icon}
          </Button>
        ))}
      </div>

      <div
        className={cn(
          "overflow-hidden rounded-2xl border border-black/10 bg-[#FBFBFB]",
          invalid && "border-brand-accent ring-3 ring-brand-accent/20"
        )}
      >
        <div
          id={id}
          ref={editorRef}
          role="textbox"
          aria-multiline="true"
          contentEditable={!disabled}
          suppressContentEditableWarning
          data-placeholder={placeholder}
          onInput={syncValue}
          onBlur={syncValue}
          className={cn(
            "min-h-80 max-h-112 overflow-y-auto px-4 py-4 text-start text-sm leading-relaxed text-brand-black outline-none",
            "empty:before:pointer-events-none empty:before:text-brand-gris/60 empty:before:content-[attr(data-placeholder)]",
            disabled && "pointer-events-none opacity-60"
          )}
        />
      </div>
    </div>
  );
}
