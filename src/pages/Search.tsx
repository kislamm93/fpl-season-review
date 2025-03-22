
import React from "react";
import { Helmet } from "react-helmet";
import SearchChat from "@/components/SearchChat";

const Search = () => {
  return (
    <div className="container py-8">
      <Helmet>
        <title>FPL Assistant | Ask Anything</title>
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">FPL Assistant</h1>
        <p className="text-muted-foreground">
          Ask any questions about Fantasy Premier League and get AI-powered answers.
        </p>
      </div>
      
      <SearchChat />
    </div>
  );
};

export default Search;
