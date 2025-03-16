
import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchLeagueStandings, fetchLeagueParticipants } from "@/services/leagueService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowUp, ArrowDown, ExternalLink, Eye } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { STORAGE_KEYS, saveToLocalStorage } from "@/lib/localStorage";
import { toast } from "@/components/ui/use-toast";
import LeagueRankChart from "@/components/LeagueRankChart";

const LeagueDetails = () => {
  const { leagueId } = useParams<{ leagueId: string }>();
  const navigate = useNavigate();
  
  const { data: leagueData, isLoading, error } = useQuery({
    queryKey: ["league-standings", leagueId],
    queryFn: () => fetchLeagueStandings(Number(leagueId)),
    enabled: !!leagueId,
  });

  const { 
    data: participantsData, 
    isLoading: isParticipantsLoading, 
    error: participantsError
  } = useQuery({
    queryKey: ["league-participants", leagueId],
    queryFn: () => fetchLeagueParticipants(Number(leagueId)),
    enabled: !!leagueId,
  });

  const handleRowClick = (entryId: number) => {
    window.open(`https://fantasy.premierleague.com/entry/${entryId}/history`, '_blank');
  };
  
  const handleViewManager = (e: React.MouseEvent, entryId: number) => {
    e.stopPropagation(); // Prevent the row click from firing
    saveToLocalStorage(STORAGE_KEYS.MANAGER_ID, entryId.toString());
    
    // Dispatch event to notify other components about the change
    window.dispatchEvent(new Event('local-storage-change'));
    
    toast({
      title: "Manager ID Updated",
      description: `Viewing manager with ID: ${entryId}`,
    });
    
    navigate('/manager-history');
  };

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
                  <TableHead className="text-center w-16">View</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leagueData.standings.results.map((entry) => {
                  const rankChange = entry.last_rank - entry.rank;
                  
                  return (
                    <TableRow 
                      key={entry.entry}
                      onClick={() => handleRowClick(entry.entry)}
                      className="cursor-pointer hover:bg-accent/50 transition-colors"
                    >
                      <TableCell>{entry.rank}</TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-1">
                          {entry.entry_name}
                          <ExternalLink size={14} className="text-muted-foreground" />
                        </div>
                      </TableCell>
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
                      <TableCell className="text-center">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                          onClick={(e) => handleViewManager(e, entry.entry)}
                        >
                          <Eye size={16} />
                          <span className="sr-only">View manager history</span>
                        </Button>
                      </TableCell>
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
      
      <div className="mt-8">
        <LeagueRankChart 
          data={participantsData} 
          isLoading={isParticipantsLoading} 
          error={participantsError as Error | null} 
        />
      </div>
    </div>
  );
};

export default LeagueDetails;
