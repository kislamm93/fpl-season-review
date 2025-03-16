
import React, { useEffect, useState } from "react";
import { History } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { STORAGE_KEYS, getFromLocalStorage } from "@/lib/localStorage";

interface AppSidebarProps {
  managerId: string | null;
}

const AppSidebar = ({ managerId }: AppSidebarProps) => {
  return (
    <Sidebar collapsible="none">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Manager Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managerId && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Manager History">
                    <a href="/manager-history">
                      <History />
                      <span>Manager History</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
