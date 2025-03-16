
import React, { useState, useEffect } from "react";
import { STORAGE_KEYS, getFromLocalStorage, saveToLocalStorage } from "@/lib/localStorage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Save, Check, RefreshCw } from "lucide-react";

interface ManagerIdFormProps {
  className?: string;
  onManagerIdChange?: () => void;
}

const ManagerIdForm: React.FC<ManagerIdFormProps> = ({ className, onManagerIdChange }) => {
  const [managerId, setManagerId] = useState<string>("");
  const [savedId, setSavedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  // Load existing manager ID from localStorage on component mount
  useEffect(() => {
    const storedId = getFromLocalStorage<string | null>(STORAGE_KEYS.MANAGER_ID, null);
    if (storedId) {
      setSavedId(storedId);
    }
  }, []);

  // Validate manager ID (simple numeric check for now)
  const validateManagerId = (id: string): boolean => {
    return /^\d+$/.test(id) && id.length > 0;
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setManagerId(value);
    
    if (value) {
      setIsValid(validateManagerId(value));
    } else {
      setIsValid(null);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateManagerId(managerId)) {
      toast.error("Please enter a valid manager ID (numbers only)");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      saveToLocalStorage(STORAGE_KEYS.MANAGER_ID, managerId);
      setSavedId(managerId);
      setManagerId("");
      setIsValid(null);
      setIsLoading(false);
      
      toast.success("Manager ID saved successfully!", {
        description: `Your FPL Manager ID (${managerId}) has been saved.`,
        duration: 4000,
      });
      
      // Dispatch custom event for same-tab detection
      window.dispatchEvent(new Event('local-storage-change'));
      
      // Notify parent component about the manager ID change
      if (onManagerIdChange) {
        onManagerIdChange();
      }
    }, 800);
  };

  // Handle reset
  const handleReset = () => {
    setSavedId(null);
    setManagerId("");
    setIsValid(null);
    saveToLocalStorage(STORAGE_KEYS.MANAGER_ID, null);
    
    toast("Manager ID has been reset", {
      description: "You can enter a new manager ID now.",
    });
    
    // Dispatch custom event for same-tab detection
    window.dispatchEvent(new Event('local-storage-change'));
    
    // Notify parent component about the manager ID change
    if (onManagerIdChange) {
      onManagerIdChange();
    }
  };

  return (
    <Card className={cn("w-full max-w-md mx-auto animate-slide-up shadow-lg", className)}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">FPL Manager Setup</CardTitle>
        <CardDescription>
          {savedId 
            ? "Your manager ID has been saved"
            : "Enter your Fantasy Premier League manager ID to get started"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {savedId ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 p-4 rounded-lg bg-muted/50">
              <div className="bg-primary/10 p-2 rounded-full">
                <Check className="w-5 h-5 text-primary" />
              </div>
              <span className="font-medium text-lg">{savedId}</span>
            </div>
            <p className="text-sm text-center text-muted-foreground">
              Your manager ID is saved and ready to use
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter your FPL manager ID"
                  value={managerId}
                  onChange={handleInputChange}
                  className={cn(
                    "transition-all focus-visible:ring-2 text-center text-lg h-12",
                    isValid === false && "ring-2 ring-destructive focus-visible:ring-destructive",
                    isValid === true && "ring-2 ring-green-500 focus-visible:ring-green-500"
                  )}
                />
              </div>
              
              {isValid === false && (
                <p className="text-xs text-destructive animate-fade-in">
                  Please enter a valid manager ID (numbers only)
                </p>
              )}
              
              <p className="text-xs text-muted-foreground">
                You can find your manager ID in the URL when you visit your FPL team page
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-10 transition-all"
              disabled={isLoading || isValid === false}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> 
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> 
                  Save Manager ID
                </>
              )}
            </Button>
          </form>
        )}
      </CardContent>
      
      {savedId && (
        <CardFooter>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleReset}
            className="mx-auto text-muted-foreground"
          >
            Reset manager ID
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ManagerIdForm;
