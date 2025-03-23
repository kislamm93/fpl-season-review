
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { OddsData } from "@/types/odds";

interface OddsListItemProps {
  match: OddsData;
}

const OddsListItem = ({ match }: OddsListItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const matchDate = new Date(match.commence_time);
  const formattedDate = format(matchDate, "MMM d, yyyy");
  const formattedTime = format(matchDate, "h:mm a");

  return (
    <Card className="overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardContent className="p-0">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full rounded-none p-4 h-auto flex justify-between items-center"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-sm text-muted-foreground">{formattedDate} • {formattedTime}</span>
                  <span className="text-sm text-muted-foreground hidden sm:block">•</span>
                  <span className="text-sm text-muted-foreground">{match.sport_title}</span>
                </div>
                
                <div className="flex items-center gap-4">
                  {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </div>
            </Button>
          </CollapsibleTrigger>
          
          <div className="px-4 py-4 flex justify-between items-center border-y">
            <div className="flex-1 text-right pr-3">
              <div className="font-semibold text-lg">{match.home_team}</div>
            </div>
            
            <div className="flex flex-col items-center px-4">
              <div className="text-xs text-muted-foreground">VS</div>
            </div>
            
            <div className="flex-1 text-left pl-3">
              <div className="font-semibold text-lg">{match.away_team}</div>
            </div>
          </div>
          
          <CollapsibleContent>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4">Bookmaker Odds</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bookmaker</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">{match.home_team}</TableHead>
                      <TableHead className="text-right">Draw</TableHead>
                      <TableHead className="text-right">{match.away_team}</TableHead>
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
                          <TableCell className="font-medium">{bookmaker.title}</TableCell>
                          <TableCell className="text-muted-foreground">{formattedLastUpdate}</TableCell>
                          <TableCell className="text-right">
                            {homeOutcome && (
                              <div>
                                <span className="font-medium">{homeOutcome.price.toFixed(2)}</span>
                                <span className="text-xs text-muted-foreground ml-1">
                                  ({homeOutcome.implied_probability.toFixed(1)}%)
                                </span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {drawOutcome && (
                              <div>
                                <span className="font-medium">{drawOutcome.price.toFixed(2)}</span>
                                <span className="text-xs text-muted-foreground ml-1">
                                  ({drawOutcome.implied_probability.toFixed(1)}%)
                                </span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
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
