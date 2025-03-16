
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
