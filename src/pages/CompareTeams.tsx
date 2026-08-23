import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQueries, useQuery } from "@tanstack/react-query";
import { Users, Wallet, ArrowLeftRight, Trophy, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  fetchManagerSummary,
  fetchSquadComparison,
  ManagerSquad,
  ManagerSummary,
  SquadPlayer,
} from "@/services/managerCompareService";

const SLOTS = [0, 1, 2];
// Hard-coded defaults for now — the page auto-loads these on open.
const DEFAULT_IDS = ["2480583", "6313741", "2483292"];

const fmtRank = (r: number | null) => (r == null ? "–" : r.toLocaleString());
const fmtMoney = (m: number) => `£${m.toFixed(1)}m`;

const StatRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-center justify-between py-2 border-b last:border-0">
    <span className="flex items-center gap-2 text-sm text-muted-foreground">
      {icon}
      {label}
    </span>
    <span className="font-semibold tabular-nums">{value}</span>
  </div>
);

const TeamCard = ({ summary }: { summary: ManagerSummary }) => (
  <div className="rounded-lg border bg-card p-4">
    <div className="mb-3">
      <h3 className="font-bold text-lg leading-tight">{summary.teamName}</h3>
      <p className="text-sm text-muted-foreground">{summary.managerName}</p>
    </div>
    <StatRow icon={<Trophy className="h-4 w-4" />} label="Overall points" value={summary.overallPoints.toLocaleString()} />
    <StatRow icon={<Hash className="h-4 w-4" />} label="Overall rank" value={fmtRank(summary.overallRank)} />
    <StatRow icon={<Trophy className="h-4 w-4" />} label={`GW${summary.currentEvent || ""} points`} value={summary.gwPoints} />
    <StatRow icon={<Wallet className="h-4 w-4" />} label="In the bank" value={fmtMoney(summary.bank)} />
    <StatRow icon={<Wallet className="h-4 w-4" />} label="Squad value" value={fmtMoney(summary.squadValue)} />
    <StatRow icon={<ArrowLeftRight className="h-4 w-4" />} label="Free transfers" value={`${summary.freeTransfers} (est.)`} />
    <StatRow icon={<ArrowLeftRight className="h-4 w-4" />} label="Total transfers" value={summary.totalTransfers} />
  </div>
);

const PlayerRow = ({ player }: { player: SquadPlayer }) => (
  <div
    className={
      "flex items-center justify-between gap-2 rounded px-2 py-1 text-sm " +
      (player.isCommon ? "bg-primary/15 font-medium" : "")
    }
  >
    <span className="truncate">
      {player.name}
      <span className="ml-1 text-xs text-muted-foreground">{player.teamShort}</span>
    </span>
    <span className="flex shrink-0 items-center gap-1">
      <span className="text-xs text-muted-foreground">{player.position}</span>
      {player.status === "C" && (
        <span className="rounded bg-primary px-1 text-xs font-bold text-primary-foreground">C</span>
      )}
      {player.status === "VC" && (
        <span className="rounded bg-secondary px-1 text-xs font-bold text-secondary-foreground">VC</span>
      )}
    </span>
  </div>
);

const SquadColumn = ({
  title,
  squad,
}: {
  title: string;
  squad: ManagerSquad;
}) => (
  <div className="rounded-lg border bg-card p-4">
    <h3 className="mb-3 font-bold">{title}</h3>
    <div className="space-y-0.5">
      {squad.starters.map((p) => (
        <PlayerRow key={p.elementId} player={p} />
      ))}
    </div>
    <div className="my-2 border-t pt-2 text-xs uppercase tracking-wide text-muted-foreground">
      Bench
    </div>
    <div className="space-y-0.5">
      {squad.bench.map((p) => (
        <PlayerRow key={p.elementId} player={p} />
      ))}
    </div>
  </div>
);

const CompareTeams = () => {
  const [inputs, setInputs] = useState<string[]>([...DEFAULT_IDS]);
  const [ids, setIds] = useState<string[]>([...DEFAULT_IDS]);

  const results = useQueries({
    queries: ids.map((id) => ({
      queryKey: ["manager-summary", id],
      queryFn: () => fetchManagerSummary(id),
      staleTime: 60_000,
    })),
  });

  const squad = useQuery({
    queryKey: ["squad-comparison", ids],
    queryFn: () => fetchSquadComparison(ids),
    enabled: ids.length > 0,
    staleTime: 60_000,
  });

  // Map manager id -> team name for the squad table header (falls back to the id).
  const teamNameById = new Map(
    ids.map((id, i) => [id, results[i]?.data?.teamName ?? `#${id}`])
  );

  const compare = () => {
    const cleaned = inputs.map((s) => s.trim()).filter(Boolean);
    setIds(cleaned);
  };

  const setInput = (i: number, v: string) =>
    setInputs((prev) => prev.map((x, idx) => (idx === i ? v : x)));

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Compare Teams | FPL Analytics</title>
      </Helmet>

      <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
        <Users className="h-7 w-7" /> Compare Teams
      </h1>
      <p className="text-muted-foreground mb-6">
        Enter up to three manager IDs to see their teams side by side.
      </p>

      <div className="flex flex-wrap items-end gap-4 mb-8">
        {SLOTS.map((i) => (
          <div key={i} className="grid gap-1.5">
            <Label htmlFor={`mgr-${i}`}>Manager ID {i + 1}</Label>
            <Input
              id={`mgr-${i}`}
              inputMode="numeric"
              placeholder="e.g. 1234567"
              value={inputs[i]}
              onChange={(e) => setInput(i, e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && compare()}
              className="w-40"
            />
          </div>
        ))}
        <Button onClick={compare} disabled={inputs.every((s) => !s.trim())}>
          Compare
        </Button>
      </div>

      {ids.length === 0 ? (
        <p className="text-muted-foreground">
          Add at least one manager ID and hit Compare.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ids.map((id, i) => {
            const q = results[i];
            return (
              <div key={id}>
                {q?.isLoading && (
                  <div className="rounded-lg border bg-card p-4 text-muted-foreground">
                    Loading manager {id}…
                  </div>
                )}
                {q?.isError && (
                  <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-destructive">
                    {(q.error as Error).message}
                  </div>
                )}
                {q?.data && <TeamCard summary={q.data} />}
              </div>
            );
          })}
        </div>
      )}

      {ids.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
            <Users className="h-6 w-6" /> Squads
            {squad.data && (
              <span className="text-base font-normal text-muted-foreground">
                — GW{squad.data.gameweek}
              </span>
            )}
          </h2>
          <p className="text-muted-foreground mb-4">
            Starting XI &amp; bench. Players owned by more managers are listed first, so
            common picks line up together.
          </p>

          {squad.isLoading && <p className="text-muted-foreground">Loading squads…</p>}
          {squad.isError && (
            <p className="text-destructive">{(squad.error as Error).message}</p>
          )}

          {squad.data && (
            <>
              <p className="mb-3 text-sm text-muted-foreground">
                <span className="mr-1 inline-block rounded bg-primary/15 px-2 py-0.5 font-medium">
                  Highlighted
                </span>
                = player owned by more than one manager.
              </p>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {ids.map((id) => {
                  const s = squad.data!.squads[id];
                  if (!s) return null;
                  return (
                    <SquadColumn key={id} title={teamNameById.get(id) ?? `#${id}`} squad={s} />
                  );
                })}
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
};

export default CompareTeams;
