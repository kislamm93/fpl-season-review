
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { generateRandomColor } from "@/lib/utils";

type ParticipantHistory = {
  event: number;
  rank: number;
  total_points: number;
  points: number;
};

type Participant = {
  entry_id: number;
  player_name: string;
  team_name: string;
  history: ParticipantHistory[];
};

type LeagueRankChartProps = {
  data: Participant[] | undefined;
  isLoading: boolean;
  error: Error | null;
};

const LeagueRankChart: React.FC<LeagueRankChartProps> = ({ data, isLoading, error }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // Get all unique gameweeks
    const allGameweeks = new Set<number>();
    data.forEach(participant => {
      if (Array.isArray(participant.history)) {
        participant.history.forEach(gw => {
          if (gw && typeof gw.event === 'number') {
            allGameweeks.add(gw.event);
          }
        });
      }
    });
    
    const sortedGameweeks = Array.from(allGameweeks).sort((a, b) => a - b);
    
    // Create data points for each gameweek with all participants' ranks
    return sortedGameweeks.map(gw => {
      const dataPoint: Record<string, any> = {
        gameweek: `GW${gw}`,
      };
      
      data.forEach(participant => {
        if (Array.isArray(participant.history)) {
          const gwHistory = participant.history.find(history => history && history.event === gw);
          if (gwHistory) {
            // Use overall_rank instead of rank if dealing with manager history
            const rankValue = gwHistory.rank || gwHistory.overall_rank;
            if (rankValue) {
              dataPoint[participant.player_name] = rankValue;
            }
          }
        }
      });
      
      return dataPoint;
    });
  }, [data]);

  // Create a config object for the chart
  const chartConfig = useMemo(() => {
    if (!data) return {};
    
    const config: Record<string, any> = {};
    data.forEach(participant => {
      config[participant.player_name] = {
        label: participant.player_name,
        color: generateRandomColor()
      };
    });
    
    return config;
  }, [data]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>League Rank History</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>League Rank History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-destructive">
            Error loading rank history data. Please try again later.
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0 || chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>League Rank History</CardTitle>
        </CardHeader>
        <CardContent>
          <div>No rank history data available.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>League Rank History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ChartContainer config={chartConfig}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="gameweek" />
              <YAxis reversed />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              {data.map((participant) => (
                <Line
                  key={participant.entry_id}
                  type="monotone"
                  dataKey={participant.player_name}
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  dot={{ r: 3 }}
                />
              ))}
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeagueRankChart;
