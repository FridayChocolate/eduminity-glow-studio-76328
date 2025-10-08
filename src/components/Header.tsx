import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";

export const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent dark:animate-glow-pulse">
              Eduminity
            </div>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Home
            </a>
            <a href="#sheets" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Sheets
            </a>
            <a href="#community" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Community
            </a>
            <a href="#support" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Support
            </a>
          </nav>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="hover:bg-muted dark:hover:shadow-glow-teal transition-all"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5 text-neon-teal" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>
    </header>
  );
};
