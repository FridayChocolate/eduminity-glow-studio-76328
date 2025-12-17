import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, Clock, Bookmark, TrendingUp, 
  Play, ChevronRight, Flame, Target,
  FileText, Star, Coins, Calendar
} from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";

const continueStudyingData = [
  { id: 1, title: "Organic Chemistry Basics", progress: 65, subject: "Chemistry", timeLeft: "25 min", thumbnail: "🧪" },
  { id: 2, title: "Calculus Integration", progress: 40, subject: "Mathematics", timeLeft: "45 min", thumbnail: "📐" },
  { id: 3, title: "Bangladesh History", progress: 80, subject: "History", timeLeft: "10 min", thumbnail: "📜" },
];

const savedNotesData = [
  { id: 1, title: "Physics Formula Sheet", author: "Rafiul H.", rating: 4.9, type: "Quick Summary" },
  { id: 2, title: "HSC Biology Complete", author: "Sadia N.", rating: 4.8, type: "Exam Notes" },
  { id: 3, title: "English Grammar Guide", author: "Tanvir A.", rating: 4.7, type: "Concept Guide" },
];

const recommendedContent = [
  { id: 1, title: "ICT Chapter 5 Notes", match: "98%", reason: "Based on your recent activity", thumbnail: "💻" },
  { id: 2, title: "Chemistry Lab Manual", match: "95%", reason: "Popular in your class", thumbnail: "🔬" },
  { id: 3, title: "Physics Problem Sets", match: "92%", reason: "Trending this week", thumbnail: "⚡" },
];

const StatCard = ({ icon: Icon, label, value, color, suffix = "" }: { 
  icon: typeof BookOpen; 
  label: string; 
  value: number; 
  color: string;
  suffix?: string;
}) => {
  const { count, ref } = useCountUp({ end: value, duration: 1200 });
  
  return (
    <Card ref={ref} className="student-card border-border/30 hover:border-student-accent/30 transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-4 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <div className="text-2xl font-bold text-foreground">{count}{suffix}</div>
          <div className="text-sm text-muted-foreground">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function StudentDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [studyStreak] = useState(7);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background student-mode">
      <Header />
      
      <main className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-1">
                Good morning! 📚
              </h1>
              <p className="text-muted-foreground">Ready to continue your learning journey?</p>
            </div>
            <div className="flex items-center gap-3">
              <Card className="px-4 py-2 flex items-center gap-2 border-orange-500/30 bg-orange-500/10">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="font-semibold text-orange-500">{studyStreak} day streak!</span>
              </Card>
              <Card className="px-4 py-2 flex items-center gap-2 border-student-accent/30 bg-student-accent/10">
                <Coins className="h-5 w-5 text-student-accent" />
                <span className="font-semibold text-student-accent">245 coins</span>
              </Card>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={BookOpen} label="Notes Studied" value={47} color="bg-student-accent" />
          <StatCard icon={Clock} label="Hours Studied" value={32} color="bg-blue-500" />
          <StatCard icon={Bookmark} label="Saved Notes" value={18} color="bg-violet-500" />
          <StatCard icon={Target} label="Goals Completed" value={12} color="bg-emerald-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Continue Studying */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="student-card border-border/30">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Play className="h-5 w-5 text-student-accent" />
                    Continue Studying
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-student-accent">
                    View All <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {continueStudyingData.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-student-accent/20 flex items-center justify-center text-2xl">
                      {item.thumbnail}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate group-hover:text-student-accent transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">{item.subject}</Badge>
                        <span className="text-xs text-muted-foreground">{item.timeLeft} left</span>
                      </div>
                      <Progress value={item.progress} className="h-1.5 mt-2" />
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-student-accent">{item.progress}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recommended For You */}
            <Card className="student-card border-border/30">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                    Recommended For You
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {recommendedContent.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer group border border-transparent hover:border-student-accent/30"
                    >
                      <div className="text-3xl mb-3">{item.thumbnail}</div>
                      <h3 className="font-medium text-sm mb-1 group-hover:text-student-accent transition-colors">
                        {item.title}
                      </h3>
                      <Badge variant="outline" className="text-xs text-emerald-500 border-emerald-500/30">
                        {item.match} match
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-2">{item.reason}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* My Library */}
            <Card className="student-card border-border/30">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bookmark className="h-5 w-5 text-violet-500" />
                  My Library
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {savedNotesData.map((note) => (
                  <div
                    key={note.id}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-all cursor-pointer group"
                  >
                    <FileText className="h-5 w-5 text-muted-foreground mt-0.5 group-hover:text-student-accent" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate group-hover:text-student-accent">
                        {note.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground">by {note.author}</span>
                        <div className="flex items-center gap-0.5">
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-xs">{note.rating}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">{note.type}</Badge>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full mt-2">
                  View All Saved
                </Button>
              </CardContent>
            </Card>

            {/* Study Calendar */}
            <Card className="student-card border-border/30">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  Study Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Physics Revision</span>
                      <Badge variant="secondary" className="text-xs">Today</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">4:00 PM - 5:30 PM</span>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Math Practice</span>
                      <Badge variant="outline" className="text-xs">Tomorrow</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">10:00 AM - 12:00 PM</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
