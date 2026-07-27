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
      richColors
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
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        style: {
          backgroundColor: "#042417",
          color: "#ffffff",
          borderRadius: "9999px",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: "8px",
          boxShadow: "0 20px 25px -5px rgba(4, 36, 23, 0.6), 0 8px 10px -6px rgba(4, 36, 23, 0.6)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        },
        classNames: {
          toast:
            "flex items-center justify-start gap-2 px-6 py-3.5 rounded-full text-brand-white text-sm font-semibold",
          content: "w-max flex-none",
          icon: "m-0 size-auto",
          title: "text-white font-semibold text-sm text-start",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
