
import { useQuery } from "@tanstack/react-query";
import { fetchManagerHistory } from "@/services/fplService";
import { FplManagerHistory } from "@/types/fpl-api";

export const useManagerHistory = (managerId: string | null) => {
  const { 
    data, 
    isLoading, 
    error 
  } = useQuery<FplManagerHistory>({
    queryKey: ["manager-history", managerId],
    queryFn: () => fetchManagerHistory(managerId as string),
    enabled: !!managerId,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });

  // Helper function to filter gameweeks by range
  const filterGameweeksByRange = (minGw: number, maxGw: number) => {
    if (!data?.current) return [];
    return data.current.filter(gw => gw.event >= minGw && gw.event <= maxGw);
  };

  return {
    history: data,
    gameweeks: data?.current || [],
    filterGameweeksByRange,
    isLoading,
    error,
  };
};
