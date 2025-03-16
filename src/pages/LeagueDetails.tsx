
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchLeagueStandings } from "@/services/leagueService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowUp, ArrowDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const LeagueDetails = () => {
  const { leagueId } = useParams<{ leagueId: string }>();
  
  const { data: leagueData, isLoading, error } = useQuery({
    queryKey: ["league-standings", leagueId],
    queryFn: () => fetchLeagueStandings(Number(leagueId)),
    enabled: !!leagueId,
  });

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      );
    }

    if (error) {
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="text-destructive">
              Error loading league data. Please try again later.
            </div>
          </CardContent>
        </Card>
      );
    }

    if (!leagueData) {
      return (
        <Card>
          <CardContent className="pt-6">
            <div>No league data available.</div>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Previous Rank</TableHead>
                  <TableHead>Trend</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leagueData.standings.results.map((entry) => {
                  const rankChange = entry.last_rank - entry.rank;
                  
                  return (
                    <TableRow key={entry.entry}>
                      <TableCell>{entry.rank}</TableCell>
                      <TableCell className="font-medium">{entry.entry_name}</TableCell>
                      <TableCell>{entry.player_name}</TableCell>
                      <TableCell>{entry.last_rank}</TableCell>
                      <TableCell>
                        {rankChange > 0 ? (
                          <div className="flex items-center">
                            <ArrowUp className="text-green-500 mr-1" size={16} />
                            <span className="text-green-500">+{rankChange}</span>
                          </div>
                        ) : rankChange < 0 ? (
                          <div className="flex items-center">
                            <ArrowDown className="text-red-500 mr-1" size={16} />
                            <span className="text-red-500">{rankChange}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">{entry.total}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Link to="/mini-league-preview">
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="mr-2" size={16} />
            Back to Leagues
          </Button>
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">
        {isLoading ? "Loading league..." : leagueData ? leagueData.league.name : "League Details"}
      </h1>
      
      {renderContent()}
    </div>
  );
};

export default LeagueDetails;
