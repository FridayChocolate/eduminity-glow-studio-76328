import { Moon, Sun, User, Wallet, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/useTheme";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FontSelector } from "@/components/FontSelector";

export const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
    setMobileMenuOpen(false);
  };

  const navigateTo = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4 md:gap-8">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 bg-transparent border-0 p-0 cursor-pointer group"
          >
            {/* Sci-Fi Logo with Neon Glow */}
            <div className="relative flex items-center">
              {/* Hexagonal Icon */}
              <div className="relative w-8 h-8 md:w-10 md:h-10 mr-2">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-violet-500 to-fuchsia-500 clip-hexagon animate-pulse opacity-80" 
                     style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />
                <div className="absolute inset-[2px] bg-background clip-hexagon flex items-center justify-center"
                     style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                  <span className="text-xs md:text-sm font-black bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">E</span>
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 blur-md bg-gradient-to-br from-cyan-400/50 via-violet-500/50 to-fuchsia-500/50 -z-10 group-hover:blur-lg transition-all"
                     style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />
              </div>
              {/* Text with neon effect */}
              <div className="relative">
                <span className="text-xl md:text-2xl font-black tracking-wider bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] group-hover:drop-shadow-[0_0_20px_rgba(34,211,238,0.8)] transition-all duration-300">
                  EDUMINITY
                </span>
                {/* Underline glow */}
                <div className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 opacity-70 group-hover:opacity-100 shadow-[0_0_10px_rgba(34,211,238,0.8)] transition-opacity" />
              </div>
            </div>
          </button>
          <nav className="hidden lg:flex gap-6">
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
            <button
              onClick={() => navigate("/premium")}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Premium
            </button>
          </nav>
        </div>
        
        <div className="flex items-center gap-1 md:gap-2">
          {/* Font Selector */}
          <FontSelector />
          
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
                <Wallet className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/profile")}
                className="hover:bg-muted dark:hover:shadow-glow-teal transition-all"
              >
                <User className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
              <Button variant="outline" onClick={handleLogout} className="hidden sm:flex">
                Logout
              </Button>
            </>
          ) : (
            <Button onClick={() => navigate("/auth")} size="sm" className="text-xs md:text-sm">Get Started</Button>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <nav className="flex flex-col gap-4 mt-8">
                <button
                  onClick={() => navigateTo("/")}
                  className="text-left text-base font-medium text-foreground hover:text-primary transition-colors p-2 rounded-md hover:bg-muted"
                >
                  Home
                </button>
                <button
                  onClick={() => navigateTo("/questions")}
                  className="text-left text-base font-medium text-foreground hover:text-primary transition-colors p-2 rounded-md hover:bg-muted"
                >
                  Q&A
                </button>
                <button
                  onClick={() => navigateTo("/materials")}
                  className="text-left text-base font-medium text-foreground hover:text-primary transition-colors p-2 rounded-md hover:bg-muted"
                >
                  Study Hub
                </button>
                <button
                  onClick={() => navigateTo("/community")}
                  className="text-left text-base font-medium text-foreground hover:text-primary transition-colors p-2 rounded-md hover:bg-muted"
                >
                  Community
                </button>
                <button
                  onClick={() => navigateTo("/premium")}
                  className="text-left text-base font-medium text-foreground hover:text-primary transition-colors p-2 rounded-md hover:bg-muted"
                >
                  Premium
                </button>
                <button
                  onClick={() => navigateTo("/donate")}
                  className="text-left text-base font-medium text-foreground hover:text-primary transition-colors p-2 rounded-md hover:bg-muted"
                >
                  Donate
                </button>
                {user && (
                  <>
                    <div className="border-t border-border my-2" />
                    <button
                      onClick={() => navigateTo("/wallet")}
                      className="text-left text-base font-medium text-foreground hover:text-primary transition-colors p-2 rounded-md hover:bg-muted"
                    >
                      Wallet
                    </button>
                    <button
                      onClick={() => navigateTo("/profile")}
                      className="text-left text-base font-medium text-foreground hover:text-primary transition-colors p-2 rounded-md hover:bg-muted"
                    >
                      Profile
                    </button>
                    <Button variant="outline" onClick={handleLogout} className="justify-start">
                      Logout
                    </Button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
