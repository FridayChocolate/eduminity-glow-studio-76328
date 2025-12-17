import { useMode } from "@/contexts/ModeContext";
import { Sparkles, BookOpen, Palette } from "lucide-react";

const modeIcons = {
  public: Sparkles,
  student: BookOpen,
  contributor: Palette,
};

export const ModeTransition = () => {
  const { isTransitioning, transitionMessage, mode } = useMode();
  const Icon = modeIcons[mode];

  if (!isTransitioning) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      {/* Animated background */}
      <div className="absolute inset-0 mode-transition-bg animate-mode-transition" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-4 animate-fade-in">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center animate-pulse-soft shadow-2xl">
          <Icon className="h-10 w-10 text-primary-foreground" />
        </div>
        <p className="text-xl font-semibold text-foreground tracking-wide">
          {transitionMessage}
        </p>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
