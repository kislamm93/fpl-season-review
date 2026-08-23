import { getApiEndpoint } from "@/lib/env";
import { fetchCurrentGameweek } from "@/services/tickerService";

export interface ManagerSummary {
  id: number;
  teamName: string;
  managerName: string;
  overallPoints: number;
  overallRank: number | null;
  gwPoints: number;
  gwRank: number | null;
  currentEvent: number;
  bank: number; // £m
  squadValue: number; // £m (includes bank)
  totalTransfers: number;
  freeTransfers: number; // estimate for the upcoming GW
}

interface EntryResponse {
  id: number;
  name: string;
  player_first_name: string;
  player_last_name: string;
  current_event: number | null;
  summary_overall_points: number | null;
  summary_overall_rank: number | null;
  summary_event_points: number | null;
  summary_event_rank: number | null;
  last_deadline_bank: number | null;
  last_deadline_value: number | null;
  last_deadline_total_transfers: number | null;
}

interface HistoryEvent {
  event: number;
  event_transfers: number;
}
interface Chip {
  name: string;
  event: number;
}
interface HistoryResponse {
  current: HistoryEvent[];
  chips: Chip[];
}

/**
 * Estimate free transfers available for the upcoming gameweek by walking the
 * season history: +1 per GW (capped at 5), minus transfers made. Wildcard/Free
 * Hit weeks don't consume banked transfers. Approximate — chip edge cases aside.
 */
const estimateFreeTransfers = (history: HistoryResponse): number => {
  const chipByEvent = new Map(history.chips.map((c) => [c.event, c.name]));
  const events = [...history.current].sort((a, b) => a.event - b.event);
  let ft = 1;
  for (const gw of events) {
    const chip = chipByEvent.get(gw.event);
    if (chip === "wildcard" || chip === "freehit") {
      ft = Math.min(5, ft + 1);
      continue;
    }
    ft = Math.max(0, ft - gw.event_transfers);
    ft = Math.min(5, ft + 1);
  }
  return ft;
};

/* ----------------------------- Squad comparison ---------------------------- */

export type PickStatus = "C" | "VC" | "XI" | "B"; // captain, vice, starter, bench
export type PlayerPosition = "GKP" | "DEF" | "MID" | "FWD";

export interface SquadPlayer {
  elementId: number;
  name: string;
  teamShort: string;
  position: PlayerPosition;
  status: PickStatus;
  slot: number; // pick position 1-15
  isCommon: boolean; // owned by more than one of the compared managers
}

export interface ManagerSquad {
  starters: SquadPlayer[];
  bench: SquadPlayer[];
}

export interface SquadComparison {
  gameweek: number;
  managerIds: string[];
  squads: Record<string, ManagerSquad>;
}

const POS: Record<number, PlayerPosition> = { 1: "GKP", 2: "DEF", 3: "MID", 4: "FWD" };
const POS_ORDER: Record<PlayerPosition, number> = { GKP: 0, DEF: 1, MID: 2, FWD: 3 };

interface Pick {
  element: number;
  position: number; // 1-11 starters, 12-15 bench
  is_captain: boolean;
  is_vice_captain: boolean;
}

const pickStatus = (p: Pick): PickStatus =>
  p.is_captain ? "C" : p.is_vice_captain ? "VC" : p.position <= 11 ? "XI" : "B";

/**
 * Load each manager's squad (starting XI + bench) for the current gameweek,
 * flagging players owned by more than one of the compared managers so the UI can
 * highlight the common picks.
 */
export const fetchSquadComparison = async (
  managerIds: string[]
): Promise<SquadComparison> => {
  const ids = managerIds.map((s) => s.trim()).filter(Boolean);

  const gw = await fetchCurrentGameweek();

  const bsRes = await fetch(getApiEndpoint("/bootstrap-static"));
  if (!bsRes.ok) throw new Error("Failed to load player data");
  const bs = await bsRes.json();
  const elMap = new Map<number, { web_name: string; team: number; element_type: number }>(
    (bs.elements ?? []).map((e: { id: number }) => [e.id, e])
  );
  const teamShort = new Map<number, string>(
    (bs.teams ?? []).map((t: { id: number; short_name: string }) => [t.id, t.short_name])
  );

  const picksList = await Promise.all(
    ids.map(async (id) => {
      const res = await fetch(getApiEndpoint(`/entry/${id}/event/${gw}/picks`));
      if (!res.ok) return { id, picks: [] as Pick[] };
      const data = await res.json();
      return { id, picks: (data.picks ?? []) as Pick[] };
    })
  );

  // Count ownership across managers -> players owned by >1 are "common".
  const ownership = new Map<number, number>();
  for (const { picks } of picksList) {
    for (const p of picks) ownership.set(p.element, (ownership.get(p.element) ?? 0) + 1);
  }

  const squads: Record<string, ManagerSquad> = {};
  for (const { id, picks } of picksList) {
    const players: SquadPlayer[] = picks.map((p) => {
      const el = elMap.get(p.element);
      return {
        elementId: p.element,
        name: el?.web_name ?? `Player ${p.element}`,
        teamShort: (el && teamShort.get(el.team)) || "",
        position: (el && POS[el.element_type]) || "MID",
        status: pickStatus(p),
        slot: p.position,
        isCommon: (ownership.get(p.element) ?? 0) > 1,
      };
    });

    const starters = players
      .filter((pl) => pl.slot <= 11)
      .sort((a, b) => POS_ORDER[a.position] - POS_ORDER[b.position] || a.slot - b.slot);
    const bench = players.filter((pl) => pl.slot > 11).sort((a, b) => a.slot - b.slot);

    squads[id] = { starters, bench };
  }

  return { gameweek: gw, managerIds: ids, squads };
};

export const fetchManagerSummary = async (
  managerId: string
): Promise<ManagerSummary> => {
  const id = managerId.trim();
  const [entryRes, historyRes] = await Promise.all([
    fetch(getApiEndpoint(`/entry/${id}`)),
    fetch(getApiEndpoint(`/entry/${id}/history`)),
  ]);

  if (!entryRes.ok) {
    throw new Error(
      entryRes.status === 404
        ? `Manager ${id} not found`
        : `Failed to load manager ${id} (${entryRes.status})`
    );
  }

  const entry: EntryResponse = await entryRes.json();
  const history: HistoryResponse = historyRes.ok
    ? await historyRes.json()
    : { current: [], chips: [] };

  return {
    id: entry.id,
    teamName: entry.name,
    managerName: `${entry.player_first_name} ${entry.player_last_name}`.trim(),
    overallPoints: entry.summary_overall_points ?? 0,
    overallRank: entry.summary_overall_rank ?? null,
    gwPoints: entry.summary_event_points ?? 0,
    gwRank: entry.summary_event_rank ?? null,
    currentEvent: entry.current_event ?? 0,
    bank: (entry.last_deadline_bank ?? 0) / 10,
    squadValue: (entry.last_deadline_value ?? 0) / 10,
    totalTransfers: entry.last_deadline_total_transfers ?? 0,
    freeTransfers: estimateFreeTransfers(history),
  };
};
