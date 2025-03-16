
import { STORAGE_KEYS, getFromLocalStorage } from "@/lib/localStorage";

export interface TeamStats {
  player_name: string;
  position: string;
  total_points: number;
  goals_scored: number;
  assists: number;
  clean_sheets: number;
  minutes: number;
  yellow_cards: number;
  red_cards: number;
  bonus: number;
  cost: number;
}

export const fetchMyTeamStats = async (): Promise<TeamStats[]> => {
  const managerId = getFromLocalStorage<string | null>(STORAGE_KEYS.MANAGER_ID, null);
  
  if (!managerId) {
    throw new Error("Manager ID not found");
  }
  
  const response = await fetch(`http://127.0.0.1:8000/my-team/${managerId}/stats`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch team stats: ${response.statusText}`);
  }
  
  return await response.json();
};
