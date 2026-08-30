
import React from "react";
import { Helmet } from "react-helmet-async";
import OddsList from "@/components/OddsList";
import CaptainChat from "@/components/CaptainChat";

const MarketOdd = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Market Odds | FPL Analytics</title>
      </Helmet>
      <h1 className="text-3xl font-bold mb-6">Upcoming Match Odds</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OddsList />
        </div>
        <div className="lg:col-span-1 lg:sticky lg:top-4 self-start">
          <CaptainChat />
        </div>
      </div>
    </div>
  );
};

export default MarketOdd;
