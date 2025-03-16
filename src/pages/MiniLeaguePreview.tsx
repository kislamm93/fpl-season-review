
import React from "react";
import { useManagerLeagues } from "@/hooks/useManagerLeagues";
import { STORAGE_KEYS, getFromLocalStorage } from "@/lib/localStorage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUp, ArrowDown } from "lucide-react";

const MiniLeaguePreview = () => {
  const managerId = getFromLocalStorage<string | null>(STORAGE_KEYS.MANAGER_ID, null);
  const { leagues, isLoading, error } = useManagerLeagues(managerId);

  if (!managerId) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Mini League Preview</h1>
        <Card>
          <CardHeader>
            <CardTitle>No Manager ID</CardTitle>
            <CardDescription>
              Please set your Manager ID on the home page to view your mini leagues.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Mini League Preview</h1>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Mini League Preview</h1>
        <Card className="bg-destructive/10">
          <CardHeader>
            <CardTitle>Error loading leagues</CardTitle>
            <CardDescription>
              There was a problem fetching your leagues. Please try again later.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{error instanceof Error ? error.message : "Unknown error"}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (leagues.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Mini League Preview</h1>
        <Card>
          <CardHeader>
            <CardTitle>No leagues found</CardTitle>
            <CardDescription>
              You are not currently participating in any mini leagues.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mini League Preview</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Mini Leagues</CardTitle>
          <CardDescription>
            List of leagues you are currently participating in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>League Name</TableHead>
                <TableHead>League ID</TableHead>
                <TableHead>Current Rank</TableHead>
                <TableHead>Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leagues.map((league) => (
                <TableRow key={`${league.league_type}-${league.id}`}>
                  <TableCell className="font-medium">{league.name}</TableCell>
                  <TableCell>{league.id}</TableCell>
                  <TableCell>{league.entry_rank || "N/A"}</TableCell>
                  <TableCell>
                    {league.entry_rank && league.entry_last_rank && (
                      league.entry_rank <= league.entry_last_rank ? (
                        <ArrowUp className="text-green-500" size={16} />
                      ) : (
                        <ArrowDown className="text-red-500" size={16} />
                      )
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MiniLeaguePreview;
