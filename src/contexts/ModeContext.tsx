import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";

export type AppMode = "public" | "student" | "contributor";

interface ModeContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  isTransitioning: boolean;
  transitionMessage: string;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

const transitionMessages: Record<AppMode, string> = {
  public: "Exploring Eduminity",
  student: "Entering Learning Space",
  contributor: "Entering Creator Studio",
};

export const ModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, userRole } = useAuth();
  const [mode, setModeState] = useState<AppMode>("public");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionMessage, setTransitionMessage] = useState("");

  // Auto-set mode based on user role
  useEffect(() => {
    if (!user) {
      setModeState("public");
    } else if (userRole === "contributor") {
      setModeState("contributor");
    } else {
      setModeState("student");
    }
  }, [user, userRole]);

  // Apply mode class to document
  useEffect(() => {
    document.documentElement.setAttribute("data-mode", mode);
    return () => {
      document.documentElement.removeAttribute("data-mode");
    };
  }, [mode]);

  const setMode = useCallback((newMode: AppMode) => {
    if (newMode === mode) return;
    
    setIsTransitioning(true);
    setTransitionMessage(transitionMessages[newMode]);
    
    setTimeout(() => {
      setModeState(newMode);
      setTimeout(() => {
        setIsTransitioning(false);
        setTransitionMessage("");
      }, 800);
    }, 400);
  }, [mode]);

  return (
    <ModeContext.Provider value={{ mode, setMode, isTransitioning, transitionMessage }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error("useMode must be used within a ModeProvider");
  }
  return context;
};
