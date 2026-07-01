"use client";

import DashboardNavbar from "@/features/dashboard/components/dashboard-navbar";
import DashboardSidebar from "@/features/dashboard/components/dashboard-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset className="min-h-svh  p-4">
        <DashboardNavbar />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
