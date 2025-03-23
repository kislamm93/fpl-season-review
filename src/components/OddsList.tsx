
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getApiEndpoint } from "@/lib/env";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import OddsListItem from "./OddsListItem";
import { OddsData } from "@/types/odds";

const fetchOdds = async (): Promise<OddsData[]> => {
  const response = await fetch(getApiEndpoint("/odds/upcoming"));
  if (!response.ok) {
    throw new Error("Failed to fetch odds data");
  }
  return response.json();
};

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

  return (
    <div className="space-y-4">
      {data && data.length > 0 ? (
        data.map((match) => (
          <OddsListItem key={match.id} match={match} />
        ))
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
