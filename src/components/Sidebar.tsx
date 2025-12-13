import { Upload, Settings, Eye, List, TrendingUp, DollarSign, Wallet, LogOut, UserPlus, User, Feather } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const Sidebar = () => {
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-sm p-4 space-y-4">
      <Card className="p-4 bg-gradient-card dark:border-neon-teal/30 dark:shadow-glow-teal">
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground">Account</h3>
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user.user_metadata?.full_name || user.email}
                  </p>
                  {userRole && (
                    <Badge variant="secondary" className="text-xs mt-1">
                      {userRole}
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full justify-start text-sm dark:border-neon-magenta/50 dark:hover:bg-neon-magenta/10"
                onClick={signOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full justify-start text-sm dark:border-neon-teal/50 dark:hover:bg-neon-teal/10 group overflow-hidden relative"
              onClick={() => navigate("/auth")}
            >
              <UserPlus className="mr-2 h-4 w-4 group-hover:animate-[scale-in_0.3s_ease-out]" />
              <span className="relative z-10">Join Us</span>
              <div className="absolute inset-0 bg-gradient-to-r from-neon-teal/20 via-neon-violet/20 to-neon-magenta/20 opacity-0 group-hover:opacity-100 group-hover:animate-[slide-in-right_0.5s_ease-out] -z-0" />
            </Button>
          )}
        </div>
      </Card>

      {user && (
        <Card className="p-4 bg-gradient-card dark:border-neon-violet/30 dark:shadow-glow-violet">
          <h3 className="font-semibold text-sm mb-3 text-muted-foreground">My Profile</h3>
          <nav className="space-y-1">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sm dark:hover:bg-neon-violet/10 dark:hover:text-neon-violet"
              onClick={() => navigate("/write")}
            >
              <Feather className="mr-2 h-4 w-4" />
              Write Stories
            </Button>
            {userRole === 'contributor' && (
              <Button 
                variant="ghost" 
                className="w-full justify-start text-sm dark:hover:bg-neon-teal/10 dark:hover:text-neon-teal"
                onClick={() => navigate("/materials")}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
            )}
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sm dark:hover:bg-neon-violet/10 dark:hover:text-neon-violet"
            onClick={() => navigate("/profile")}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sm dark:hover:bg-neon-blue/10 dark:hover:text-neon-blue"
            onClick={() => navigate("/materials")}
          >
            <Eye className="mr-2 h-4 w-4" />
            Review uploads
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sm dark:hover:bg-neon-magenta/10 dark:hover:text-neon-magenta"
            onClick={() => navigate("/materials")}
          >
            <List className="mr-2 h-4 w-4" />
            Watchlist
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sm dark:hover:bg-neon-teal/10 dark:hover:text-neon-teal"
            onClick={() => navigate("/materials")}
          >
            <Eye className="mr-2 h-4 w-4" />
            Recent views
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sm dark:hover:bg-neon-violet/10 dark:hover:text-neon-violet"
            onClick={() => navigate("/wallet")}
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            My sales
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sm dark:hover:bg-neon-blue/10 dark:hover:text-neon-blue"
            onClick={() => navigate("/wallet")}
          >
            <DollarSign className="mr-2 h-4 w-4" />
            Balance
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sm dark:hover:bg-neon-magenta/10 dark:hover:text-neon-magenta"
            onClick={() => navigate("/wallet")}
          >
            <Wallet className="mr-2 h-4 w-4" />
            Pending balance
          </Button>
          </nav>
        </Card>
      )}
    </aside>
  );
};
