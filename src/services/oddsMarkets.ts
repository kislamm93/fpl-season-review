/**
 * Betting-markets snapshot.
 *
 * Reads are free — the backend serves a cached snapshot and never calls the
 * Odds API on a GET. Refreshing costs credits (~30 of a 500/month free tier),
 * so it needs the admin key and only happens when someone asks for it.
 */
import { getApiEndpoint } from "@/lib/env";

const ADMIN_KEY_STORAGE = "fpl_admin_key";

export interface MatchMarket {
  event_id: string;
  kickoff: string | null;
  home: string;
  away: string;
  home_name: string;
  away_name: string;
  home_win_pct: number | null;
  away_win_pct: number | null;
  draw_pct: number | null;
  over_2_5_pct: number | null;
  under_2_5_pct: number | null;
  handicap: number | null;
  btts_yes_pct: number | null;
  btts_no_pct: number | null;
  home_cs_pct: number | null;
  away_cs_pct: number | null;
  home_difficulty: number | null;
  away_difficulty: number | null;
}

export interface GoalscorerMarket {
  event_id: string;
  player_id: number;
  name: string;
  odds_name: string;
  team: string;
  opponent: string;
  is_home: boolean;
  position: string;
  price: number;
  difficulty: number | null;
  owned_pct: number;
  anytime_pct: number;
  books: number;
  sot_over_0_5_pct: number;
  xgi_per_90: number;
  starts_per_90: number;
  doubt: string | null;
}

export interface MarketsSnapshot {
  last_updated: number | null;
  gameweek: number | null;
  credits_used: number | null;
  credits_spent_this_refresh: number | null;
  matches: MatchMarket[];
  goalscorers: GoalscorerMarket[];
  unmatched_players: string[];
  unmatched_teams: string[];
}

export const getAdminKey = (): string | null => localStorage.getItem(ADMIN_KEY_STORAGE);

export const setAdminKey = (key: string): void => {
  localStorage.setItem(ADMIN_KEY_STORAGE, key.trim());
};

export const fetchMarkets = async (): Promise<MarketsSnapshot> => {
  const response = await fetch(getApiEndpoint("/odds/markets"));
  if (!response.ok) throw new Error(`Failed to load markets: ${response.status}`);
  return response.json();
};

/** Spends Odds API credits. 403 means the stored admin key is wrong or missing. */
export const refreshMarkets = async (adminKey: string): Promise<MarketsSnapshot> => {
  const response = await fetch(getApiEndpoint("/odds/refresh"), {
    method: "POST",
    headers: { "X-Admin-Key": adminKey },
  });
  if (response.status === 403) throw new Error("Admin key rejected");
  if (!response.ok) throw new Error(`Refresh failed: ${response.status}`);
  return response.json();
};
