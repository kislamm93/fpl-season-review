
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { OddsData } from "@/types/odds";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getTeamLogoUrl, getTeamDisplayName } from "@/lib/teamData";

interface OddsListItemProps {
  match: OddsData;
  isExpanded: boolean;
  onToggle: () => void;
}

const OddsListItem = ({ match, isExpanded, onToggle }: OddsListItemProps) => {
  const matchDate = new Date(match.commence_time);
  const formattedTime = format(matchDate, "h:mm a");

  const homeOdds = match.combined_market_odds?.[match.home_team];
  const awayOdds = match.combined_market_odds?.[match.away_team];
  const drawOdds = match.combined_market_odds?.["Draw"];

  const homeTeamLogo = getTeamLogoUrl(match.home_team);
  const awayTeamLogo = getTeamLogoUrl(match.away_team);
  
  const homeDisplayName = getTeamDisplayName(match.home_team);
  const awayDisplayName = getTeamDisplayName(match.away_team);

  return (
    <Card className="overflow-hidden">
      <Collapsible open={isExpanded} onOpenChange={onToggle}>
        <CardContent className="p-0">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full rounded-none p-2 h-auto flex justify-between items-center"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 text-left">
                  <span className="text-xs text-muted-foreground">{formattedTime}</span>
                  <span className="text-xs text-muted-foreground hidden sm:block">•</span>
                  <span className="text-xs text-muted-foreground">{match.sport_title}</span>
                </div>
                
                <div className="flex items-center">
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </div>
            </Button>
          </CollapsibleTrigger>
          
          <div className="px-3 py-2 flex flex-col border-y">
            {/* Teams and logos with more compact layout */}
            <div className="grid grid-cols-5 items-center mb-2">
              <div className="col-span-2 flex items-center justify-end">
                <span className="font-medium text-sm md:text-base mr-2">{homeDisplayName}</span>
                {homeTeamLogo && (
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={homeTeamLogo} alt={match.home_team} />
                    <AvatarFallback>{homeDisplayName.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                )}
              </div>
              
              <div className="flex justify-center items-center">
                <div className="text-xs font-medium px-2 py-1 bg-secondary/50 rounded-full w-8 text-center">VS</div>
              </div>
              
              <div className="col-span-2 flex items-center justify-start">
                {awayTeamLogo && (
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={awayTeamLogo} alt={match.away_team} />
                    <AvatarFallback>{awayDisplayName.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                )}
                <span className="font-medium text-sm md:text-base ml-2">{awayDisplayName}</span>
              </div>
            </div>
            
            {/* Only show probability percentages */}
            <div className="flex justify-center items-center space-x-6 mt-1">
              {homeOdds && (
                <Badge variant="outline" className="bg-primary/10 text-xs">
                  {homeOdds.implied_probability.toFixed(1)}%
                </Badge>
              )}
              
              {drawOdds && (
                <Badge variant="outline" className="bg-primary/5 text-xs">
                  {drawOdds.implied_probability.toFixed(1)}%
                </Badge>
              )}
              
              {awayOdds && (
                <Badge variant="outline" className="bg-primary/10 text-xs">
                  {awayOdds.implied_probability.toFixed(1)}%
                </Badge>
              )}
            </div>
          </div>
          
          <CollapsibleContent>
            <div className="p-3">
              <h3 className="text-sm font-semibold mb-3">Bookmaker Odds</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Bookmaker</TableHead>
                      <TableHead className="text-xs">Last Updated</TableHead>
                      <TableHead className="text-right text-xs">{homeDisplayName}</TableHead>
                      <TableHead className="text-right text-xs">Draw</TableHead>
                      <TableHead className="text-right text-xs">{awayDisplayName}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {match.bookmakers.map((bookmaker) => {
                      // Find the h2h market
                      const market = bookmaker.markets.find(m => m.key === 'h2h');
                      if (!market) return null;
                      
                      // Get outcomes for home, away, and draw
                      const homeOutcome = market.outcomes.find(o => o.name === match.home_team);
                      const awayOutcome = market.outcomes.find(o => o.name === match.away_team);
                      const drawOutcome = market.outcomes.find(o => o.name === 'Draw');
                      
                      const lastUpdated = new Date(bookmaker.last_update);
                      const formattedLastUpdate = format(lastUpdated, "MMM d, h:mm a");
                      
                      return (
                        <TableRow key={bookmaker.key}>
                          <TableCell className="font-medium text-xs py-2">{bookmaker.title}</TableCell>
                          <TableCell className="text-muted-foreground text-xs py-2">{formattedLastUpdate}</TableCell>
                          <TableCell className="text-right text-xs py-2">
                            {homeOutcome && (
                              <div>
                                <span className="text-xs text-muted-foreground">
                                  {homeOutcome.implied_probability.toFixed(1)}%
                                </span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right text-xs py-2">
                            {drawOutcome && (
                              <div>
                                <span className="text-xs text-muted-foreground">
                                  {drawOutcome.implied_probability.toFixed(1)}%
                                </span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right text-xs py-2">
                            {awayOutcome && (
                              <div>
                                <span className="text-xs text-muted-foreground">
                                  {awayOutcome.implied_probability.toFixed(1)}%
                                </span>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CollapsibleContent>
        </CardContent>
      </Collapsible>
    </Card>
  );
};

export default OddsListItem;
