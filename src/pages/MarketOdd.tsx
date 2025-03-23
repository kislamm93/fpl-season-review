
import React from "react";
import { Helmet } from "react-helmet-async";
import OddsList from "@/components/OddsList";

const MarketOdd = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Market Odds | FPL Analytics</title>
      </Helmet>
      <h1 className="text-3xl font-bold mb-6">Upcoming Match Odds</h1>
      <OddsList />
    </div>
  );
};

export default MarketOdd;
