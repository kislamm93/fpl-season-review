
import React from "react";
import { useManagerLeagues } from "@/hooks/useManagerLeagues";
import { STORAGE_KEYS, getFromLocalStorage } from "@/lib/localStorage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {leagues.map((league) => (
          <Card key={`${league.league_type}-${league.id}`} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{league.name}</CardTitle>
              <CardDescription>
                Type: {league.league_type === "c" ? "Classic" : "Head-to-Head"} • 
                Scoring: {league.scoring} • 
                Rank: {league.rank || "N/A"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <span className="font-medium">League ID:</span> {league.id}
              </div>
              <div className="mt-2">
                <a 
                  href={`/league-standings/${league.id}`} 
                  className="text-primary hover:underline text-sm"
                >
                  View Full Standings
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MiniLeaguePreview;
