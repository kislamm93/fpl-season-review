
import { useQuery } from "@tanstack/react-query";
import { fetchBootstrapData } from "@/services/fplService";
import { FplBootstrapResponse, FplPlayer, FplTeam, FplPosition } from "@/types/fpl-api";

export const useFplData = () => {
  const { 
    data, 
    isLoading, 
    error 
  } = useQuery<FplBootstrapResponse>({
    queryKey: ["bootstrap-static"],
    queryFn: fetchBootstrapData,
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
