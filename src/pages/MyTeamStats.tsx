
import React from "react";
import { useTeamStats } from "@/hooks/useTeamStats";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const MyTeamStats = () => {
  const { data: teamStats, isLoading, error } = useTeamStats();

  // Show error toast if there's an error
  React.useEffect(() => {
    if (error) {
      toast.error("Failed to load team stats", {
        description: error.message,
      });
    }
  }, [error]);

  // Log data to console for debugging
  React.useEffect(() => {
    if (teamStats) {
      console.log("Team stats received:", teamStats);
    }
  }, [teamStats]);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">My Team Stats</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Player Performance</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 15 }).map((_, i) => (
                <Skeleton key={i} className="w-full h-12" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Player</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead className="text-right">Points</TableHead>
                    <TableHead className="text-right">Goals</TableHead>
                    <TableHead className="text-right">Assists</TableHead>
                    <TableHead className="text-right">Clean Sheets</TableHead>
                    <TableHead className="text-right">Minutes</TableHead>
                    <TableHead className="text-right">Yellow Cards</TableHead>
                    <TableHead className="text-right">Red Cards</TableHead>
                    <TableHead className="text-right">Bonus</TableHead>
                    <TableHead className="text-right">Cost (£m)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamStats?.map((player, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{player.player_name}</TableCell>
                      <TableCell>{player.position}</TableCell>
                      <TableCell className="text-right">{player.total_points}</TableCell>
                      <TableCell className="text-right">{player.goals_scored}</TableCell>
                      <TableCell className="text-right">{player.assists}</TableCell>
                      <TableCell className="text-right">{player.clean_sheets}</TableCell>
                      <TableCell className="text-right">{player.minutes}</TableCell>
                      <TableCell className="text-right">{player.yellow_cards}</TableCell>
                      <TableCell className="text-right">{player.red_cards}</TableCell>
                      <TableCell className="text-right">{player.bonus}</TableCell>
                      <TableCell className="text-right">{(player.cost / 10).toFixed(1)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyTeamStats;
