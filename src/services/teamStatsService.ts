import { STORAGE_KEYS, getFromLocalStorage } from "@/lib/localStorage";

export interface TeamStats {
  player_name: string;
  total_points: number;
  goals_scored: number;
  assists: number;
  clean_sheets: number;
  minutes: number;
  yellow_cards: number;
  red_cards: number;
  bonus: number;
  expected_goals: string;
  expected_assists: string;
  expected_goal_involvements: string;
  expected_goals_conceded: string;
  web_name: string;
  team: number;
  team_code: number;
  points_per_game: string;
  selected_by_percent: string;
}

export interface TeamStatsResponse {
  manager_id: string;
  gameweek: number;
  team_stats: Array<{
    id: number;
    stats: {
      minutes: number;
      goals_scored: number;
      assists: number;
      clean_sheets: number;
      yellow_cards: number;
      red_cards: number;
      bonus: number;
      total_points: number;
      expected_goals: string;
      expected_assists: string;
      expected_goal_involvements: string;
      expected_goals_conceded: string;
    };
    web_name: string;
    team: number;
    team_code: number;
    points_per_game: string;
    selected_by_percent: string;
  }>;
}

export const transformTeamStatsResponse = (response: TeamStatsResponse): TeamStats[] => {
  return response.team_stats.map(player => ({
    player_name: player.web_name || `Player ${player.id}`,
    total_points: player.stats.total_points,
    goals_scored: player.stats.goals_scored,
    assists: player.stats.assists,
    clean_sheets: player.stats.clean_sheets,
    minutes: player.stats.minutes,
    yellow_cards: player.stats.yellow_cards,
    red_cards: player.stats.red_cards,
    bonus: player.stats.bonus,
    expected_goals: player.stats.expected_goals,
    expected_assists: player.stats.expected_assists,
    expected_goal_involvements: player.stats.expected_goal_involvements,
    expected_goals_conceded: player.stats.expected_goals_conceded,
    web_name: player.web_name,
    team: player.team,
    team_code: player.team_code,
    points_per_game: player.points_per_game,
    selected_by_percent: player.selected_by_percent
  }));
};

export const fetchMyTeamStats = async (): Promise<TeamStats[]> => {
  const managerId = getFromLocalStorage<string | null>(STORAGE_KEYS.MANAGER_ID, null);
  
  if (!managerId) {
    throw new Error("Manager ID not found");
  }
  
  const response = await fetch(`http://127.0.0.1:8000/my-team/${managerId}/stats`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch team stats: ${response.statusText}`);
  }
  
  const data: TeamStatsResponse = await response.json();
  return transformTeamStatsResponse(data);
};
