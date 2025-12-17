import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Upload, Download, Wallet, Star, TrendingUp, 
  FileText, ShoppingCart, Eye, Award, Zap,
  ArrowRight, Target, ArrowUpRight, ChevronRight,
  BarChart3, Users, Sparkles, Crown, Rocket
} from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";

const statsData = [
  { 
    label: "Monthly Earnings", 
    value: 12450, 
    icon: Wallet, 
    color: "text-creator-magenta", 
    bgColor: "bg-creator-magenta/20",
    trend: "+18%",
    trendUp: true,
    prefix: "৳"
  },
  { 
    label: "Total Views", 
    value: 8420, 
    icon: Eye, 
    color: "text-creator-violet", 
    bgColor: "bg-creator-violet/20",
    trend: "+24%",
    trendUp: true
  },
  { 
    label: "Conversions", 
    value: 342, 
    icon: ShoppingCart, 
    color: "text-creator-green", 
    bgColor: "bg-creator-green/20",
    trend: "+12%",
    trendUp: true
  },
  { 
    label: "Avg Rating", 
    value: 4.9, 
    icon: Star, 
    color: "text-yellow-400", 
    bgColor: "bg-yellow-400/20",
    isDecimal: true,
    suffix: "★"
  },
];

const topPerformingNotes = [
  { id: 1, title: "HSC Physics Complete Guide", views: 2340, purchases: 89, earnings: 4450, trend: "up" },
  { id: 2, title: "Organic Chemistry Notes", views: 1890, purchases: 67, earnings: 3350, trend: "up" },
  { id: 3, title: "ICT Revision Sheet", views: 1450, purchases: 52, earnings: 2600, trend: "stable" },
];

const weeklyTrends = [
  { day: "Mon", views: 120, purchases: 8 },
  { day: "Tue", views: 145, purchases: 12 },
  { day: "Wed", views: 180, purchases: 15 },
  { day: "Thu", views: 165, purchases: 11 },
  { day: "Fri", views: 210, purchases: 18 },
  { day: "Sat", views: 280, purchases: 24 },
  { day: "Sun", views: 190, purchases: 14 },
];

const growthActions = [
  { icon: Upload, title: "Upload New Content", description: "Your HSC notes are trending. Upload more!", color: "from-creator-magenta to-pink-500" },
  { icon: Zap, title: "Optimize Pricing", description: "Similar notes sell better at ৳55-65", color: "from-creator-violet to-purple-500" },
  { icon: Users, title: "Engage Community", description: "Reply to 3 pending questions", color: "from-creator-green to-emerald-500" },
];

const achievements = [
  { icon: Crown, title: "Top Seller", description: "Top 5% this month", unlocked: true },
  { icon: Star, title: "5-Star Creator", description: "Maintain 4.8+ rating", unlocked: true },
  { icon: Rocket, title: "Rising Star", description: "50+ uploads", unlocked: false, progress: 76 },
];

const StatCard = ({ stat, index }: { stat: typeof statsData[0]; index: number }) => {
  const { count, ref } = useCountUp({ 
    end: stat.value, 
    duration: 1500, 
    delay: index * 100 
  });

  const displayValue = stat.isDecimal 
    ? stat.value.toFixed(1) 
    : `${stat.prefix || ""}${count.toLocaleString()}${stat.suffix || ""}`;

  return (
    <Card 
      ref={ref}
      className="creator-card border-creator-border hover:border-creator-magenta/50 transition-all duration-300 hover:-translate-y-1 group"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
            <stat.icon className={`h-6 w-6 ${stat.color}`} />
          </div>
          {stat.trend && (
            <Badge variant="secondary" className={`text-xs ${stat.trendUp ? 'bg-creator-green/20 text-creator-green' : 'bg-muted text-muted-foreground'}`}>
              {stat.trendUp && <ArrowUpRight className="h-3 w-3 mr-0.5" />}
              {stat.trend}
            </Badge>
          )}
        </div>
        <div className={`text-2xl md:text-3xl font-bold ${stat.color} tabular-nums`}>
          {displayValue}
        </div>
        <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
      </CardContent>
    </Card>
  );
};

export default function ContributorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState<"weekly" | "monthly">("weekly");
  const maxViews = Math.max(...weeklyTrends.map(d => d.views));

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const contributorLevel = { name: "Top Contributor", progress: 85, nextLevel: "Elite Creator" };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background contributor-mode">
        {/* Animated gradient background */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-creator-magenta/10 via-transparent to-transparent animate-pulse-soft" />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-creator-violet/10 via-transparent to-transparent animate-pulse-soft" style={{ animationDelay: '1s' }} />
        </div>
        
        <Header />
        
        <main className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-7xl">
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-5 w-5 text-creator-magenta animate-pulse" />
                <span className="text-sm font-medium text-creator-magenta">Creator Studio</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-creator-magenta via-creator-violet to-creator-green bg-clip-text text-transparent">
                Welcome back, Creator! 🚀
              </h1>
              <p className="text-muted-foreground mt-1">Your content is performing great this week</p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-creator-magenta/20 via-creator-violet/20 to-creator-green/20 border border-creator-magenta/30">
                  <Award className="h-6 w-6 text-creator-magenta" />
                  <div>
                    <div className="text-sm font-semibold text-foreground">{contributorLevel.name}</div>
                    <div className="text-xs text-muted-foreground">{contributorLevel.progress}% to {contributorLevel.nextLevel}</div>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Keep uploading quality content to reach {contributorLevel.nextLevel}!</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statsData.map((stat, index) => (
              <StatCard key={index} stat={stat} index={index} />
            ))}
          </div>

          {/* Growth Actions */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5 text-creator-green" />
              <h2 className="text-lg font-semibold">Suggested Growth Actions</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {growthActions.map((action, index) => (
                <Card
                  key={index}
                  className="creator-card border-creator-border hover:border-creator-magenta/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                >
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-lg`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm group-hover:text-creator-magenta transition-colors">{action.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Performance Chart */}
            <Card className="lg:col-span-2 creator-card border-creator-border">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BarChart3 className="h-5 w-5 text-creator-violet" />
                    Performance Overview
                  </CardTitle>
                  <Tabs value={timeFilter} onValueChange={(v) => setTimeFilter(v as "weekly" | "monthly")}>
                    <TabsList className="h-8 bg-creator-bg">
                      <TabsTrigger value="weekly" className="text-xs px-3 h-6">Weekly</TabsTrigger>
                      <TabsTrigger value="monthly" className="text-xs px-3 h-6">Monthly</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-56 flex items-end justify-between gap-3">
                  {weeklyTrends.map((data, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div 
                            className="w-full bg-gradient-to-t from-creator-magenta via-creator-violet to-creator-green rounded-t-lg transition-all duration-500 cursor-pointer hover:shadow-lg hover:shadow-creator-magenta/30"
                            style={{ height: `${(data.views / maxViews) * 100}%` }}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-medium">{data.views} views</p>
                          <p className="text-xs text-muted-foreground">{data.purchases} purchases</p>
                        </TooltipContent>
                      </Tooltip>
                      <span className="text-xs text-muted-foreground">{data.day}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="creator-card border-creator-border">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Award className="h-5 w-5 text-yellow-400" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-xl border transition-all ${
                      achievement.unlocked 
                        ? 'bg-gradient-to-r from-creator-magenta/10 to-creator-violet/10 border-creator-magenta/30' 
                        : 'bg-muted/30 border-border/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        achievement.unlocked ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-muted'
                      }`}>
                        <achievement.icon className={`h-5 w-5 ${achievement.unlocked ? 'text-white' : 'text-muted-foreground'}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-sm font-medium ${achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {achievement.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">{achievement.description}</p>
                        {achievement.progress && !achievement.unlocked && (
                          <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-creator-magenta to-creator-violet rounded-full"
                              style={{ width: `${achievement.progress}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Top Performing Notes */}
          <Card className="mt-6 creator-card border-creator-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-creator-green" />
                  Top Performing Content
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-creator-magenta hover:text-creator-magenta hover:bg-creator-magenta/10">
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topPerformingNotes.map((note, index) => (
                  <div
                    key={note.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer group border border-transparent hover:border-creator-magenta/30"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-creator-magenta to-creator-violet flex items-center justify-center text-white font-bold">
                      #{index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate group-hover:text-creator-magenta transition-colors">
                        {note.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" /> {note.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <ShoppingCart className="h-3 w-3" /> {note.purchases}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-creator-green">৳{note.earnings.toLocaleString()}</div>
                      <Badge variant="secondary" className="text-xs bg-creator-green/20 text-creator-green">
                        <ArrowUpRight className="h-3 w-3 mr-0.5" />
                        Trending
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </TooltipProvider>
  );
}
