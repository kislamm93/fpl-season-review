
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
          
          <div className="px-2 py-2 flex flex-col border-y">
            {/* Ultra compact teams layout */}
            <div className="flex items-center justify-center">
              <div className="flex items-center flex-1 justify-end mr-1">
                <span className="font-medium text-sm truncate max-w-[90px]">{homeDisplayName}</span>
                {homeTeamLogo && (
                  <Avatar className="h-6 w-6 ml-1">
                    <AvatarImage src={homeTeamLogo} alt={match.home_team} />
                    <AvatarFallback>{homeDisplayName.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                )}
              </div>
              
              <div className="flex-shrink-0 mx-1">
                <div className="text-xs font-medium bg-secondary/50 rounded-full w-6 h-6 flex items-center justify-center">VS</div>
              </div>
              
              <div className="flex items-center flex-1 justify-start ml-1">
                {awayTeamLogo && (
                  <Avatar className="h-6 w-6 mr-1">
                    <AvatarImage src={awayTeamLogo} alt={match.away_team} />
                    <AvatarFallback>{awayDisplayName.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                )}
                <span className="font-medium text-sm truncate max-w-[90px]">{awayDisplayName}</span>
              </div>
            </div>
            
            {/* Probability percentages - more compact */}
            <div className="flex justify-center items-center space-x-4 mt-1">
              {homeOdds && (
                <Badge variant="outline" className="bg-primary/10 text-xs py-0 h-5">
                  {homeOdds.implied_probability.toFixed(1)}%
                </Badge>
              )}
              
              {drawOdds && (
                <Badge variant="outline" className="bg-primary/5 text-xs py-0 h-5">
                  {drawOdds.implied_probability.toFixed(1)}%
                </Badge>
              )}
              
              {awayOdds && (
                <Badge variant="outline" className="bg-primary/10 text-xs py-0 h-5">
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
                    {match.bookmakers && match.bookmakers.length > 0 ? (
                      match.bookmakers.map((bookmaker) => {
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
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-sm text-muted-foreground">
                          No detailed bookmaker information available
                        </TableCell>
                      </TableRow>
                    )}
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
