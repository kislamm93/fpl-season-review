import { FplBootstrapResponse, FplManagerHistory } from "@/types/fpl-api";
import { getApiEndpoint } from "@/lib/env";

/**
 * Fetches the initial bootstrap data from the FPL API
 */
export const fetchBootstrapData = async (): Promise<FplBootstrapResponse> => {
  try {
    const response = await fetch(getApiEndpoint("/bootstrap-static"));
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching FPL data:", error);
    throw error;
  }
};

/**
 * Fetches the manager history data from the FPL API
 */
export const fetchManagerHistory = async (managerId: string): Promise<FplManagerHistory> => {
  try {
    const response = await fetch(getApiEndpoint(`/entry/${managerId}/history`));
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data as FplManagerHistory;
  } catch (error) {
    console.error("Error fetching manager history:", error);
    throw error;
  }
};

/**
 * Fetches manager's picks for a specific gameweek
 */
export const fetchManagerPicks = async (managerId: string, gameweek: number) => {
  try {
    const response = await fetch(getApiEndpoint(`/entry/${managerId}/event/${gameweek}/picks`));
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching manager picks:", error);
    throw error;
  }
};

/**
 * Fetches live scores for a specific gameweek
 */
export const fetchLiveScores = async (gameweek: number) => {
  try {
    const response = await fetch(getApiEndpoint(`/event/${gameweek}/live`));
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching live scores:", error);
    throw error;
  }
};

/**
 * Fetches fixtures for a specific event/gameweek
 */
export const fetchFixtures = async (gameweek: number) => {
  try {
    const response = await fetch(getApiEndpoint(`/event/${gameweek}/fixtures`));
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching fixtures:", error);
    throw error;
  }
};
