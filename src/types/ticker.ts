// Official FPL fixture difficulty (FDR), 1-5, higher = harder.

export interface TickerCell {
  opponent_id: number;
  opponent_short: string;
  is_home: boolean;
  difficulty: number;
}

export interface TickerRow {
  team_id: number;
  name: string;
  short_name: string;
  total: number;
  fixture_count: number;
  cells: Record<string, TickerCell[]>;
}

export interface TickerResponse {
  from_gw: number;
  to_gw: number;
  gameweeks: number[];
  rows: TickerRow[];
}
