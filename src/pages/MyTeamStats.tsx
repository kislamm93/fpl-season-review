
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useTeamStats } from "@/hooks/useTeamStats";
import { STORAGE_KEYS, getFromLocalStorage, saveToLocalStorage } from "@/lib/localStorage";
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
  const { managerId: managerIdParam } = useParams<{ managerId: string }>();
  const queryClient = useQueryClient();

  // If a manager ID is supplied in the URL (/my-team-stats/:managerId), adopt it
  // as the app's manager ID so every page uses it. It can still be changed later
  // via the manager ID form.
  React.useEffect(() => {
    const id = managerIdParam?.trim();
    if (!id) return;
    const current = getFromLocalStorage<string | null>(STORAGE_KEYS.MANAGER_ID, null);
    if (id === current) return;
    saveToLocalStorage(STORAGE_KEYS.MANAGER_ID, id);
    window.dispatchEvent(new Event('local-storage-change')); // update sidebar/dashboard
    queryClient.invalidateQueries({ queryKey: ['team-stats'] }); // refetch for new id
  }, [managerIdParam, queryClient]);

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

  // Every column except the frozen player name. Keeping these in one list lets
  // the header and body stay in lockstep and avoids 16 copy-pasted <th>/<td>.
  const STAT_COLUMNS: Array<{
    field: SortField;
    label: string;
    align?: 'left' | 'right';
    title?: string;
    render: (p: TeamStats) => React.ReactNode;
  }> = [
    { field: 'team', label: 'Team', align: 'left', render: (p) => getTeamName(p) },
    { field: 'total_points', label: 'Points', render: (p) => p.total_points },
    { field: 'points_per_game', label: 'PPG', render: (p) => p.points_per_game },
    { field: 'selected_by_percent', label: 'Selected', render: (p) => `${p.selected_by_percent}%` },
    { field: 'goals_scored', label: 'Goals', render: (p) => p.goals_scored },
    { field: 'assists', label: 'Assists', render: (p) => p.assists },
    { field: 'clean_sheets', label: 'Clean Sheets', render: (p) => p.clean_sheets },
    { field: 'defensive_contribution', label: 'DefCon', title: 'Defensive Contribution points', render: (p) => p.defensive_contribution },
    { field: 'minutes', label: 'Minutes', render: (p) => p.minutes },
    { field: 'yellow_cards', label: 'Yellow Cards', render: (p) => p.yellow_cards },
    { field: 'red_cards', label: 'Red Cards', render: (p) => p.red_cards },
    { field: 'bonus', label: 'Bonus', render: (p) => p.bonus },
    { field: 'expected_goals', label: 'xG', render: (p) => p.expected_goals },
    { field: 'expected_assists', label: 'xA', render: (p) => p.expected_assists },
    { field: 'expected_goal_involvements', label: 'xGI', render: (p) => p.expected_goal_involvements },
    { field: 'expected_goals_conceded', label: 'xGC', render: (p) => p.expected_goals_conceded },
  ];

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
            // Frozen first column via a single native table. One overflow-x-auto
            // scroll container (so the page never scrolls sideways — that was what
            // dragged the names along), first column position:sticky left-0, and
            // border-separate: with border-collapse:collapse iOS Safari silently
            // disables sticky cells, which is why earlier attempts drifted.
            <div className="w-full overflow-x-auto">
              <table className="w-full caption-bottom border-separate border-spacing-0 text-sm">
                <thead>
                  <tr>
                    <th className="sticky left-0 z-20 h-12 whitespace-nowrap border-b border-r bg-background px-4 text-left align-middle font-medium text-muted-foreground">
                      Player
                    </th>
                    {STAT_COLUMNS.map((col) => (
                      <th
                        key={col.field}
                        title={col.title}
                        onClick={() => handleSort(col.field)}
                        className={`h-12 cursor-pointer whitespace-nowrap border-b px-4 align-middle font-medium text-muted-foreground ${col.align === 'left' ? 'text-left' : 'text-right'}`}
                      >
                        {col.label} {renderSortIndicator(col.field)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((player, index) => (
                    <tr key={index} className="group transition-colors hover:bg-muted/50">
                      <td className="sticky left-0 z-10 whitespace-nowrap border-b border-r bg-background px-4 py-4 align-middle font-medium group-hover:bg-muted/50">
                        {player.web_name || player.player_name}
                      </td>
                      {STAT_COLUMNS.map((col) => (
                        <td
                          key={col.field}
                          className={`border-b px-4 py-4 align-middle ${col.align === 'left' ? 'whitespace-nowrap text-left' : 'text-right'}`}
                        >
                          {col.render(player)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyTeamStats;
