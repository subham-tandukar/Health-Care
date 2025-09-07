"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/navigation/AdminSidebar";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const AdminLayout = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />

        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="h-16 sticky z-10 top-0 border-b bg-card shadow-soft flex items-center px-6">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />

            <div className="flex-1 flex justify-between items-center ml-4">
              <div>
                <h1 className="text-lg font-semibold text-foreground">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  Manage doctors and appointments
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  variant={"destructive"}
                  onClick={() =>
                    signOut({
                      callbackUrl: "/admin",
                    })
                  }
                >
                  <LogOut/>
                  Logout
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
