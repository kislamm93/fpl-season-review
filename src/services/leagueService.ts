import { getApiEndpoint } from "@/lib/env";
import { FplLeagueStandings, FplManagerLeagues } from "@/types/fpl-api";

/**
 * Fetches the leagues a manager is participating in
 */
export const fetchManagerLeagues = async (managerId: string): Promise<FplManagerLeagues> => {
  try {
    const response = await fetch(getApiEndpoint(`/entry/${managerId}`));
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.leagues) {
      return data.leagues as FplManagerLeagues;
    } else {
      throw new Error("Leagues data not found in response");
    }
  } catch (error) {
    console.error("Error fetching manager leagues:", error);
    throw error;
  }
};

/**
 * Fetches the standings for a specific league
 */
export const fetchLeagueStandings = async (leagueId: number): Promise<FplLeagueStandings> => {
  try {
    const response = await fetch(getApiEndpoint(`/leagues-classic/${leagueId}/standings`));
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data as FplLeagueStandings;
  } catch (error) {
    console.error("Error fetching league standings:", error);
    throw error;
  }
};

/**
 * Fetches all participants and their gameweek history for a league
 */
export const fetchLeagueParticipants = async (leagueId: number) => {
  try {
    const response = await fetch(getApiEndpoint(`/leagues-classic/${leagueId}/participants`));
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching league participants:", error);
    throw error;
  }
};
