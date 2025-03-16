
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { STORAGE_KEYS, getFromLocalStorage } from "@/lib/localStorage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useManagerHistory } from "@/hooks/useManagerHistory";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Legend } from "recharts";

const ManagerHistory = () => {
  const navigate = useNavigate();
  const [managerId, setManagerId] = useState<string | null>(null);
  
  useEffect(() => {
    const storedId = getFromLocalStorage<string | null>(STORAGE_KEYS.MANAGER_ID, null);
    setManagerId(storedId);
    
    // If no manager ID, redirect to home
    if (!storedId) {
      navigate('/');
    }
  }, [navigate]);
  
  const { gameweeks, isLoading, error } = useManagerHistory(managerId);
  
  const pointsChartData = gameweeks.map(gw => ({
    gameweek: `GW ${gw.event}`,
    totalPoints: gw.total_points,
  }));

  const rankChartData = gameweeks.map(gw => ({
    gameweek: `GW ${gw.event}`,
    rank: gw.overall_rank,
  }));
  
  const pointsConfig = {
    totalPoints: {
      label: "Total Points",
      color: "#6366f1", // indigo-500
    },
  };

  const rankConfig = {
    rank: {
      label: "Overall Rank",
      color: "#9b87f5", // purple
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to dashboard</span>
          </Button>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Manager History</h2>
            {managerId && (
              <span className="text-sm text-muted-foreground">ID: {managerId}</span>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-1 container max-w-screen-2xl py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Points Performance</CardTitle>
              <CardDescription>
                Track your total points across gameweeks
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="w-full aspect-video">
                  <Skeleton className="w-full h-full" />
                </div>
              ) : error ? (
                <div className="text-center py-8 text-destructive">
                  Error loading manager history data
                </div>
              ) : gameweeks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No gameweek data available for this manager
                </div>
              ) : (
                <ChartContainer className="aspect-video" config={pointsConfig}>
                  <LineChart data={pointsChartData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="gameweek" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="totalPoints" 
                      stroke="var(--color-totalPoints)" 
                      strokeWidth={2} 
                      dot={{ strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Total Points"
                    />
                    <Legend content={<ChartLegendContent />} />
                  </LineChart>
                </ChartContainer>
              )}
              <div className="mt-4 flex justify-center">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#6366f1]"></div>
                  <span className="text-sm">Total Points</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Overall Rank</CardTitle>
              <CardDescription>
                Track your rank position across gameweeks
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="w-full aspect-video">
                  <Skeleton className="w-full h-full" />
                </div>
              ) : error ? (
                <div className="text-center py-8 text-destructive">
                  Error loading manager history data
                </div>
              ) : gameweeks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No gameweek data available for this manager
                </div>
              ) : (
                <ChartContainer className="aspect-video" config={rankConfig}>
                  <LineChart data={rankChartData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="gameweek" />
                    <YAxis 
                      tickFormatter={(value) => value.toLocaleString()}
                    />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="rank" 
                      stroke="var(--color-rank)" 
                      strokeWidth={2} 
                      dot={{ strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Overall Rank"
                    />
                    <Legend content={<ChartLegendContent />} />
                  </LineChart>
                </ChartContainer>
              )}
              <div className="mt-4 flex justify-center">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#9b87f5]"></div>
                  <span className="text-sm">Overall Rank (higher is worse)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Gameweek Details</CardTitle>
            <CardDescription>
              Detailed breakdown of your performance in each gameweek
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="w-full h-12" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8 text-destructive">
                Error loading manager history data
              </div>
            ) : gameweeks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No gameweek data available for this manager
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-6 gap-4 font-semibold text-sm py-2 border-b">
                  <div>Gameweek</div>
                  <div>Points</div>
                  <div>Total Points</div>
                  <div>Overall Rank</div>
                  <div>Transfers</div>
                  <div>Bench Points</div>
                </div>
                {gameweeks.map((gw) => (
                  <div key={gw.event} className="grid grid-cols-6 gap-4 text-sm py-2 border-b border-border/40 hover:bg-accent/10">
                    <div className="font-medium">Gameweek {gw.event}</div>
                    <div className="font-mono">{gw.points}</div>
                    <div className="font-mono">{gw.total_points}</div>
                    <div className="font-mono">{gw.overall_rank.toLocaleString()}</div>
                    <div className="font-mono">{gw.event_transfers} {gw.event_transfers_cost > 0 && `(-${gw.event_transfers_cost}pts)`}</div>
                    <div className="font-mono">{gw.points_on_bench}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>
          FPL Season Review — Elegantly track your Fantasy Premier League performance
        </p>
      </footer>
    </div>
  );
};

export default ManagerHistory;
