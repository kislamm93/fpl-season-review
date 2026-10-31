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

/**
 * The gameweek being picked for — never one that has already finished.
 *
 * Distinct from fetchCurrentGameweek below, which callers that read picks or
 * results need: FPL leaves is_current set on a gameweek until the next kicks
 * off, so after GW8's last match is_current is still GW8 while GW9 is the one
 * the ticker should open on.
 */
export const fetchUpcomingGameweek = async (): Promise<number> => {
  try {
    const response = await fetch(getApiEndpoint("/events/upcoming"));
    if (!response.ok) return 1;
    const event = await response.json();
    return event?.id ?? 1;
  } catch {
    return 1;
  }
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
