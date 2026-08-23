
import React, { useState } from "react";
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
import { ArrowDown, ArrowUp } from "lucide-react";
import { TeamStats } from "@/services/teamStatsService";

type SortField = 
  | 'player_name' 
  | 'team' 
  | 'total_points' 
  | 'selected_by_percent' 
  | 'goals_scored' 
  | 'assists' 
  | 'minutes' 
  | 'bonus' 
  | 'expected_goals' 
  | 'expected_assists' 
  | 'expected_goal_involvements' 
  | 'expected_goals_conceded' 
  | 'clean_sheets'
  | 'defensive_contribution'
  | 'yellow_cards'
  | 'red_cards'
  | 'points_per_game';

type SortDirection = 'asc' | 'desc';

const MyTeamStats = () => {
  const { data: teamStats, isLoading, error } = useTeamStats();
  const [sortField, setSortField] = useState<SortField>('total_points');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

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

  // Team name now comes from the backend (bootstrap-static), so it always
  // reflects the current season rather than a hardcoded list.
  const getTeamName = (player: TeamStats) => {
    return player.team_short_name || (player.team ? `Team ${player.team}` : "–");
  };

  // Function to handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to desc for most stats (highest first)
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Function to render sort indicator
  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' 
      ? <ArrowUp className="ml-1 h-4 w-4 inline" /> 
      : <ArrowDown className="ml-1 h-4 w-4 inline" />;
  };

  // Function to sort data
  const sortData = (data: TeamStats[]) => {
    if (!data) return [];
    
    return [...data].sort((a, b) => {
      let aValue: string | number = a[sortField];
      let bValue: string | number = b[sortField];
      
      // Special handling for numeric string fields
      if (sortField === 'expected_goals' || 
          sortField === 'expected_assists' || 
          sortField === 'expected_goal_involvements' || 
          sortField === 'expected_goals_conceded' ||
          sortField === 'points_per_game' ||
          sortField === 'selected_by_percent') {
        aValue = parseFloat(aValue as string) || 0;
        bValue = parseFloat(bValue as string) || 0;
      }
      
      // Sort direction logic
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  // Get sorted data
  const sortedData = teamStats ? sortData(teamStats) : [];

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
                    <TableHead 
                      className="cursor-pointer" 
                      onClick={() => handleSort('team')}
                    >
                      Team {renderSortIndicator('team')}
                    </TableHead>
                    <TableHead 
                      className="text-right cursor-pointer" 
                      onClick={() => handleSort('total_points')}
                    >
                      Points {renderSortIndicator('total_points')}
                    </TableHead>
                    <TableHead 
                      className="text-right cursor-pointer" 
                      onClick={() => handleSort('points_per_game')}
                    >
                      PPG {renderSortIndicator('points_per_game')}
                    </TableHead>
                    <TableHead 
                      className="text-right cursor-pointer" 
                      onClick={() => handleSort('selected_by_percent')}
                    >
                      Selected {renderSortIndicator('selected_by_percent')}
                    </TableHead>
                    <TableHead 
                      className="text-right cursor-pointer" 
                      onClick={() => handleSort('goals_scored')}
                    >
                      Goals {renderSortIndicator('goals_scored')}
                    </TableHead>
                    <TableHead 
                      className="text-right cursor-pointer" 
                      onClick={() => handleSort('assists')}
                    >
                      Assists {renderSortIndicator('assists')}
                    </TableHead>
                    <TableHead
                      className="text-right cursor-pointer"
                      onClick={() => handleSort('clean_sheets')}
                    >
                      Clean Sheets {renderSortIndicator('clean_sheets')}
                    </TableHead>
                    <TableHead
                      className="text-right cursor-pointer whitespace-nowrap"
                      onClick={() => handleSort('defensive_contribution')}
                      title="Defensive Contribution points"
                    >
                      DefCon {renderSortIndicator('defensive_contribution')}
                    </TableHead>
                    <TableHead
                      className="text-right cursor-pointer"
                      onClick={() => handleSort('minutes')}
                    >
                      Minutes {renderSortIndicator('minutes')}
                    </TableHead>
                    <TableHead 
                      className="text-right cursor-pointer" 
                      onClick={() => handleSort('yellow_cards')}
                    >
                      Yellow Cards {renderSortIndicator('yellow_cards')}
                    </TableHead>
                    <TableHead 
                      className="text-right cursor-pointer" 
                      onClick={() => handleSort('red_cards')}
                    >
                      Red Cards {renderSortIndicator('red_cards')}
                    </TableHead>
                    <TableHead 
                      className="text-right cursor-pointer" 
                      onClick={() => handleSort('bonus')}
                    >
                      Bonus {renderSortIndicator('bonus')}
                    </TableHead>
                    <TableHead 
                      className="text-right cursor-pointer" 
                      onClick={() => handleSort('expected_goals')}
                    >
                      xG {renderSortIndicator('expected_goals')}
                    </TableHead>
                    <TableHead 
                      className="text-right cursor-pointer" 
                      onClick={() => handleSort('expected_assists')}
                    >
                      xA {renderSortIndicator('expected_assists')}
                    </TableHead>
                    <TableHead 
                      className="text-right cursor-pointer" 
                      onClick={() => handleSort('expected_goal_involvements')}
                    >
                      xGI {renderSortIndicator('expected_goal_involvements')}
                    </TableHead>
                    <TableHead 
                      className="text-right cursor-pointer" 
                      onClick={() => handleSort('expected_goals_conceded')}
                    >
                      xGC {renderSortIndicator('expected_goals_conceded')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedData.map((player, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{player.web_name || player.player_name}</TableCell>
                      <TableCell>{getTeamName(player)}</TableCell>
                      <TableCell className="text-right">{player.total_points}</TableCell>
                      <TableCell className="text-right">{player.points_per_game}</TableCell>
                      <TableCell className="text-right">{player.selected_by_percent}%</TableCell>
                      <TableCell className="text-right">{player.goals_scored}</TableCell>
                      <TableCell className="text-right">{player.assists}</TableCell>
                      <TableCell className="text-right">{player.clean_sheets}</TableCell>
                      <TableCell className="text-right">{player.defensive_contribution}</TableCell>
                      <TableCell className="text-right">{player.minutes}</TableCell>
                      <TableCell className="text-right">{player.yellow_cards}</TableCell>
                      <TableCell className="text-right">{player.red_cards}</TableCell>
                      <TableCell className="text-right">{player.bonus}</TableCell>
                      <TableCell className="text-right">{player.expected_goals}</TableCell>
                      <TableCell className="text-right">{player.expected_assists}</TableCell>
                      <TableCell className="text-right">{player.expected_goal_involvements}</TableCell>
                      <TableCell className="text-right">{player.expected_goals_conceded}</TableCell>
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
