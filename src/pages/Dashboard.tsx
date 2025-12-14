import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Upload, Download, Wallet, Star, TrendingUp, 
  FileText, ShoppingCart, MessageSquare, Award,
  ArrowRight, Target
} from "lucide-react";

// Demo data for the dashboard
const statsData = [
  { label: "Total Uploads", value: 24, icon: Upload, color: "text-neon-teal", bgColor: "bg-neon-teal/10" },
  { label: "Downloads", value: 1847, icon: Download, color: "text-neon-violet", bgColor: "bg-neon-violet/10" },
  { label: "Earnings (BDT)", value: "৳8,450", icon: Wallet, color: "text-neon-magenta", bgColor: "bg-neon-magenta/10" },
  { label: "Avg Rating", value: "4.8★", icon: Star, color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
];

const recentActivity = [
  { type: "purchase", message: "Sadia Noor purchased your Physics notes", time: "2 hours ago", icon: ShoppingCart },
  { type: "review", message: "Your Calculus sheet received a 5★ review", time: "5 hours ago", icon: Star },
  { type: "download", message: "Your Chemistry notes were downloaded 12 times", time: "1 day ago", icon: Download },
  { type: "message", message: "New question on your Biology notes", time: "2 days ago", icon: MessageSquare },
];

const monthlyData = [
  { month: "Jul", earnings: 1200, downloads: 320 },
  { month: "Aug", earnings: 1850, downloads: 480 },
  { month: "Sep", earnings: 2100, downloads: 520 },
  { month: "Oct", earnings: 1600, downloads: 410 },
  { month: "Nov", earnings: 2800, downloads: 680 },
  { month: "Dec", earnings: 3200, downloads: 750 },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [uploadsProgress] = useState(24);
  const uploadGoal = 100;

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const getBadgeLevel = (uploads: number) => {
    if (uploads >= 100) return { level: "Top Contributor", color: "from-yellow-500 to-orange-500" };
    if (uploads >= 50) return { level: "Trusted", color: "from-neon-violet to-neon-magenta" };
    if (uploads >= 10) return { level: "Rising Star", color: "from-neon-teal to-neon-blue" };
    return { level: "Beginner", color: "from-gray-400 to-gray-500" };
  };

  const badge = getBadgeLevel(uploadsProgress);
  const maxEarnings = Math.max(...monthlyData.map(d => d.earnings));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-3 md:px-6 py-6 md:py-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1 bg-gradient-to-r from-neon-teal to-neon-violet bg-clip-text text-transparent">
              Welcome back! 👋
            </h1>
            <p className="text-muted-foreground">Here's your creator dashboard overview</p>
          </div>
          <Badge className={`mt-3 md:mt-0 w-fit px-4 py-2 bg-gradient-to-r ${badge.color} text-white font-semibold`}>
            <Award className="h-4 w-4 mr-2" />
            {badge.level}
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          {statsData.map((stat, index) => (
            <Card 
              key={index} 
              className="border-border/50 hover:border-primary/30 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-4 md:p-6">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg ${stat.bgColor} flex items-center justify-center mb-3`}>
                  <stat.icon className={`h-5 w-5 md:h-6 md:w-6 ${stat.color}`} />
                </div>
                <div className={`text-xl md:text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Performance Graph */}
          <Card className="lg:col-span-2 border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-neon-teal" />
                Monthly Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 md:h-64 flex items-end justify-between gap-2 md:gap-4">
                {monthlyData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-gradient-to-t from-neon-teal to-neon-violet rounded-t-md transition-all duration-500"
                      style={{ height: `${(data.earnings / maxEarnings) * 100}%` }}
                    />
                    <span className="text-xs text-muted-foreground">{data.month}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-gradient-to-r from-neon-teal to-neon-violet" />
                  <span className="text-muted-foreground">Earnings (BDT)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Widget */}
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5 text-neon-violet" />
                Upload Milestone
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-6">
              <div className="relative w-32 h-32 md:w-40 md:h-40 mb-4">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-muted/20"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(uploadsProgress / uploadGoal) * 251.2} 251.2`}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(var(--neon-teal))" />
                      <stop offset="100%" stopColor="hsl(var(--neon-violet))" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl md:text-3xl font-bold">{uploadsProgress}</span>
                  <span className="text-xs text-muted-foreground">of {uploadGoal}</span>
                </div>
              </div>
              <p className="text-sm text-center text-muted-foreground">
                Upload <span className="text-neon-teal font-semibold">{uploadGoal - uploadsProgress} more</span> notes to reach <span className="text-neon-violet font-semibold">Top Contributor</span> status!
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="border-border/50 mb-6">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-neon-magenta" />
                Recent Activity
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-neon-teal">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <activity.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{activity.message}</p>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <Button 
            variant="outline" 
            className="h-auto py-4 flex flex-col gap-2 border-neon-teal/30 hover:border-neon-teal hover:shadow-glow-teal/20"
            onClick={() => navigate("/materials")}
          >
            <Upload className="h-5 w-5 text-neon-teal" />
            <span className="text-sm">Upload Notes</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto py-4 flex flex-col gap-2 border-neon-violet/30 hover:border-neon-violet hover:shadow-glow-violet/20"
            onClick={() => navigate("/wallet")}
          >
            <Wallet className="h-5 w-5 text-neon-violet" />
            <span className="text-sm">View Wallet</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto py-4 flex flex-col gap-2 border-neon-magenta/30 hover:border-neon-magenta hover:shadow-glow-magenta/20"
            onClick={() => navigate("/questions")}
          >
            <MessageSquare className="h-5 w-5 text-neon-magenta" />
            <span className="text-sm">Answer Questions</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto py-4 flex flex-col gap-2 border-yellow-500/30 hover:border-yellow-500"
            onClick={() => navigate("/premium")}
          >
            <Star className="h-5 w-5 text-yellow-500" />
            <span className="text-sm">Go Premium</span>
          </Button>
        </div>
      </main>
    </div>
  );
}
