
export interface FplPlayer {
  id: number;
  first_name: string;
  second_name: string;
  web_name: string;
  team: number;
  team_code: number;
  position: number;
  element_type: number;
  now_cost: number; // Cost in tenths of a million
  total_points: number;
  minutes: number;
  goals_scored: number;
  assists: number;
  clean_sheets: number;
  yellow_cards: number;
  red_cards: number;
  form: string;
  points_per_game: string;
  selected_by_percent: string;
  status: string;
  photo: string;
}

export interface FplTeam {
  id: number;
  name: string;
  short_name: string;
  code: number;
}

export interface FplPosition {
  id: number;
  singular_name: string;
  singular_name_short: string;
  plural_name: string;
  plural_name_short: string;
}

export interface FplBootstrapResponse {
  elements: FplPlayer[];
  teams: FplTeam[];
  element_types: FplPosition[];
}

export interface FplGameweekHistory {
  event: number; // Gameweek number
  points: number;
  total_points: number;
  rank: number;
  rank_sort: number;
  overall_rank: number;
  bank: number;
  value: number;
  event_transfers: number;
  event_transfers_cost: number;
  points_on_bench: number;
}

export interface FplCurrentSeason {
  current: FplGameweekHistory[];
  past: any[];
}

export interface FplManagerHistory {
  current: FplGameweekHistory[];
  past: any[];
  chips: any[];
}

// League related types
export interface FplLeague {
  id: number;
  name: string;
  created: string;
  closed: boolean;
  max_entries: null | number;
  league_type: string;
  scoring: string;
  admin_entry: number;
  start_event: number;
  code_privacy: string;
  rank: null | number;
}

export interface FplLeagueEntry {
  id: number;
  entry_name: string;
  player_name: string;
  rank: number;
  last_rank: number;
  rank_sort: number;
  total: number;
  entry: number;
  entry_id: number;
}

export interface FplLeagueStandings {
  league: FplLeague;
  standings: {
    has_next: boolean;
    page: number;
    results: FplLeagueEntry[];
  };
}

export interface FplManagerLeagues {
  classic: FplLeague[];
  h2h: FplLeague[];
  cup: any; // Cup data structure
}
