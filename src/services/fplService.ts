
import { getApiEndpoint } from "@/lib/env";
import { FplBootstrapResponse } from "@/types/fpl-api";

/**
 * Fetches the initial bootstrap data from the FPL API
 */
export const fetchBootstrapData = async (): Promise<FplBootstrapResponse> => {
  try {
    const response = await fetch(getApiEndpoint("/bootstrap-static"));
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data as FplBootstrapResponse;
  } catch (error) {
    console.error("Error fetching FPL data:", error);
    throw error;
  }
};
