
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getApiEndpoint } from "@/lib/env";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import OddsListItem from "./OddsListItem";
import { OddsData } from "@/types/odds";

const fetchOdds = async (): Promise<OddsData[]> => {
  // For development, use the local endpoint
  // For production, use a mock data since the fantasy.premierleague.com API doesn't have this endpoint
  const isDevelopment = import.meta.env.DEV;
  
  try {
    if (isDevelopment) {
      const response = await fetch(getApiEndpoint("/odds/upcoming"));
      if (!response.ok) {
        throw new Error("Failed to fetch odds data");
      }
      return await response.json();
    } else {
      // Mock data for production
      return mockUpcomingOdds;
    }
  } catch (error) {
    console.error("Error fetching odds data:", error);
    return mockUpcomingOdds;
  }
};

// Mock data for when in production
const mockUpcomingOdds: OddsData[] = [
  {
    id: "1",
    sport_key: "soccer_epl",
    sport_title: "EPL",
    commence_time: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    home_team: "Manchester United",
    away_team: "Liverpool",
    combined_market_odds: {
      "manchester united": { name: "manchester united", price: 3.5, implied_probability: 28.6 },
      "liverpool": { name: "liverpool", price: 2.0, implied_probability: 50.0 },
      "draw": { name: "draw", price: 3.7, implied_probability: 27.0 }
    }
  },
  {
    id: "2",
    sport_key: "soccer_epl",
    sport_title: "EPL",
    commence_time: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
    home_team: "Arsenal",
    away_team: "Manchester City",
    combined_market_odds: {
      "arsenal": { name: "arsenal", price: 2.7, implied_probability: 37.0 },
      "manchester city": { name: "manchester city", price: 2.5, implied_probability: 40.0 },
      "draw": { name: "draw", price: 3.4, implied_probability: 29.4 }
    }
  }
];

const OddsList = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["upcoming-odds"],
    queryFn: fetchOdds,
  });

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
