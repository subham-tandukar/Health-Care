"use client";
import { LayoutDashboard, Users, Calendar, Stethoscope } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Doctors",
    url: "/admin/doctors",
    icon: Users,
  },
  {
    title: "Appointments",
    url: "/admin/appointments",
    icon: Calendar,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (path) => {
    return pathname === path || pathname.startsWith(path + "/");
  };

  return (
    <Sidebar className="w-64 border-r shadow-medium">
      <SidebarContent className="p-4 bg-primary/10">
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-8 px-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-foreground">Health Care</h2>
            <p className="text-xs text-muted-foreground">Admin Dashboard</p>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all hover:!bg-primary hover:!text-primary-foreground
                          ${
                            active &&
                            "bg-primary text-primary-foreground font-medium"
                          }`}
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
