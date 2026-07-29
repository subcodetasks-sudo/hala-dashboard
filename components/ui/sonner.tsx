"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"
import { useDirection } from "@/components/ui/direction"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()
  const direction = useDirection()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      dir={direction}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-5 shrink-0 text-brand-white" />
        ),
        info: (
          <InfoIcon className="size-5 shrink-0 text-brand-white" />
        ),
        warning: (
          <TriangleAlertIcon className="size-5 shrink-0 text-brand-white" />
        ),
        error: (
          <OctagonXIcon className="size-5 shrink-0 text-brand-white" />
        ),
        loading: (
          <Loader2Icon className="size-5 shrink-0 animate-spin text-brand-white" />
        ),
      }}
      style={
        {
          /* Widest the pill may grow before its text wraps */
          "--width": "min(92vw, 26rem)",
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "flex items-center justify-start text-brand-white",
          icon: "m-0 size-auto",
          title: "text-start",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
