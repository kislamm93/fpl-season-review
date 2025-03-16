import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Zap } from "lucide-react";
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
import { Slider } from "@/components/ui/slider";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Legend, ReferenceDot } from "recharts";

const ManagerHistory = () => {
  const navigate = useNavigate();
  const [managerId, setManagerId] = useState<string | null>(null);
  
  const [pointsChartRange, setPointsChartRange] = useState<[number, number]>([1, 38]);
  const [gwRankChartRange, setGwRankChartRange] = useState<[number, number]>([1, 38]);
  const [overallRankChartRange, setOverallRankChartRange] = useState<[number, number]>([1, 38]);
  
  useEffect(() => {
    const storedId = getFromLocalStorage<string | null>(STORAGE_KEYS.MANAGER_ID, null);
    setManagerId(storedId);
    
    if (!storedId) {
      navigate('/');
    }
  }, [navigate]);
  
  const { gameweeks, filterGameweeksByRange, isLoading, error } = useManagerHistory(managerId);
  
  useEffect(() => {
    if (gameweeks.length > 0) {
      const minGw = Math.min(...gameweeks.map(gw => gw.event));
      const maxGw = Math.max(...gameweeks.map(gw => gw.event));
      
      setPointsChartRange([minGw, maxGw]);
      setGwRankChartRange([minGw, maxGw]);
      setOverallRankChartRange([minGw, maxGw]);
    }
  }, [gameweeks]);
  
  const pointsChartData = filterGameweeksByRange(pointsChartRange[0], pointsChartRange[1]).map(gw => ({
    gameweek: `GW ${gw.event}`,
    points: gw.points,
    overallRank: gw.overall_rank,
    transferCost: gw.event_transfers_cost,
    tookHit: gw.event_transfers_cost > 0
  }));

  const rankChartData = filterGameweeksByRange(overallRankChartRange[0], overallRankChartRange[1]).map(gw => ({
    gameweek: `GW ${gw.event}`,
    rank: gw.overall_rank,
  }));
  
  const gameweekRankData = filterGameweeksByRange(gwRankChartRange[0], gwRankChartRange[1]).map(gw => ({
    gameweek: `GW ${gw.event}`,
    gwRank: gw.rank,
    points: gw.points
  }));
  
  const pointsConfig = {
    points: {
      label: "Gameweek Points",
      color: "#6366f1", // indigo-500
    },
    overallRank: {
      label: "Overall Rank",
      color: "transparent", // Hidden in chart but used for tooltip
    }
  };

  const rankConfig = {
    rank: {
      label: "Overall Rank",
      color: "#9b87f5", // purple
    }
  };
  
  const gwRankConfig = {
    gwRank: {
      label: "Gameweek Rank",
      color: "#10b981", // emerald-500
    }
  };

  const renderSliderControl = (
    value: [number, number], 
    onChange: (value: [number, number]) => void,
    min: number,
    max: number
  ) => {
    return (
      <div className="mt-2 px-4">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>GW {value[0]}</span>
          <span>GW {value[1]}</span>
        </div>
        <Slider
          defaultValue={[min, max]}
          value={value}
          min={min}
          max={max}
          step={1}
          onValueChange={(val) => onChange(val as [number, number])}
          className="my-2"
        />
        <div className="text-xs text-center text-muted-foreground">
          Showing GW{value[0]} - GW{value[1]}
        </div>
      </div>
    );
  };

  const minGw = gameweeks.length > 0 ? Math.min(...gameweeks.map(gw => gw.event)) : 1;
  const maxGw = gameweeks.length > 0 ? Math.max(...gameweeks.map(gw => gw.event)) : 38;

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
        <div className="grid grid-cols-1 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Points Performance</CardTitle>
              <CardDescription>
                Track your gameweek points across the season
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
                <>
                  <ChartContainer className="aspect-video" config={pointsConfig}>
                    <LineChart data={pointsChartData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="gameweek" />
                      <YAxis />
                      <Tooltip 
                        content={
                          ({active, payload}) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
                                  <div className="font-medium">{payload[0].payload.gameweek}</div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Gameweek Points</span>
                                    <span className="font-mono font-medium tabular-nums text-foreground">{payload[0].value}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Overall Rank</span>
                                    <span className="font-mono font-medium tabular-nums text-foreground">{payload[0].payload.overallRank.toLocaleString()}</span>
                                  </div>
                                  {payload[0].payload.transferCost > 0 && (
                                    <div className="flex justify-between text-destructive">
                                      <span className="flex items-center gap-0.5">
                                        <Zap className="h-3 w-3" /> Transfer Hit
                                      </span>
                                      <span className="font-mono font-medium tabular-nums">-{payload[0].payload.transferCost}pts</span>
                                    </div>
                                  )}
                                </div>
                              );
                            }
                            return null;
                          }
                        }
                      />
                      <Line 
                        type="monotone" 
                        dataKey="points" 
                        stroke="var(--color-points)" 
                        strokeWidth={2} 
                        dot={(props) => {
                          const { cx, cy, payload } = props;
                          if (payload.tookHit) {
                            return (
                              <g>
                                <circle cx={cx} cy={cy} r={4} fill="var(--color-points)" stroke="var(--color-points)" />
                                <circle cx={cx} cy={cy} r={7} fill="none" stroke="#ef4444" strokeWidth={1.5} />
                              </g>
                            );
                          }
                          return <circle cx={cx} cy={cy} r={4} fill="var(--color-points)" stroke="var(--color-points)" />;
                        }}
                        activeDot={{ r: 6 }}
                        name="Gameweek Points"
                      />
                      <Legend content={<ChartLegendContent />} />
                    </LineChart>
                  </ChartContainer>
                  {renderSliderControl(
                    pointsChartRange,
                    setPointsChartRange,
                    minGw,
                    maxGw
                  )}
                </>
              )}
              <div className="mt-4 flex justify-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#6366f1]"></div>
                  <span className="text-sm">Gameweek Points</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full border-[1.5px] border-[#ef4444]"></div>
                  </div>
                  <span className="text-sm flex items-center">
                    <Zap className="h-3 w-3 mr-0.5 text-[#ef4444]" /> Transfer Hit
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gameweek Rank</CardTitle>
              <CardDescription>
                Your rank position within each individual gameweek
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
                <>
                  <ChartContainer className="aspect-video" config={gwRankConfig}>
                    <LineChart data={gameweekRankData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="gameweek" />
                      <YAxis 
                        tickFormatter={(value) => value.toLocaleString()}
                        reversed={false} // Higher rank is worse, so larger numbers at bottom
                      />
                      <Tooltip
                        content={({active, payload}) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
                                <div className="font-medium">{payload[0].payload.gameweek}</div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Gameweek Rank</span>
                                  <span className="font-mono font-medium tabular-nums text-foreground">{payload[0].value.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Points</span>
                                  <span className="font-mono font-medium tabular-nums text-foreground">{payload[0].payload.points}</span>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="gwRank" 
                        stroke="var(--color-gwRank)" 
                        strokeWidth={2} 
                        dot={{ strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Gameweek Rank"
                      />
                      <Legend content={<ChartLegendContent />} />
                    </LineChart>
                  </ChartContainer>
                  {renderSliderControl(
                    gwRankChartRange,
                    setGwRankChartRange,
                    minGw,
                    maxGw
                  )}
                </>
              )}
              <div className="mt-4 flex justify-center">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#10b981]"></div>
                  <span className="text-sm">Gameweek Rank (higher is worse)</span>
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
                <>
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
                  {renderSliderControl(
                    overallRankChartRange,
                    setOverallRankChartRange,
                    minGw,
                    maxGw
                  )}
                </>
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
