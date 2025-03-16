
import React from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const LeagueDetails = () => {
  const { leagueId } = useParams<{ leagueId: string }>();

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Link to="/mini-league-preview">
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="mr-2" size={16} />
            Back to Leagues
          </Button>
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">League Details</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>League ID: {leagueId}</CardTitle>
          <CardDescription>
            You are viewing the details for this league.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>This page will be populated with league details in a future update.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeagueDetails;
