
import React from "react";
import { Helmet } from "react-helmet-async";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OddsList from "@/components/OddsList";
import CaptainChat from "@/components/CaptainChat";
import {
  RefreshBar,
  GoalscorersTab,
  CleanSheetsTab,
  GoalsMarketTab,
} from "@/components/OddsMarketTabs";

const TAB_CONTEXT: Record<string, string> = {
  win: "Market Odds page, Win Probability tab — match win/draw/win percentages",
  scorers: "Market Odds page, Goalscorers tab — anytime-goalscorer odds per player",
  cs: "Market Odds page, Clean Sheets tab — per-team clean-sheet probability",
  goals: "Market Odds page, Goals Market tab — over/under 2.5, BTTS and handicaps",
};

const MarketOdd = () => {
  const [tab, setTab] = React.useState("win");

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Market Odds | FPL Analytics</title>
      </Helmet>

      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold">Market Odds</h1>
        <RefreshBar />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Win Probability keeps its own fetch; the other three read one
              cached snapshot, so switching between them costs nothing. */}
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
              <TabsTrigger value="win">Win Probability</TabsTrigger>
              <TabsTrigger value="scorers">Goalscorers</TabsTrigger>
              <TabsTrigger value="cs">Clean Sheets</TabsTrigger>
              <TabsTrigger value="goals">Goals Market</TabsTrigger>
            </TabsList>

            <TabsContent value="win" className="mt-4">
              <OddsList />
            </TabsContent>
            <TabsContent value="scorers" className="mt-4">
              <GoalscorersTab />
            </TabsContent>
            <TabsContent value="cs" className="mt-4">
              <CleanSheetsTab />
            </TabsContent>
            <TabsContent value="goals" className="mt-4">
              <GoalsMarketTab />
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1 lg:sticky lg:top-4 self-start">
          <CaptainChat context={TAB_CONTEXT[tab]} />
        </div>
      </div>
    </div>
  );
};

export default MarketOdd;
