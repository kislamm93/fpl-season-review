import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TickerCell } from "@/types/ticker";
import { fetchCurrentGameweek, fetchTicker } from "@/services/tickerService";

const WINDOW = 5; // gameweeks shown per page
const MAX_GW = 38;

// Official FDR: 1 (easy) -> 5 (hard). Discrete, high-contrast palette.
const FDR_COLORS: Record<number, { bg: string; fg: string }> = {
  1: { bg: "#12a150", fg: "#ffffff" }, // deep green
  2: { bg: "#8fe388", fg: "#0b3d16" }, // light green
  3: { bg: "#ffd93d", fg: "#4a3b00" }, // amber
  4: { bg: "#ff7a3d", fg: "#ffffff" }, // orange
  5: { bg: "#d11149", fg: "#ffffff" }, // deep red
};

const difficultyStyle = (d: number): React.CSSProperties => {
  const { bg, fg } = FDR_COLORS[Math.max(1, Math.min(5, d))] ?? FDR_COLORS[3];
  return { backgroundColor: bg, color: fg };
};

const CellChip = ({ cell }: { cell: TickerCell }) => (
  <div
    className="rounded px-1.5 py-1 text-xs font-medium leading-tight text-center"
    style={difficultyStyle(cell.difficulty)}
    title={`${cell.opponent_short} ${cell.is_home ? "(H)" : "(A)"} · FDR ${cell.difficulty}`}
  >
    {cell.opponent_short}
    <span className="opacity-80"> {cell.is_home ? "H" : "A"}</span>
    <div className="opacity-90">{cell.difficulty}</div>
  </div>
);

const FixtureTicker = () => {
  const [startGw, setStartGw] = useState<number>(1);
  const [initialized, setInitialized] = useState(false);

  // start the window at the current/next gameweek
  useEffect(() => {
    fetchCurrentGameweek().then((gw) => {
      setStartGw(gw);
      setInitialized(true);
    });
  }, []);

  const fromGw = startGw;
  const toGw = Math.min(MAX_GW, startGw + WINDOW - 1);

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["ticker", fromGw, toGw],
    queryFn: () => fetchTicker(fromGw, toGw),
    enabled: initialized,
  });

  const canPrev = startGw > 1;
  const canNext = startGw + WINDOW <= MAX_GW;
  const goPrev = () => setStartGw((s) => Math.max(1, s - WINDOW));
  const goNext = () => setStartGw((s) => Math.min(MAX_GW - WINDOW + 1, s + WINDOW));

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Fixture Ticker | FPL Analytics</title>
      </Helmet>

      <h1 className="text-3xl font-bold mb-2">Fixture Ticker</h1>
      <p className="text-muted-foreground mb-6">
        Official FPL fixture difficulty (FDR), ranked easiest → hardest. Lower / greener = easier.
      </p>

      {/* GW window pager */}
      <div className="flex items-center gap-3 mb-4">
        <Button variant="outline" size="sm" onClick={goPrev} disabled={!canPrev}>
          <ChevronLeft className="h-4 w-4" /> Prev {WINDOW}
        </Button>
        <span className="font-medium">
          GW {fromGw}
          {toGw !== fromGw && `–${toGw}`}
        </span>
        <Button variant="outline" size="sm" onClick={goNext} disabled={!canNext}>
          Next {WINDOW} <ChevronRight className="h-4 w-4" />
        </Button>
        {isFetching && <span className="text-sm text-muted-foreground">updating…</span>}
      </div>

      {isLoading && <p>Loading fixtures…</p>}
      {error && (
        <p className="text-destructive">
          Could not load the ticker. Is the backend running?
        </p>
      )}

      {data && (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 bg-background min-w-[140px]">
                  Team
                </TableHead>
                {data.gameweeks.map((gw) => (
                  <TableHead key={gw} className="text-center min-w-[64px]">
                    GW{gw}
                  </TableHead>
                ))}
                <TableHead className="text-center">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.rows.map((row) => (
                <TableRow key={row.team_id}>
                  <TableCell className="sticky left-0 bg-background font-medium">
                    {row.short_name}
                    {row.fixture_count === 0 && (
                      <span className="ml-1 text-xs text-muted-foreground">(blank)</span>
                    )}
                  </TableCell>
                  {data.gameweeks.map((gw) => {
                    const cells = row.cells[String(gw)] ?? [];
                    return (
                      <TableCell key={gw} className="p-1 align-top">
                        {cells.length === 0 ? (
                          <div className="text-center text-muted-foreground">–</div>
                        ) : (
                          <div className="flex flex-col gap-1">
                            {cells.map((c, i) => (
                              <CellChip key={i} cell={c} />
                            ))}
                          </div>
                        )}
                      </TableCell>
                    );
                  })}
                  <TableCell className="text-center font-semibold">
                    {row.total}
                    <span className="block text-xs font-normal text-muted-foreground">
                      {row.fixture_count} fix
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default FixtureTicker;
