import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { HeroSection } from "@/components/HeroSection";
import { MaterialCard } from "@/components/MaterialCard";
import { LeaderboardCard } from "@/components/LeaderboardCard";
import { CommunitySection } from "@/components/CommunitySection";
import { WorkCommunity } from "@/components/WorkCommunity";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, HelpCircle, Users, Award, Heart, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  const studyMaterials = [
    {
      title: "Complete CSE 101 Notes",
      author: "Rafiul Hasan",
      description: "Comprehensive notes covering all topics from data structures to algorithms",
      subject: "Computer Science",
      rating: 4.8,
      price: "৳150"
    },
    {
      title: "Engineering Mathematics Guide",
      author: "Taslima Akter",
      description: "Detailed solutions and theory for engineering mathematics semester exam",
      subject: "Mathematics",
      rating: 4.9,
      price: "৳200"
    },
    {
      title: "Physics Lab Reports Collection",
      author: "Mehedi Chowdhury",
      description: "All physics lab experiments with detailed observations and results",
      subject: "Physics",
      rating: 4.7,
      price: "৳120"
    },
    {
      title: "Organic Chemistry Notes",
      author: "Sadia Noor",
      description: "Complete organic chemistry notes with reactions and mechanisms",
      subject: "Chemistry",
      rating: 4.9,
      price: "৳180"
    },
    {
      title: "Business Statistics Summary",
      author: "Naimur Rahman",
      description: "Quick revision notes for business statistics final exam",
      subject: "Statistics",
      rating: 4.6,
      price: "৳100"
    },
    {
      title: "English Literature Guide",
      author: "Farzana Jahan",
      description: "Analysis and summaries of prescribed English literature texts",
      subject: "Literature",
      rating: 4.8,
      price: "৳160"
    },
  ];

  return (
    <div className="min-h-screen bg-background font-['Inter']">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6">
          <HeroSection />

          {/* Feature Cards */}
          <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <Card
              className="cursor-pointer hover:shadow-lg transition-all border-border/50 hover:border-neon-teal/50"
              onClick={() => navigate("/questions")}
            >
              <CardHeader>
                <HelpCircle className="h-8 w-8 text-neon-teal mb-2" />
                <CardTitle>Q&A Help</CardTitle>
                <CardDescription>Get expert answers to your academic questions</CardDescription>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition-all border-border/50 hover:border-neon-violet/50"
              onClick={() => navigate("/materials")}
            >
              <CardHeader>
                <BookOpen className="h-8 w-8 text-neon-violet mb-2" />
                <CardTitle>Study Hub</CardTitle>
                <CardDescription>Quick summaries, notes & study guides</CardDescription>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition-all border-border/50 hover:border-neon-magenta/50"
              onClick={() => navigate("/community")}
            >
              <CardHeader>
                <Users className="h-8 w-8 text-neon-magenta mb-2" />
                <CardTitle>Community</CardTitle>
                <CardDescription>Connect with students and share knowledge</CardDescription>
              </CardHeader>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-all border-border/50 hover:border-yellow-500/50">
              <CardHeader>
                <Award className="h-8 w-8 text-yellow-500 mb-2" />
                <CardTitle>Achievements</CardTitle>
                <CardDescription>Earn badges and climb the leaderboard</CardDescription>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition-all border-border/50 hover:border-red-500/50"
              onClick={() => navigate("/donate")}
            >
              <CardHeader>
                <Heart className="h-8 w-8 text-red-500 mb-2" />
                <CardTitle>Donate</CardTitle>
                <CardDescription>Support students with free study materials</CardDescription>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition-all border-border/50 hover:border-purple-500/50"
              onClick={() => navigate("/premium")}
            >
              <CardHeader>
                <Crown className="h-8 w-8 text-purple-500 mb-2" />
                <CardTitle>Premium</CardTitle>
                <CardDescription>Upgrade for ad-free and premium features</CardDescription>
              </CardHeader>
            </Card>
          </section>
          
          <div className="flex gap-6">
            <div className="flex-1">
              <section id="sheets" className="mb-8">
                <h2 className="text-2xl font-bold mb-6 dark:text-neon-teal">Study Materials</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {studyMaterials.map((material, index) => (
                    <MaterialCard key={index} {...material} />
                  ))}
                </div>
              </section>

              <WorkCommunity />
              <CommunitySection />
              <Footer />
            </div>

            <aside className="w-80">
              <LeaderboardCard />
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
