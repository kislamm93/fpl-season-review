
import React from "react";
import { Link } from "react-router-dom";
import { BarChart, History, LayoutDashboard, Trophy, BarChart4, CalendarClock, Users } from "lucide-react";
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

interface AppSidebarProps {
  managerId: string | null;
}

const AppSidebar = ({ managerId }: AppSidebarProps) => {
  // If there's no manager ID, don't render the sidebar at all
  if (!managerId) {
    return null;
  }

  return (
    <Sidebar collapsible="none">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Manager Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Dashboard">
                  <Link to="/">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="My Team Stats">
                  <Link to="/my-team-stats">
                    <BarChart />
                    <span>My Team Stats</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Manager History">
                  <Link to="/manager-history">
                    <History />
                    <span>Manager History</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Mini League Preview">
                  <Link to="/mini-league-preview">
                    <Trophy />
                    <span>Mini League Preview</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Market Odds">
                  <Link to="/market-odds">
                    <BarChart4 />
                    <span>Market Odds</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Fixture Ticker">
                  <Link to="/fixture-ticker">
                    <CalendarClock />
                    <span>Fixture Ticker</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Compare Teams">
                  <Link to="/compare-teams">
                    <Users />
                    <span>Compare Teams</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
