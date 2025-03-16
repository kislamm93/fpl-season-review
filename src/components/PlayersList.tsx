
import React, { useState } from "react";
import { useFplData } from "@/hooks/useFplData";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

const PlayersList = () => {
  const { players, isLoading, error, getTeamName, getPositionName, formatPrice } = useFplData();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter players based on search query
  const filteredPlayers = players.filter(player => {
    const fullName = `${player.first_name} ${player.second_name}`.toLowerCase();
    const teamName = getTeamName(player.team).toLowerCase();
    const query = searchQuery.toLowerCase();
    
    return fullName.includes(query) || 
           teamName.includes(query) || 
           player.web_name.toLowerCase().includes(query);
  });
  
  // Sort players by total points (descending)
  const sortedPlayers = [...filteredPlayers].sort((a, b) => b.total_points - a.total_points);
  
  // Take top 50 players for performance
  const displayPlayers = sortedPlayers.slice(0, 50);

  if (error) {
    return (
      <Card className="w-full shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">FPL Players</CardTitle>
          <CardDescription>
            Error loading player data. Please try again later.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">Top FPL Players</CardTitle>
        <CardDescription>
          Showing top 50 players by total points
        </CardDescription>
        
        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground/70" />
          <Input
            placeholder="Search players or teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <div className="overflow-auto max-h-[500px] rounded-md border">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead className="w-12">Rank</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Pos</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Pts</TableHead>
                  <TableHead className="text-right">G</TableHead>
                  <TableHead className="text-right">A</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayPlayers.map((player, index) => (
                  <TableRow key={player.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{player.web_name}</TableCell>
                    <TableCell>{getTeamName(player.team)}</TableCell>
                    <TableCell>{getPositionName(player.element_type)}</TableCell>
                    <TableCell className="text-right">{formatPrice(player.now_cost)}</TableCell>
                    <TableCell className="text-right font-medium">{player.total_points}</TableCell>
                    <TableCell className="text-right">{player.goals_scored}</TableCell>
                    <TableCell className="text-right">{player.assists}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayersList;
