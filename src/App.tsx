import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { HelmetProvider } from "react-helmet-async";
import AppSidebar from "@/components/AppSidebar";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ManagerHistory from "./pages/ManagerHistory";
import MiniLeaguePreview from "./pages/MiniLeaguePreview";
import LeagueDetails from "./pages/LeagueDetails";
import MyTeamStats from "./pages/MyTeamStats";
import MarketOdd from "./pages/MarketOdd";
import FixtureTicker from "./pages/FixtureTicker";
import CompareTeams from "./pages/CompareTeams";
import { STORAGE_KEYS, getFromLocalStorage } from "@/lib/localStorage";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [managerId, setManagerId] = useState<string | null>(null);
  
  useEffect(() => {
    const storedId = getFromLocalStorage<string | null>(STORAGE_KEYS.MANAGER_ID, null);
    setManagerId(storedId);
    
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEYS.MANAGER_ID) {
        const updatedId = getFromLocalStorage<string | null>(STORAGE_KEYS.MANAGER_ID, null);
        setManagerId(updatedId);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    const handleCustomStorageChange = () => {
      const updatedId = getFromLocalStorage<string | null>(STORAGE_KEYS.MANAGER_ID, null);
      setManagerId(updatedId);
    };
    
    window.addEventListener('local-storage-change', handleCustomStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage-change', handleCustomStorageChange);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <HelmetProvider>
          <Toaster />
          <Sonner />
          <SidebarProvider>
            <BrowserRouter basename={import.meta.env.BASE_URL}>
              <div className="flex w-full min-h-screen">
                <AppSidebar managerId={managerId} />
                <main className="flex-1 relative">
                  {/* Mobile top bar: hamburger toggles the off-canvas sidebar */}
                  {managerId && (
                    <div className="sticky top-0 z-20 flex items-center gap-2 border-b bg-background/80 p-2 backdrop-blur md:hidden">
                      <SidebarTrigger aria-label="Toggle menu" />
                      <span className="text-sm font-medium">Menu</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-4 z-30">
                    <ThemeToggle />
                  </div>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/manager-history" element={<ManagerHistory />} />
                    <Route path="/mini-league-preview" element={<MiniLeaguePreview />} />
                    <Route path="/league/:leagueId" element={<LeagueDetails />} />
                    <Route path="/my-team-stats" element={<MyTeamStats />} />
                    <Route path="/my-team-stats/:managerId" element={<MyTeamStats />} />
                    <Route path="/market-odds" element={<MarketOdd />} />
                    <Route path="/fixture-ticker" element={<FixtureTicker />} />
                    <Route path="/compare-teams" element={<CompareTeams />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </BrowserRouter>
          </SidebarProvider>
        </HelmetProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
