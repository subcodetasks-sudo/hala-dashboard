"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "./dashboard-sidebar";
import DashboardNavbar from "./dashboard-navbar";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "18rem",
        } as React.CSSProperties
      }
    >
      <DashboardSidebar />
      <SidebarInset className="h-svh min-w-0 overflow-x-hidden overflow-y-auto p-4 pt-0">
        <DashboardNavbar />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
