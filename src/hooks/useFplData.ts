
import { useQuery } from "@tanstack/react-query";
import { fetchBootstrapData } from "@/services/fplService";
import { FplBootstrapResponse, FplPlayer, FplTeam, FplPosition } from "@/types/fpl-api";

// Mock data for when in production or when API fails
const mockBootstrapData: FplBootstrapResponse = {
  events: [],
  game_settings: { league_join_private_max: 0, league_join_public_max: 0, league_max_size_public_classic: 0, league_max_size_public_h2h: 0, league_max_size_private_h2h: 0, league_max_ko_rounds_private_h2h: 0, squad_squadplay: 0, squad_squadsize: 0, squad_team_limit: 0, squad_total_spend: 0, ui_currency_multiplier: 0, ui_use_special_shirts: false, stats_form_days: 0, sys_vice_captain_enabled: false, transfers_cap: 0, transfers_sell_on_fee: 0, league_h2h_tiebreak_stats: [''], cup_start_event_id: 0, timezone: '' },
  phases: [],
  teams: [
    { id: 1, name: "Arsenal", short_name: "ARS", code: 3, form: null, pulse_id: 1 },
    { id: 2, name: "Aston Villa", short_name: "AVL", code: 7, form: null, pulse_id: 2 },
    { id: 3, name: "Bournemouth", short_name: "BOU", code: 91, form: null, pulse_id: 3 },
    { id: 4, name: "Brentford", short_name: "BRE", code: 94, form: null, pulse_id: 4 },
    { id: 5, name: "Brighton", short_name: "BHA", code: 36, form: null, pulse_id: 5 },
    { id: 6, name: "Chelsea", short_name: "CHE", code: 8, form: null, pulse_id: 6 },
    { id: 7, name: "Crystal Palace", short_name: "CRY", code: 31, form: null, pulse_id: 7 },
    { id: 8, name: "Everton", short_name: "EVE", code: 11, form: null, pulse_id: 8 },
    { id: 9, name: "Fulham", short_name: "FUL", code: 54, form: null, pulse_id: 9 },
    { id: 10, name: "Liverpool", short_name: "LIV", code: 14, form: null, pulse_id: 10 },
    { id: 11, name: "Manchester City", short_name: "MCI", code: 43, form: null, pulse_id: 11 },
    { id: 12, name: "Manchester United", short_name: "MUN", code: 1, form: null, pulse_id: 12 },
    { id: 13, name: "Newcastle", short_name: "NEW", code: 4, form: null, pulse_id: 13 },
    { id: 14, name: "Nottingham Forest", short_name: "NFO", code: 17, form: null, pulse_id: 14 },
    { id: 15, name: "Tottenham", short_name: "TOT", code: 6, form: null, pulse_id: 15 },
    { id: 16, name: "West Ham", short_name: "WHU", code: 21, form: null, pulse_id: 16 },
    { id: 17, name: "Wolves", short_name: "WOL", code: 39, form: null, pulse_id: 17 },
    { id: 18, name: "Ipswich", short_name: "IPS", code: 45, form: null, pulse_id: 18 },
    { id: 19, name: "Leicester", short_name: "LEI", code: 13, form: null, pulse_id: 19 },
    { id: 20, name: "Southampton", short_name: "SOU", code: 20, form: null, pulse_id: 20 },
  ],
  element_stats: [],
  element_types: [
    { id: 1, plural_name: "Goalkeepers", plural_name_short: "GKP", singular_name: "Goalkeeper", singular_name_short: "GKP", squad_select: 2, squad_min_play: 1, squad_max_play: 1, element_count: 0, ui_shirt_specific: true },
    { id: 2, plural_name: "Defenders", plural_name_short: "DEF", singular_name: "Defender", singular_name_short: "DEF", squad_select: 5, squad_min_play: 3, squad_max_play: 5, element_count: 0, ui_shirt_specific: false },
    { id: 3, plural_name: "Midfielders", plural_name_short: "MID", singular_name: "Midfielder", singular_name_short: "MID", squad_select: 5, squad_min_play: 3, squad_max_play: 5, element_count: 0, ui_shirt_specific: false },
    { id: 4, plural_name: "Forwards", plural_name_short: "FWD", singular_name: "Forward", singular_name_short: "FWD", squad_select: 3, squad_min_play: 1, squad_max_play: 3, element_count: 0, ui_shirt_specific: false },
  ],
  elements: [
    // Top 20 players by total points
    { id: 1, web_name: "Salah", first_name: "Mohamed", second_name: "Salah", team: 10, element_type: 3, now_cost: 125, total_points: 230, goals_scored: 20, assists: 12, clean_sheets: 0, minutes: 0, bonus: 0, points_per_game: "0.0", selected_by_percent: "0.0", yellow_cards: 0, red_cards: 0, chance_of_playing_next_round: null, chance_of_playing_this_round: null },
    { id: 2, web_name: "Haaland", first_name: "Erling", second_name: "Haaland", team: 11, element_type: 4, now_cost: 140, total_points: 225, goals_scored: 25, assists: 5, clean_sheets: 0, minutes: 0, bonus: 0, points_per_game: "0.0", selected_by_percent: "0.0", yellow_cards: 0, red_cards: 0, chance_of_playing_next_round: null, chance_of_playing_this_round: null },
    { id: 3, web_name: "Saka", first_name: "Bukayo", second_name: "Saka", team: 1, element_type: 3, now_cost: 110, total_points: 210, goals_scored: 15, assists: 15, clean_sheets: 0, minutes: 0, bonus: 0, points_per_game: "0.0", selected_by_percent: "0.0", yellow_cards: 0, red_cards: 0, chance_of_playing_next_round: null, chance_of_playing_this_round: null },
    { id: 4, web_name: "De Bruyne", first_name: "Kevin", second_name: "De Bruyne", team: 11, element_type: 3, now_cost: 105, total_points: 205, goals_scored: 10, assists: 20, clean_sheets: 0, minutes: 0, bonus: 0, points_per_game: "0.0", selected_by_percent: "0.0", yellow_cards: 0, red_cards: 0, chance_of_playing_next_round: null, chance_of_playing_this_round: null },
    { id: 5, web_name: "Watkins", first_name: "Ollie", second_name: "Watkins", team: 2, element_type: 4, now_cost: 95, total_points: 195, goals_scored: 18, assists: 10, clean_sheets: 0, minutes: 0, bonus: 0, points_per_game: "0.0", selected_by_percent: "0.0", yellow_cards: 0, red_cards: 0, chance_of_playing_next_round: null, chance_of_playing_this_round: null },
    { id: 6, web_name: "Alexander-Arnold", first_name: "Trent", second_name: "Alexander-Arnold", team: 10, element_type: 2, now_cost: 85, total_points: 190, goals_scored: 4, assists: 15, clean_sheets: 15, minutes: 0, bonus: 0, points_per_game: "0.0", selected_by_percent: "0.0", yellow_cards: 0, red_cards: 0, chance_of_playing_next_round: null, chance_of_playing_this_round: null },
    { id: 7, web_name: "Son", first_name: "Heung-Min", second_name: "Son", team: 15, element_type: 3, now_cost: 100, total_points: 185, goals_scored: 16, assists: 8, clean_sheets: 0, minutes: 0, bonus: 0, points_per_game: "0.0", selected_by_percent: "0.0", yellow_cards: 0, red_cards: 0, chance_of_playing_next_round: null, chance_of_playing_this_round: null },
    { id: 8, web_name: "Foden", first_name: "Phil", second_name: "Foden", team: 11, element_type: 3, now_cost: 95, total_points: 180, goals_scored: 15, assists: 10, clean_sheets: 0, minutes: 0, bonus: 0, points_per_game: "0.0", selected_by_percent: "0.0", yellow_cards: 0, red_cards: 0, chance_of_playing_next_round: null, chance_of_playing_this_round: null },
    { id: 9, web_name: "Palmer", first_name: "Cole", second_name: "Palmer", team: 6, element_type: 3, now_cost: 85, total_points: 175, goals_scored: 14, assists: 9, clean_sheets: 0, minutes: 0, bonus: 0, points_per_game: "0.0", selected_by_percent: "0.0", yellow_cards: 0, red_cards: 0, chance_of_playing_next_round: null, chance_of_playing_this_round: null },
    { id: 10, web_name: "Ederson", first_name: "Ederson", second_name: "Moraes", team: 11, element_type: 1, now_cost: 60, total_points: 170, goals_scored: 0, assists: 0, clean_sheets: 18, minutes: 0, bonus: 0, points_per_game: "0.0", selected_by_percent: "0.0", yellow_cards: 0, red_cards: 0, chance_of_playing_next_round: null, chance_of_playing_this_round: null },
    { id: 11, web_name: "Martinelli", first_name: "Gabriel", second_name: "Martinelli", team: 1, element_type: 3, now_cost: 80, total_points: 165, goals_scored: 12, assists: 8, clean_sheets: 0, minutes: 0, bonus: 0, points_per_game: "0.0", selected_by_percent: "0.0", yellow_cards: 0, red_cards: 0, chance_of_playing_next_round: null, chance_of_playing_this_round: null },
    { id: 12, web_name: "Alisson", first_name: "Alisson", second_name: "Becker", team: 10, element_type: 1, now_cost: 60, total_points: 165, goals_scored: 0, assists: 0, clean_sheets: 17, minutes: 0, bonus: 0, points_per_game: "0.0", selected_by_percent: "0.0", yellow_cards: 0, red_cards: 0, chance_of_playing_next_round: null, chance_of_playing_this_round: null },
    { id: 13, web_name: "Gordon", first_name: "Anthony", second_name: "Gordon", team: 13, element_type: 3, now_cost: 75, total_points: 160, goals_scored: 10, assists: 12, clean_sheets: 0, minutes: 0, bonus: 0, points_per_game: "0.0", selected_by_percent: "0.0", yellow_cards: 0, red_cards: 0, chance_of_playing_next_round: null, chance_of_playing_this_round: null },
    { id: 14, web_name: "Van Dijk", first_name: "Virgil", second_name: "van Dijk", team: 10, element_type: 2, now_cost: 70, total_points: 155, goals_scored: 5, assists: 2, clean_sheets: 17, minutes: 0, bonus: 0, points_per_game: "0.0", selected_by_percent: "0.0", yellow_cards: 0, red_cards: 0, chance_of_playing_next_round: null, chance_of_playing_this_round: null },
    { id: 15, web_name: "Solanke", first_name: "Dominic", second_name: "Solanke", team: 15, element_type: 4, now_cost: 75, total_points: 150, goals_scored: 15, assists: 3, clean_sheets: 0, minutes: 0, bonus: 0, points_per_game: "0.0", selected_by_percent: "0.0", yellow_cards: 0, red_cards: 0, chance_of_playing_next_round: null, chance_of_playing_this_round: null },
    { id: 16, web_name: "Jota", first_name: "Diogo", second_name: "Jota", team: 10, element_type: 4, now_cost: 80, total_points: 145, goals_scored: 12, assists: 5, clean_sheets: 0, minutes: 0, bonus: 0, points_per_game: "0.0", selected_by_percent: "0.0", yellow_cards: 0, red_cards: 0, chance_of_playing_next_round: null, chance_of_playing_this_round: null },
    { id: 17, web_name: "Odegaard", first_name: "Martin", second_name: "Odegaard", team: 1, element_type: 3, now_cost: 85, total_points: 140, goals_scored: 8, assists: 10, clean_sheets: 0, minutes: 0, bonus: 0, points_per_game: "0.0", selected_by_percent: "0.0", yellow_cards: 0, red_cards: 0, chance_of_playing_next_round: null, chance_of_playing_this_round: null },
    { id: 18, web_name: "Jesus", first_name: "Gabriel", second_name: "Jesus", team: 1, element_type: 4, now_cost: 80, total_points: 135, goals_scored: 10, assists: 7, clean_sheets: 0, minutes: 0, bonus: 0, points_per_game: "0.0", selected_by_percent: "0.0", yellow_cards: 0, red_cards: 0, chance_of_playing_next_round: null, chance_of_playing_this_round: null },
    { id: 19, web_name: "Dias", first_name: "Ruben", second_name: "Dias", team: 11, element_type: 2, now_cost: 65, total_points: 130, goals_scored: 2, assists: 3, clean_sheets: 15, minutes: 0, bonus: 0, points_per_game: "0.0", selected_by_percent: "0.0", yellow_cards: 0, red_cards: 0, chance_of_playing_next_round: null, chance_of_playing_this_round: null },
    { id: 20, web_name: "Kane", first_name: "Harry", second_name: "Kane", team: 15, element_type: 4, now_cost: 130, total_points: 200, goals_scored: 22, assists: 3, clean_sheets: 0, minutes: 0, bonus: 0, points_per_game: "0.0", selected_by_percent: "0.0", yellow_cards: 0, red_cards: 0, chance_of_playing_next_round: null, chance_of_playing_this_round: null },
  ],
  total_players: 0,
  total_teams: 20,
};

export const useFplData = () => {
  const { 
    data, 
    isLoading, 
    error 
  } = useQuery<FplBootstrapResponse>({
    queryKey: ["bootstrap-static"],
    queryFn: async () => {
      try {
        // Try to fetch data from API
        return await fetchBootstrapData();
      } catch (error) {
        console.error("Error fetching FPL data:", error);
        // If API call fails, return mock data
        return mockBootstrapData;
      }
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
  });

  // Helper function to get team name by team id
  const getTeamName = (teamId: number): string => {
    if (!data?.teams) return "";
    const team = data.teams.find(t => t.id === teamId);
    return team ? team.name : "";
  };

  // Helper function to get position name by element type id
  const getPositionName = (elementTypeId: number): string => {
    if (!data?.element_types) return "";
    const position = data.element_types.find(p => p.id === elementTypeId);
    return position ? position.singular_name : "";
  };

  // Return formatted price in £ form
  const formatPrice = (price: number): string => {
    return `£${(price / 10).toFixed(1)}m`;
  };

  return {
    data,
    players: data?.elements || [],
    teams: data?.teams || [],
    positions: data?.element_types || [],
    isLoading,
    error,
    getTeamName,
    getPositionName,
    formatPrice,
  };
};
