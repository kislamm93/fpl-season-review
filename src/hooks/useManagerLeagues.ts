
import { useQuery } from "@tanstack/react-query";
import { fetchManagerLeagues } from "@/services/leagueService";
import { FplLeague } from "@/types/fpl-api";

export const useManagerLeagues = (managerId: string | null) => {
  const {
    data,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["manager-leagues", managerId],
    queryFn: () => (managerId ? fetchManagerLeagues(managerId) : Promise.reject("No manager ID")),
    enabled: !!managerId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes to prevent unnecessary refetches
  });

  // Combine classic and h2h leagues for display
  const allLeagues: FplLeague[] = data 
    ? [...(data.classic || []), ...(data.h2h || [])]
    : [];

  return {
    leagues: allLeagues,
    classicLeagues: data?.classic || [],
    h2hLeagues: data?.h2h || [],
    isLoading,
    error,
  };
};
