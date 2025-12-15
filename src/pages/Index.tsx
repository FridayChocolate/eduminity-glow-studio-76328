import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { HeroSection } from "@/components/HeroSection";
import { SocialProofStrip } from "@/components/SocialProofStrip";
import { TrendingSection } from "@/components/TrendingSection";
import { SuccessStoryCard } from "@/components/SuccessStoryCard";
import { MaterialCard } from "@/components/MaterialCard";
import { LeaderboardCard } from "@/components/LeaderboardCard";
import { CommunitySection } from "@/components/CommunitySection";
import { WorkCommunity } from "@/components/WorkCommunity";
import { Footer } from "@/components/Footer";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, HelpCircle, Users, Award, Heart, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ScrollReveal } from "@/hooks/useScrollReveal";

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

  const featureCards = [
    { icon: HelpCircle, title: "Q&A Help", description: "Get expert answers to your academic questions", color: "neon-teal", route: "/questions" },
    { icon: BookOpen, title: "Study Hub", description: "Quick summaries, notes & study guides", color: "neon-violet", route: "/materials" },
    { icon: Users, title: "Community", description: "Connect with students and share knowledge", color: "neon-magenta", route: "/community" },
    { icon: Award, title: "Achievements", description: "Earn badges and climb the leaderboard", color: "yellow-500", route: null },
    { icon: Heart, title: "Donate", description: "Support students with free study materials", color: "red-500", route: "/donate" },
    { icon: Crown, title: "Premium", description: "Upgrade for ad-free and premium features", color: "purple-500", route: "/premium" },
  ];

  return (
    <div className="min-h-screen bg-background font-['Inter']">
      <Header />
      
      <div className="flex">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        
        <main className="flex-1 p-3 md:p-6">
          <ScrollReveal>
            <HeroSection />
          </ScrollReveal>
          
          <ScrollReveal delay={100}>
            <SocialProofStrip />
          </ScrollReveal>
          
          <ScrollReveal delay={150}>
            <TrendingSection />
          </ScrollReveal>
          
          <ScrollReveal delay={200}>
            <SuccessStoryCard />
          </ScrollReveal>

          {/* Feature Cards */}
          <ScrollReveal delay={250}>
            <section className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
              {featureCards.map((card, index) => (
                <Card
                  key={index}
                  className={`cursor-pointer hover:shadow-lg transition-all duration-300 border-border/50 hover:border-${card.color}/50 hover:-translate-y-1 group`}
                  onClick={() => card.route && navigate(card.route)}
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <CardHeader className="p-3 md:p-6">
                    <card.icon className={`h-6 w-6 md:h-8 md:w-8 text-${card.color} mb-1 md:mb-2 transition-transform duration-300 group-hover:scale-110`} />
                    <CardTitle className="text-sm md:text-base">{card.title}</CardTitle>
                    <CardDescription className="text-xs md:text-sm">{card.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </section>
          </ScrollReveal>
          
          <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
            <div className="flex-1">
              <ScrollReveal>
                <section id="sheets" className="mb-6 md:mb-8">
                  <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 dark:text-neon-teal">Study Materials</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {studyMaterials.map((material, index) => (
                      <ScrollReveal key={index} delay={index * 100}>
                        <MaterialCard {...material} />
                      </ScrollReveal>
                    ))}
                  </div>
                </section>
              </ScrollReveal>

              <ScrollReveal>
                <WorkCommunity />
              </ScrollReveal>
              
              <ScrollReveal>
                <CommunitySection />
              </ScrollReveal>
              
              <Footer />
            </div>

            <aside className="hidden xl:block w-80">
              <ScrollReveal direction="left">
                <LeaderboardCard />
              </ScrollReveal>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
