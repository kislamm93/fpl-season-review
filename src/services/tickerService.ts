import { getApiEndpoint } from "@/lib/env";
import { TickerResponse } from "@/types/ticker";

export const fetchTicker = async (
  fromGw: number,
  toGw: number
): Promise<TickerResponse> => {
  const url = getApiEndpoint(`/fixture-ticker/?from_gw=${fromGw}&to_gw=${toGw}`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load ticker: ${response.status}`);
  }
  return response.json();
};

/** Best-guess starting gameweek: the current one, else the next, else 1. */
export const fetchCurrentGameweek = async (): Promise<number> => {
  try {
    const response = await fetch(getApiEndpoint("/bootstrap-static"));
    if (!response.ok) return 1;
    const data = await response.json();
    const events: Array<{ id: number; is_current?: boolean; is_next?: boolean }> =
      data.events ?? [];
    const current = events.find((e) => e.is_current);
    if (current) return current.id;
    const next = events.find((e) => e.is_next);
    if (next) return next.id;
    return 1;
  } catch {
    return 1;
  }
};
