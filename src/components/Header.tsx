import { Moon, Sun, User, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/useTheme";

export const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent dark:from-neon-teal dark:to-neon-violet dark:animate-glow-pulse [-webkit-text-fill-color:transparent]">
              Eduminity
            </span>
          </div>
          <nav className="hidden md:flex gap-6">
            <button
              onClick={() => navigate("/")}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => navigate("/questions")}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Q&A
            </button>
            <button
              onClick={() => navigate("/materials")}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Study Hub
            </button>
            <button
              onClick={() => navigate("/community")}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Community
            </button>
          </nav>
        </div>
        
        <div className="flex items-center gap-2">
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

          {user ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/wallet")}
                className="hover:bg-muted dark:hover:shadow-glow-teal transition-all"
              >
                <Wallet className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/profile")}
                className="hover:bg-muted dark:hover:shadow-glow-teal transition-all"
              >
                <User className="h-5 w-5" />
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button onClick={() => navigate("/auth")}>Get Started</Button>
          )}
        </div>
      </div>
    </header>
  );
};
