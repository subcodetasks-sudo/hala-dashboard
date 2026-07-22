"use client";

import type { CSSProperties } from "react";
import { ReactSVG } from "react-svg";

import { cn } from "@/lib/utils";

type CustomIconProps = {
  src: string;
  /** Uniform width & height in px. Ignored when `width` / `height` are set. */
  size?: number;
  width?: number | string;
  height?: number | string;
  /** Applied via `currentColor` on fills/strokes. Prefer Tailwind `text-*` via `className`. */
  color?: string;
  className?: string;
  title?: string;
  "aria-label"?: string;
  "aria-hidden"?: boolean | "true" | "false";
};

function toPx(value: number | string) {
  return typeof value === "number" ? String(value) : value;
}

function injectSvgStyles(
  svg: SVGSVGElement,
  width: number | string,
  height: number | string,
  decorative: boolean
) {
  svg.setAttribute("width", toPx(width));
  svg.setAttribute("height", toPx(height));
  svg.style.width = toPx(width);
  svg.style.height = toPx(height);

  if (decorative) {
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
  }

  svg.querySelectorAll<SVGElement>("[fill]").forEach((el) => {
    if (el.getAttribute("fill") !== "none") {
      el.setAttribute("fill", "currentColor");
    }
  });

  svg.querySelectorAll<SVGElement>("[stroke]").forEach((el) => {
    if (el.getAttribute("stroke") !== "none") {
      el.setAttribute("stroke", "currentColor");
    }
  });
}

export default function CustomIcon({
  src,
  size = 24,
  width,
  height,
  color,
  className,
  title,
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden,
}: CustomIconProps) {
  const resolvedWidth = width ?? size;
  const resolvedHeight = height ?? size;
  const decorative = ariaHidden !== false && !ariaLabel && !title;

  const style: CSSProperties | undefined = color
    ? { color }
    : undefined;

  return (
    <ReactSVG
      src={src}
      title={title}
      aria-label={ariaLabel}
      aria-hidden={decorative ? true : ariaHidden}
      beforeInjection={(svg) =>
        injectSvgStyles(svg, resolvedWidth, resolvedHeight, decorative)
      }
      wrapper="span"
      style={style}
      className={cn(
        "inline-flex shrink-0 items-center justify-center text-current [&_svg]:block",
        className
      )}
    />
  );
}
