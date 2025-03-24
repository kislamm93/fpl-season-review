
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { OddsData } from "@/types/odds";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getTeamLogoUrl, getTeamDisplayName } from "@/lib/teamData";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getApiEndpoint } from "@/lib/env";

interface OddsListItemProps {
  match: OddsData;
  isExpanded: boolean;
  onToggle: () => void;
}

interface CleanSheetData {
  home_team: {
    name: string;
    probability: number;
    odds: number;
  };
  away_team: {
    name: string;
    probability: number;
    odds: number;
  };
}

interface CleanSheetResponse {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  clean_sheets: CleanSheetData;
}

const fetchCleanSheetData = async (matchId: string): Promise<CleanSheetResponse> => {
  const response = await fetch(`${getApiEndpoint(`/odds/${matchId}/clean-sheets`)}`);
  if (!response.ok) {
    throw new Error("Failed to fetch clean sheet data");
  }
  return await response.json();
};

const OddsListItem = ({ match, isExpanded, onToggle }: OddsListItemProps) => {
  const { data: cleanSheetData, isLoading } = useQuery({
    queryKey: ["clean-sheets", match.id],
    queryFn: () => fetchCleanSheetData(match.id),
    enabled: isExpanded, // Only fetch data when expanded
  });

  const matchDate = new Date(match.commence_time);
  const formattedTime = format(matchDate, "h:mm a");

  // Get odds for home, away and draw, ensuring we use lowercase keys for comparison
  const homeTeamKey = match.home_team.toLowerCase();
  const awayTeamKey = match.away_team.toLowerCase();
  
  const homeOdds = match.combined_market_odds[homeTeamKey];
  const awayOdds = match.combined_market_odds[awayTeamKey];
  const drawOdds = match.combined_market_odds["draw"];

  const homeTeamLogo = getTeamLogoUrl(match.home_team);
  const awayTeamLogo = getTeamLogoUrl(match.away_team);
  
  const homeDisplayName = getTeamDisplayName(match.home_team);
  const awayDisplayName = getTeamDisplayName(match.away_team);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-3">
        <div className="flex flex-col space-y-2">
          {/* Match info header */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 text-left">
              <span className="text-xs text-muted-foreground">{formattedTime}</span>
              <span className="text-xs text-muted-foreground hidden sm:block">•</span>
              <span className="text-xs text-muted-foreground">{match.sport_title}</span>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-0 h-7 w-7"
              onClick={onToggle}
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          </div>
          
          {/* Teams and logos with VS in the middle - updated format */}
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2">{homeDisplayName}</span>
              {homeTeamLogo && (
                <Avatar className="h-6 w-6">
                  <AvatarImage src={homeTeamLogo} alt={match.home_team} />
                  <AvatarFallback>{homeDisplayName.slice(0, 2)}</AvatarFallback>
                </Avatar>
              )}
            </div>
            
            <div className="text-xs font-medium bg-secondary/50 rounded-full w-6 h-6 flex items-center justify-center mx-4">
              VS
            </div>
            
            <div className="flex items-center">
              {awayTeamLogo && (
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={awayTeamLogo} alt={match.away_team} />
                  <AvatarFallback>{awayDisplayName.slice(0, 2)}</AvatarFallback>
                </Avatar>
              )}
              <span className="text-sm font-medium">{awayDisplayName}</span>
            </div>
          </div>
          
          {/* Probability badges */}
          <div className="flex items-center justify-center space-x-4">
            {/* Home team probability */}
            {homeOdds && (
              <Badge variant="outline" className="bg-primary/10 text-xs py-0 h-5 w-16">
                {homeOdds.implied_probability.toFixed(1)}%
              </Badge>
            )}
            
            {/* Draw probability */}
            {drawOdds && (
              <Badge variant="outline" className="bg-primary/5 text-xs py-0 h-5 w-16">
                {drawOdds.implied_probability.toFixed(1)}%
              </Badge>
            )}
            
            {/* Away team probability */}
            {awayOdds && (
              <Badge variant="outline" className="bg-primary/10 text-xs py-0 h-5 w-16">
                {awayOdds.implied_probability.toFixed(1)}%
              </Badge>
            )}
          </div>

          {/* Expanded content */}
          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-border">
              <h4 className="text-sm font-medium mb-2">Clean Sheet Probability</h4>
              
              {isLoading ? (
                <div className="flex justify-center py-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                </div>
              ) : cleanSheetData ? (
                <div className="flex items-center justify-center space-x-10">
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-muted-foreground">{homeDisplayName}</span>
                    <Badge variant="outline" className="mt-1 bg-secondary/10 text-xs py-0 h-5">
                      {cleanSheetData.clean_sheets.home_team.probability.toFixed(1)}%
                    </Badge>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-muted-foreground">{awayDisplayName}</span>
                    <Badge variant="outline" className="mt-1 bg-secondary/10 text-xs py-0 h-5">
                      {cleanSheetData.clean_sheets.away_team.probability.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="text-center text-xs text-muted-foreground py-1">
                  No clean sheet data available
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OddsListItem;
