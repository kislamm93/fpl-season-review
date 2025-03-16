
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

  return {
    history: data,
    gameweeks: data?.current || [],
    isLoading,
    error,
  };
};
