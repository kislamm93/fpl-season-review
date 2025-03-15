
import React from "react";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  className?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ className }) => {
  return (
    <header className={cn("w-full px-6 py-5 animate-fade-in", className)}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-fpl to-fpl-accent p-[2px] rounded-lg">
              <div className="bg-background rounded-lg p-2">
                <svg 
                  width="28" 
                  height="28" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-fpl"
                >
                  <path 
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
                    fill="currentColor" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-medium tracking-tight">FPL Season Review</h1>
              <p className="text-sm text-muted-foreground">Fantasy Premier League Manager</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
