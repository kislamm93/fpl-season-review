
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
import { getTeamLogoUrl } from "@/lib/teamData";

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
          
          <div className="px-3 py-2 flex justify-between items-center border-y text-sm">
            <div className="flex-1 text-right pr-2">
              <div className="font-medium flex items-center justify-end gap-1">
                {homeTeamLogo && (
                  <Avatar className="h-5 w-5 mr-1">
                    <AvatarImage src={homeTeamLogo} alt={match.home_team} />
                    <AvatarFallback>{match.home_team.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                )}
                {match.home_team}
              </div>
              {homeOdds && (
                <div className="flex justify-end items-center gap-1 mt-1">
                  <Badge variant="outline" className="bg-primary/10 text-xs px-1.5 py-0">
                    {homeOdds.price.toFixed(2)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {homeOdds.implied_probability.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex flex-col items-center px-2">
              <div className="text-xs text-muted-foreground">VS</div>
              {drawOdds && (
                <div className="flex flex-col items-center">
                  <Badge variant="outline" className="bg-primary/5 text-xs px-1.5 py-0 mt-1">
                    {drawOdds.price.toFixed(2)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {drawOdds.implied_probability.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex-1 text-left pl-2">
              <div className="font-medium flex items-center gap-1">
                {awayTeamLogo && (
                  <Avatar className="h-5 w-5 mr-1">
                    <AvatarImage src={awayTeamLogo} alt={match.away_team} />
                    <AvatarFallback>{match.away_team.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                )}
                {match.away_team}
              </div>
              {awayOdds && (
                <div className="flex items-center gap-1 mt-1">
                  <Badge variant="outline" className="bg-primary/10 text-xs px-1.5 py-0">
                    {awayOdds.price.toFixed(2)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {awayOdds.implied_probability.toFixed(1)}%
                  </span>
                </div>
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
                      <TableHead className="text-right text-xs">{match.home_team}</TableHead>
                      <TableHead className="text-right text-xs">Draw</TableHead>
                      <TableHead className="text-right text-xs">{match.away_team}</TableHead>
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
                                <span className="font-medium">{homeOutcome.price.toFixed(2)}</span>
                                <span className="text-xs text-muted-foreground ml-1">
                                  ({homeOutcome.implied_probability.toFixed(1)}%)
                                </span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right text-xs py-2">
                            {drawOutcome && (
                              <div>
                                <span className="font-medium">{drawOutcome.price.toFixed(2)}</span>
                                <span className="text-xs text-muted-foreground ml-1">
                                  ({drawOutcome.implied_probability.toFixed(1)}%)
                                </span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right text-xs py-2">
                            {awayOutcome && (
                              <div>
                                <span className="font-medium">{awayOutcome.price.toFixed(2)}</span>
                                <span className="text-xs text-muted-foreground ml-1">
                                  ({awayOutcome.implied_probability.toFixed(1)}%)
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
