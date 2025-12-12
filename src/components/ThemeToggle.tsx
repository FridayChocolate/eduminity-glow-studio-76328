import { Moon, Sun, Stars, Sparkles } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative w-16 h-8 rounded-full p-1 transition-all duration-500 ease-in-out overflow-hidden",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
        isDark 
          ? "bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 shadow-[0_0_20px_rgba(139,92,246,0.5)]" 
          : "bg-gradient-to-r from-sky-300 via-blue-400 to-cyan-300 shadow-[0_0_20px_rgba(56,189,248,0.5)]"
      )}
      aria-label="Toggle theme"
    >
      {/* Stars/Clouds background */}
      <div className={cn(
        "absolute inset-0 transition-opacity duration-500",
        isDark ? "opacity-100" : "opacity-0"
      )}>
        <Sparkles className="absolute top-1 left-2 w-2 h-2 text-yellow-200 animate-pulse" />
        <Stars className="absolute bottom-1 right-8 w-2 h-2 text-cyan-200 animate-pulse delay-100" />
        <div className="absolute top-2 right-4 w-1 h-1 rounded-full bg-white/60 animate-pulse delay-200" />
        <div className="absolute bottom-2 left-6 w-0.5 h-0.5 rounded-full bg-white/40 animate-pulse delay-300" />
      </div>
      
      {/* Sun rays / Moon glow */}
      <div className={cn(
        "absolute inset-0 transition-all duration-700",
        !isDark && "animate-spin-slow"
      )}>
        {!isDark && (
          <>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-r from-yellow-200/30 to-orange-200/30 blur-sm" />
          </>
        )}
      </div>

      {/* Toggle circle with icon */}
      <div
        className={cn(
          "relative w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]",
          "shadow-lg",
          isDark 
            ? "translate-x-8 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 shadow-[inset_-2px_-2px_4px_rgba(255,255,255,0.1),0_0_15px_rgba(139,92,246,0.6)]" 
            : "translate-x-0 bg-gradient-to-br from-yellow-300 via-orange-300 to-yellow-400 shadow-[inset_-2px_-2px_4px_rgba(255,255,255,0.5),0_0_15px_rgba(251,191,36,0.6)]"
        )}
      >
        {/* Sun icon */}
        <Sun 
          className={cn(
            "absolute w-4 h-4 text-yellow-600 transition-all duration-500",
            isDark ? "opacity-0 rotate-180 scale-0" : "opacity-100 rotate-0 scale-100"
          )} 
        />
        
        {/* Moon icon with craters */}
        <div className={cn(
          "absolute transition-all duration-500",
          isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-180 scale-0"
        )}>
          <Moon className="w-4 h-4 text-cyan-200" />
          {/* Moon craters */}
          <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-slate-600/50" />
          <div className="absolute bottom-1.5 left-1 w-0.5 h-0.5 rounded-full bg-slate-600/30" />
        </div>
      </div>

      {/* Shooting star animation (dark mode only) */}
      {isDark && (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute w-8 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent animate-shooting-star opacity-60" />
        </div>
      )}
    </button>
  );
};
