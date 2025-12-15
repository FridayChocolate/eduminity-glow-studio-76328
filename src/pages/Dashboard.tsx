import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Upload, Download, Wallet, Star, TrendingUp, 
  FileText, ShoppingCart, MessageSquare, Award,
  ArrowRight, Target, ArrowUpRight, Info, HelpCircle
} from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";

// Demo data for the dashboard
const statsData = [
  { 
    label: "Total Uploads", 
    value: 24, 
    icon: Upload, 
    color: "text-neon-teal", 
    bgColor: "bg-neon-teal/10",
    insight: "Top 25% of contributors",
    trend: null
  },
  { 
    label: "Downloads", 
    value: 1847, 
    icon: Download, 
    color: "text-neon-violet", 
    bgColor: "bg-neon-violet/10",
    insight: "↑ 12% this week",
    trend: "up"
  },
  { 
    label: "Earnings (BDT)", 
    value: 8450, 
    icon: Wallet, 
    color: "text-neon-magenta", 
    bgColor: "bg-neon-magenta/10",
    insight: "৳1,200 pending",
    trend: null,
    prefix: "৳"
  },
  { 
    label: "Avg Rating", 
    value: 4.8, 
    icon: Star, 
    color: "text-yellow-500", 
    bgColor: "bg-yellow-500/10",
    insight: "Excellent!",
    trend: null,
    suffix: "★",
    isDecimal: true
  },
];

const recentActivity = [
  { type: "purchase", message: "Sadia Noor purchased your Physics notes", time: "2 hours ago", icon: ShoppingCart, isNew: true },
  { type: "review", message: "Your Calculus sheet received a 5★ review", time: "5 hours ago", icon: Star, isNew: true },
  { type: "download", message: "Your Chemistry notes were downloaded 12 times", time: "1 day ago", icon: Download, isNew: false },
  { type: "message", message: "New question on your Biology notes", time: "2 days ago", icon: MessageSquare, isNew: false },
];

const monthlyData = [
  { month: "Jul", earnings: 1200, downloads: 320 },
  { month: "Aug", earnings: 1850, downloads: 480 },
  { month: "Sep", earnings: 2100, downloads: 520 },
  { month: "Oct", earnings: 1600, downloads: 410 },
  { month: "Nov", earnings: 2800, downloads: 680 },
  { month: "Dec", earnings: 3200, downloads: 750 },
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
      className="border-border/50 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 animate-fade-in group"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <CardContent className="p-4 md:p-6">
        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg ${stat.bgColor} flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110`}>
          <stat.icon className={`h-5 w-5 md:h-6 md:w-6 ${stat.color}`} />
        </div>
        <div className={`text-xl md:text-2xl font-bold ${stat.color} tabular-nums`}>
          {stat.isDecimal ? displayValue : displayValue}
        </div>
        <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
        {stat.insight && (
          <div className={`text-xs mt-2 flex items-center gap-1 ${stat.trend === 'up' ? 'text-green-500' : 'text-muted-foreground'}`}>
            {stat.trend === 'up' && <ArrowUpRight className="h-3 w-3" />}
            {stat.insight}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [uploadsProgress] = useState(24);
  const uploadGoal = 100;
  const [visibleActivities, setVisibleActivities] = useState<number[]>([]);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  // Animate activity items appearing
  useEffect(() => {
    recentActivity.forEach((_, index) => {
      setTimeout(() => {
        setVisibleActivities(prev => [...prev, index]);
      }, 300 + index * 150);
    });
  }, []);

  const getBadgeLevel = (uploads: number) => {
    if (uploads >= 100) return { level: "Top Contributor", color: "from-yellow-500 to-orange-500", description: "You're in the elite group of contributors!" };
    if (uploads >= 50) return { level: "Trusted", color: "from-neon-violet to-neon-magenta", description: "Your notes are recognized for quality" };
    if (uploads >= 10) return { level: "Rising Star", color: "from-neon-teal to-neon-blue", description: "Keep uploading to build your reputation" };
    return { level: "Beginner", color: "from-gray-400 to-gray-500", description: "Start your journey by uploading notes" };
  };

  const badge = getBadgeLevel(uploadsProgress);
  const maxEarnings = Math.max(...monthlyData.map(d => d.earnings));
  const uploadsToNext = uploadsProgress < 10 ? 10 - uploadsProgress : uploadsProgress < 50 ? 50 - uploadsProgress : 100 - uploadsProgress;
  const nextLevel = uploadsProgress < 10 ? "Rising Star" : uploadsProgress < 50 ? "Trusted" : "Top Contributor";

  return (
    <TooltipProvider>
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
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge className={`mt-3 md:mt-0 w-fit px-4 py-2 bg-gradient-to-r ${badge.color} text-white font-semibold cursor-help`}>
                  <Award className="h-4 w-4 mr-2" />
                  {badge.level}
                </Badge>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="font-medium mb-1">Academic Reputation: {badge.level}</p>
                <p className="text-sm text-muted-foreground">{badge.description}</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            {statsData.map((stat, index) => (
              <StatCard key={index} stat={stat} index={index} />
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
                    <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                      <div 
                        className="w-full bg-gradient-to-t from-neon-teal to-neon-violet rounded-t-md transition-all duration-500 group-hover:shadow-glow-teal/50"
                        style={{ 
                          height: `${(data.earnings / maxEarnings) * 100}%`,
                          animationDelay: `${index * 0.1}s`
                        }}
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

            {/* Progress Widget with Explanation */}
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="h-5 w-5 text-neon-violet" />
                  Upload Milestone
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Upload more notes to unlock badges and increase your reputation. Higher reputation = more visibility!</p>
                    </TooltipContent>
                  </Tooltip>
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
                      className="transition-all duration-1000"
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
                  Upload <span className="text-neon-teal font-semibold">{uploadsToNext} more</span> notes to reach <span className="text-neon-violet font-semibold">{nextLevel}</span>!
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
                    className={`flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-all duration-300 ${
                      visibleActivities.includes(index) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                    }`}
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    <div className={`w-8 h-8 rounded-full ${activity.isNew ? 'bg-neon-teal/20' : 'bg-primary/10'} flex items-center justify-center flex-shrink-0`}>
                      <activity.icon className={`h-4 w-4 ${activity.isNew ? 'text-neon-teal' : 'text-primary'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm">{activity.message}</p>
                        {activity.isNew && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-neon-teal/20 text-neon-teal">
                            New
                          </Badge>
                        )}
                      </div>
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
              className="h-auto py-4 flex flex-col gap-2 border-neon-teal/30 hover:border-neon-teal hover:shadow-glow-teal/20 hover:-translate-y-0.5 transition-all duration-300"
              onClick={() => navigate("/materials")}
            >
              <Upload className="h-5 w-5 text-neon-teal" />
              <span className="text-sm">Upload Notes</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col gap-2 border-neon-violet/30 hover:border-neon-violet hover:shadow-glow-violet/20 hover:-translate-y-0.5 transition-all duration-300"
              onClick={() => navigate("/wallet")}
            >
              <Wallet className="h-5 w-5 text-neon-violet" />
              <span className="text-sm">View Wallet</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col gap-2 border-neon-magenta/30 hover:border-neon-magenta hover:shadow-glow-magenta/20 hover:-translate-y-0.5 transition-all duration-300"
              onClick={() => navigate("/questions")}
            >
              <MessageSquare className="h-5 w-5 text-neon-magenta" />
              <span className="text-sm">Answer Questions</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col gap-2 border-yellow-500/30 hover:border-yellow-500 hover:-translate-y-0.5 transition-all duration-300"
              onClick={() => navigate("/premium")}
            >
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="text-sm">Go Premium</span>
            </Button>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
