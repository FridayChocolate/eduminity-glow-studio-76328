import { useMode, AppMode } from "@/contexts/ModeContext";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BookOpen, Palette, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

export const ModeSwitcher = () => {
  const { mode, setMode } = useMode();
  const { user, userRole } = useAuth();

  if (!user) return null;

  // Only show switcher if user can access both modes
  const canAccessContributor = userRole === "contributor";

  const modes: { value: AppMode; label: string; icon: typeof BookOpen; available: boolean }[] = [
    { value: "student", label: "Learning", icon: GraduationCap, available: true },
    { value: "contributor", label: "Creator", icon: Palette, available: canAccessContributor },
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-full border border-border/50">
      {modes.map(({ value, label, icon: Icon, available }) => {
        if (!available) return null;
        
        const isActive = mode === value;
        
        return (
          <Tooltip key={value}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMode(value)}
                className={cn(
                  "relative h-8 px-3 rounded-full transition-all duration-300",
                  isActive && "bg-primary text-primary-foreground shadow-md",
                  !isActive && "hover:bg-muted"
                )}
              >
                <Icon className="h-4 w-4 mr-1.5" />
                <span className="text-xs font-medium">{label}</span>
                {isActive && (
                  <span className="absolute inset-0 rounded-full ring-2 ring-primary/30 animate-pulse-soft" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Switch to {label} Mode</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
};
