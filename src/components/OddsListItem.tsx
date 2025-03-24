
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { OddsData } from "@/types/odds";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getTeamLogoUrl, getTeamDisplayName } from "@/lib/teamData";

interface OddsListItemProps {
  match: OddsData;
}

const OddsListItem = ({ match }: OddsListItemProps) => {
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
          </div>
          
          {/* Teams and logos with VS in the middle - single row format */}
          <div className="flex items-center justify-center">
            {/* Home team name and logo side by side */}
            <div className="flex-1 flex items-center justify-end mr-4">
              <span className="font-medium text-sm mr-2">{homeDisplayName}</span>
              {homeTeamLogo && (
                <Avatar className="h-6 w-6">
                  <AvatarImage src={homeTeamLogo} alt={match.home_team} />
                  <AvatarFallback>{homeDisplayName.slice(0, 2)}</AvatarFallback>
                </Avatar>
              )}
            </div>
            
            {/* VS in the middle */}
            <div className="flex-shrink-0 mx-2">
              <div className="text-xs font-medium bg-secondary/50 rounded-full w-6 h-6 flex items-center justify-center">
                VS
              </div>
            </div>
            
            {/* Away team logo and name side by side */}
            <div className="flex-1 flex items-center justify-start ml-4">
              {awayTeamLogo && (
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={awayTeamLogo} alt={match.away_team} />
                  <AvatarFallback>{awayDisplayName.slice(0, 2)}</AvatarFallback>
                </Avatar>
              )}
              <span className="font-medium text-sm">{awayDisplayName}</span>
            </div>
          </div>
          
          {/* Probability badges */}
          <div className="flex items-center justify-center mt-1">
            {/* Home team probability */}
            <div className="flex-1 flex justify-end mr-4">
              {homeOdds && (
                <Badge variant="outline" className="bg-primary/10 text-xs py-0 h-5 w-16">
                  {homeOdds.implied_probability.toFixed(1)}%
                </Badge>
              )}
            </div>
            
            {/* Draw probability */}
            <div className="flex-shrink-0 mx-2">
              {drawOdds && (
                <Badge variant="outline" className="bg-primary/5 text-xs py-0 h-5 w-16">
                  {drawOdds.implied_probability.toFixed(1)}%
                </Badge>
              )}
            </div>
            
            {/* Away team probability */}
            <div className="flex-1 flex justify-start ml-4">
              {awayOdds && (
                <Badge variant="outline" className="bg-primary/10 text-xs py-0 h-5 w-16">
                  {awayOdds.implied_probability.toFixed(1)}%
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OddsListItem;
