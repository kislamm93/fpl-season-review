
import React from "react";
import DashboardHeader from "@/components/DashboardHeader";
import ManagerIdForm from "@/components/ManagerIdForm";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20">
      <DashboardHeader />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-16">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 gap-8">
            <div className="text-center mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="inline-block mb-2 px-3 py-1 bg-primary/5 text-primary-foreground/80 rounded-full text-xs font-medium">
                Welcome to FPL Season Review
              </div>
              <h2 className="text-3xl font-medium tracking-tight sm:text-4xl mb-3">
                Track Your Fantasy Premier League
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Get detailed insights and performance tracking for your Fantasy Premier League team.
                Start by entering your FPL manager ID below.
              </p>
            </div>
            
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <ManagerIdForm />
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
          FPL Season Review — Elegantly track your Fantasy Premier League performance
        </p>
      </footer>
    </div>
  );
};

export default Index;
