
import React, { useEffect, useState } from "react";
import { STORAGE_KEYS, getFromLocalStorage } from "@/lib/localStorage";
import ManagerIdForm from "@/components/ManagerIdForm";
import PlayersList from "@/components/PlayersList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const [managerId, setManagerId] = useState<string | null>(null);
  
  useEffect(() => {
    const storedId = getFromLocalStorage<string | null>(STORAGE_KEYS.MANAGER_ID, null);
    setManagerId(storedId);
    
    // Add event listener for storage changes (in case manager ID is updated in another tab)
    const handleStorageChange = () => {
      const updatedId = getFromLocalStorage<string | null>(STORAGE_KEYS.MANAGER_ID, null);
      setManagerId(updatedId);
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // Listen for changes in localStorage within the same tab
  const handleManagerIdChange = () => {
    const storedId = getFromLocalStorage<string | null>(STORAGE_KEYS.MANAGER_ID, null);
    setManagerId(storedId);
  };

  return (
    <div className="grid grid-cols-1 gap-8">
      <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <ManagerIdForm onManagerIdChange={handleManagerIdChange} />
      </div>
      
      {managerId && (
        <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <PlayersList />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
