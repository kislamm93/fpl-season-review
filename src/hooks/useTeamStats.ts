
import { useQuery } from "@tanstack/react-query";
import { fetchMyTeamStats, TeamStats } from "@/services/teamStatsService";

export const useTeamStats = () => {
  return useQuery<TeamStats[], Error>({
    queryKey: ['team-stats'],
    queryFn: fetchMyTeamStats,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
