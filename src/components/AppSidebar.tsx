import React from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  History,
  LayoutDashboard,
  Trophy,
  BarChart4,
  CalendarClock,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  managerId: string | null;
}

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/my-team-stats", label: "My Team Stats", icon: BarChart },
  { to: "/manager-history", label: "Manager History", icon: History },
  { to: "/mini-league-preview", label: "Mini League Preview", icon: Trophy },
  { to: "/market-odds", label: "Market Odds", icon: BarChart4 },
  { to: "/fixture-ticker", label: "Fixture Ticker", icon: CalendarClock },
  { to: "/compare-teams", label: "Compare Teams", icon: Users },
];

const AppSidebar = ({ managerId }: AppSidebarProps) => {
  const { setOpenMobile } = useSidebar();

  // If there's no manager ID, don't render the sidebar at all
  if (!managerId) {
    return null;
  }

  // On mobile the sidebar is an off-canvas drawer — close it after navigating.
  const closeOnMobile = () => setOpenMobile(false);

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Manager Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                <SidebarMenuItem key={to}>
                  <SidebarMenuButton asChild tooltip={label}>
                    <Link to={to} onClick={closeOnMobile}>
                      <Icon />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
