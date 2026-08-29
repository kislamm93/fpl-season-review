
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getApiEndpoint } from "@/lib/env";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import OddsListItem from "./OddsListItem";
import { OddsData } from "@/types/odds";

const fetchOdds = async (): Promise<OddsData[]> => {
  // Both dev and prod hit our backend (localhost / Render) via getApiEndpoint.
  const response = await fetch(getApiEndpoint("/odds/upcoming"));
  if (!response.ok) {
    throw new Error("Failed to fetch odds data");
  }
  return await response.json();
};

const OddsList = () => {
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["upcoming-odds"],
    queryFn: fetchOdds,
  });

  const handleToggleExpand = (matchId: string) => {
    setExpandedMatchId(expandedMatchId === matchId ? null : matchId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="my-4">
        <CardContent className="p-6">
          <div className="text-center text-destructive">
            <p>Failed to load odds data. Please try again later.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Check if data exists and has items
  if (!data || data.length === 0) {
    return (
      <Card className="my-4">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <p>No upcoming matches found.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group matches by date
  const matchesByDate: Record<string, OddsData[]> = {};
  
  data.forEach((match) => {
    const matchDate = new Date(match.commence_time);
    const dateKey = format(matchDate, "yyyy-MM-dd");
    
    if (!matchesByDate[dateKey]) {
      matchesByDate[dateKey] = [];
    }
    
    matchesByDate[dateKey].push(match);
  });

  // Sort dates in ascending order
  const sortedDates = Object.keys(matchesByDate).sort();

  return (
    <div className="space-y-6">
      {sortedDates.length > 0 ? (
        sortedDates.map((dateKey) => {
          const matches = matchesByDate[dateKey];
          const formattedDate = format(new Date(dateKey), "EEEE, MMMM d, yyyy");
          
          return (
            <div key={dateKey} className="space-y-2">
              <h3 className="text-lg font-semibold">{formattedDate}</h3>
              <div className="space-y-2">
                {matches.map((match) => (
                  <OddsListItem 
                    key={match.id} 
                    match={match}
                    isExpanded={expandedMatchId === match.id}
                    onToggle={() => handleToggleExpand(match.id)}
                  />
                ))}
              </div>
            </div>
          );
        })
      ) : (
        <Card className="my-4">
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">
              <p>No upcoming matches found.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OddsList;
