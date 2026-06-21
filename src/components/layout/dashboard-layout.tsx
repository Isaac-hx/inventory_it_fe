import { useState } from "react";
import { Outlet, useLocation } from "react-router";
import { X } from "lucide-react";

import NavigatorBreadcrumbs from "../shared/breadcrumb";
import AppSidebar from "@/components/layout/app-sidebar";
import AppNavbar from "@/components/layout/app-navbar";
import { Button } from "@/components/ui/button";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation()
  console.log(location)
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="fixed left-0 top-0 hidden h-screen lg:block">
        <AppSidebar />
      </div>

      {/* Mobile Overlay */}
        <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden ${
            sidebarOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        >
        <div
            className={`h-full w-64 bg-white shadow-xl transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
            <div className="flex justify-end p-3">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
            >
                <X className="h-5 w-5" />
            </Button>
            </div>

            <AppSidebar />
        </div>
        </div>

      <div className="lg:ml-64 ">
        <AppNavbar onOpenSidebar={() => setSidebarOpen(true)} />

        <main className="p-4 lg:p-6 space-y-4">
          <NavigatorBreadcrumbs pathname={location.pathname} />
          <Outlet />
        </main>
      </div>
    </div>
  );
}