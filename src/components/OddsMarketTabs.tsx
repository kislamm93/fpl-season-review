/**
 * The three betting-market tabs that read the cached snapshot: goalscorers,
 * clean sheets and the goals market. Win Probability stays in OddsList, which
 * has its own data source and predates this.
 *
 * Everything here renders from one /odds/markets fetch, so switching tabs costs
 * nothing. An empty snapshot is a real state, not an error — the backend starts
 * empty after a redeploy until someone refreshes.
 */
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  fetchMarkets,
  refreshMarkets,
  getAdminKey,
  setAdminKey,
  type GoalscorerMarket,
  type MatchMarket,
} from "@/services/oddsMarkets";

const pct = (v: number | null | undefined) => (v == null ? "—" : `${v.toFixed(1)}%`);

/** Green for likely, amber for middling, muted for long shots. */
const heat = (v: number | null | undefined, good: number, mid: number) => {
  if (v == null) return "text-muted-foreground";
  if (v >= good) return "text-emerald-600 dark:text-emerald-400 font-semibold";
  if (v >= mid) return "text-amber-600 dark:text-amber-400";
  return "text-muted-foreground";
};

/** Official FPL FDR: 1-2 easy, 3 neutral, 4-5 hard. */
const fdrClass = (d: number | null) => {
  if (d == null) return "bg-muted text-muted-foreground";
  if (d <= 2) return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300";
  if (d === 3) return "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300";
  return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300";
};

const since = (ts: number | null) => {
  if (!ts) return "never";
  const mins = Math.round((Date.now() - ts * 1000) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  return hrs < 24 ? `${hrs}h ago` : `${Math.round(hrs / 24)}d ago`;
};

export const RefreshBar: React.FC = () => {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["odds-markets"], queryFn: fetchMarkets });

  const mutation = useMutation({
    mutationFn: async () => {
      // Prompted rather than stored in the build: the key gates spend, so it
      // shouldn't ship in a public bundle.
      let key = getAdminKey();
      if (!key) {
        key = window.prompt("Admin key (needed to spend Odds API credits)")?.trim() || "";
        if (!key) throw new Error("Cancelled");
        setAdminKey(key);
      }
      return refreshMarkets(key);
    },
    onSuccess: (snap) => {
      qc.setQueryData(["odds-markets"], snap);
      toast.success(
        `Refreshed GW${snap.gameweek} — ${snap.goalscorers.length} players, ${snap.credits_spent_this_refresh ?? "?"} credits spent`
      );
    },
    onError: (err: Error) => {
      if (err.message === "Cancelled") return;
      toast.error(err.message);
    },
  });

  return (
    <div className="flex items-center gap-3 flex-wrap text-sm text-muted-foreground">
      <span>
        {data?.gameweek ? `Gameweek ${data.gameweek}` : "No snapshot"} · updated{" "}
        {since(data?.last_updated ?? null)}
      </span>
      {data?.credits_used != null && (
        <Badge variant="outline">{500 - data.credits_used} credits left</Badge>
      )}
      <Button
        size="sm"
        variant="outline"
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending}
      >
        <RefreshCw className={`h-3.5 w-3.5 mr-2 ${mutation.isPending ? "animate-spin" : ""}`} />
        {mutation.isPending ? "Refreshing…" : "Refresh odds"}
      </Button>
    </div>
  );
};

const Empty: React.FC<{ what: string }> = ({ what }) => (
  <Card>
    <CardContent className="py-10 text-center text-muted-foreground">
      <p>No {what} loaded yet.</p>
      <p className="text-sm mt-1">Hit “Refresh odds” above to pull the latest prices.</p>
    </CardContent>
  </Card>
);

const Loading: React.FC = () => (
  <div className="space-y-2">
    {Array.from({ length: 6 }).map((_, i) => (
      <Skeleton key={i} className="h-10 w-full" />
    ))}
  </div>
);

/** Anytime-goalscorer odds — the captaincy tab. */
export const GoalscorersTab: React.FC = () => {
  const { data, isLoading } = useQuery({ queryKey: ["odds-markets"], queryFn: fetchMarkets });
  const [posFilter, setPosFilter] = React.useState<string>("ALL");

  if (isLoading) return <Loading />;
  const rows = data?.goalscorers ?? [];
  if (!rows.length) return <Empty what="goalscorer odds" />;

  const shown = posFilter === "ALL" ? rows : rows.filter((r) => r.position === posFilter);

  return (
    <div className="space-y-3">
      <div className="flex gap-2 flex-wrap">
        {["ALL", "FWD", "MID", "DEF", "GKP"].map((p) => (
          <Button
            key={p}
            size="sm"
            variant={posFilter === p ? "default" : "outline"}
            onClick={() => setPosFilter(p)}
          >
            {p}
          </Button>
        ))}
      </div>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Anytime goalscorer</CardTitle>
          <p className="text-sm text-muted-foreground">
            The bookmakers' price already accounts for whether he starts, who takes
            penalties and the opponent — which is why it beats guessing from a team's
            win chance.
          </p>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Player</TableHead>
                  <TableHead>Fixture</TableHead>
                  <TableHead className="text-right">Anytime</TableHead>
                  <TableHead className="text-right">Shot&nbsp;on&nbsp;target</TableHead>
                  <TableHead className="text-right">xGI/90</TableHead>
                  <TableHead className="text-right">Starts/90</TableHead>
                  <TableHead className="text-right">£</TableHead>
                  <TableHead className="text-right">Owned</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shown.slice(0, 60).map((r: GoalscorerMarket) => (
                  <TableRow key={`${r.event_id}-${r.player_id}`}>
                    <TableCell className="whitespace-nowrap">
                      <span className="font-medium">{r.name}</span>
                      <span className="text-muted-foreground text-xs ml-1.5">
                        {r.team} · {r.position}
                      </span>
                      {r.doubt && (
                        <Badge variant="destructive" className="ml-2 text-[10px]">
                          doubt
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm">
                      {r.is_home ? "vs" : "@"} {r.opponent}
                      <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] ${fdrClass(r.difficulty)}`}>
                        d{r.difficulty ?? "?"}
                      </span>
                    </TableCell>
                    <TableCell className={`text-right tabular-nums ${heat(r.anytime_pct, 35, 20)}`}>
                      {pct(r.anytime_pct)}
                      <span className="text-muted-foreground text-[10px] ml-1">
                        {r.books}b
                      </span>
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-sm">
                      {r.sot_over_0_5_pct ? pct(r.sot_over_0_5_pct) : "—"}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-sm">
                      {r.xgi_per_90 ? r.xgi_per_90.toFixed(2) : "—"}
                    </TableCell>
                    <TableCell
                      className={`text-right tabular-nums text-sm ${
                        r.starts_per_90 && r.starts_per_90 < 0.9 ? "text-amber-600 dark:text-amber-400" : ""
                      }`}
                    >
                      {r.starts_per_90 ? r.starts_per_90.toFixed(2) : "—"}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-sm">{r.price.toFixed(1)}</TableCell>
                    <TableCell className="text-right tabular-nums text-sm text-muted-foreground">
                      {r.owned_pct.toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {!!data?.unmatched_players.length && (
        <p className="text-xs text-muted-foreground">
          {data.unmatched_players.length} priced name(s) couldn't be matched to an FPL
          player and were left out rather than guessed: {data.unmatched_players.join(", ")}
        </p>
      )}
    </div>
  );
};

/** Clean-sheet probability per team — the defence tab. */
export const CleanSheetsTab: React.FC = () => {
  const { data, isLoading } = useQuery({ queryKey: ["odds-markets"], queryFn: fetchMarkets });
  if (isLoading) return <Loading />;
  const matches = data?.matches ?? [];
  if (!matches.length) return <Empty what="clean-sheet odds" />;

  const teams = matches
    .flatMap((m) => [
      { team: m.home, opponent: m.away, isHome: true, cs: m.home_cs_pct, d: m.home_difficulty, btts: m.btts_no_pct },
      { team: m.away, opponent: m.home, isHome: false, cs: m.away_cs_pct, d: m.away_difficulty, btts: m.btts_no_pct },
    ])
    .sort((a, b) => (b.cs ?? 0) - (a.cs ?? 0));

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Clean sheet probability</CardTitle>
        <p className="text-sm text-muted-foreground">
          Derived from the both-teams-to-score market, split by each side's win
          chance — a stronger favourite takes the larger share of the "no BTTS"
          probability. For defenders and keepers.
        </p>
      </CardHeader>
      <CardContent className="px-0 sm:px-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team</TableHead>
                <TableHead>Fixture</TableHead>
                <TableHead className="text-right">Clean sheet</TableHead>
                <TableHead className="text-right">No BTTS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams.map((t) => (
                <TableRow key={`${t.team}-${t.opponent}`}>
                  <TableCell className="font-medium">{t.team}</TableCell>
                  <TableCell className="whitespace-nowrap text-sm">
                    {t.isHome ? "vs" : "@"} {t.opponent}
                    <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] ${fdrClass(t.d)}`}>
                      d{t.d ?? "?"}
                    </span>
                  </TableCell>
                  <TableCell className={`text-right tabular-nums ${heat(t.cs, 30, 20)}`}>
                    {pct(t.cs)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-sm text-muted-foreground">
                    {pct(t.btts)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

/** Over/under, BTTS and handicap — game-state context. */
export const GoalsMarketTab: React.FC = () => {
  const { data, isLoading } = useQuery({ queryKey: ["odds-markets"], queryFn: fetchMarkets });
  if (isLoading) return <Loading />;
  const matches = data?.matches ?? [];
  if (!matches.length) return <Empty what="goals markets" />;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Goals market</CardTitle>
        <p className="text-sm text-muted-foreground">
          How open the game is expected to be. High over-2.5 favours attackers;
          a big handicap means one side is expected to dominate, which lifts both
          its attackers and its clean-sheet chance.
        </p>
      </CardHeader>
      <CardContent className="px-0 sm:px-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fixture</TableHead>
                <TableHead className="text-right">Over 2.5</TableHead>
                <TableHead className="text-right">Under 2.5</TableHead>
                <TableHead className="text-right">BTTS yes</TableHead>
                <TableHead className="text-right">Handicap</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matches.map((m: MatchMarket) => (
                <TableRow key={m.event_id}>
                  <TableCell className="whitespace-nowrap font-medium">
                    {m.home} v {m.away}
                  </TableCell>
                  <TableCell className={`text-right tabular-nums ${heat(m.over_2_5_pct, 60, 50)}`}>
                    {pct(m.over_2_5_pct)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-sm">
                    {pct(m.under_2_5_pct)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-sm">
                    {pct(m.btts_yes_pct)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-sm text-muted-foreground">
                    {m.handicap == null ? "—" : m.handicap > 0 ? `+${m.handicap}` : m.handicap}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
