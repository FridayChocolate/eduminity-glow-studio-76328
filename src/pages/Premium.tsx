import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Check, X, Crown, Zap, Star, Sparkles, Shield, Heart, HelpCircle, AlertCircle, BookOpen, GraduationCap, Users } from "lucide-react";
import { Header } from "@/components/Header";

interface Subscription {
  tier: string;
  status: string;
  expires_at: string | null;
}

const plans = [
  {
    name: "Monthly",
    price: 299,
    period: "month",
    savings: null,
    savingsNote: null,
    icon: Zap,
    color: "from-blue-500 to-cyan-500",
    iconColor: "text-blue-500",
    useCase: "Best for trying out",
    useCaseIcon: Sparkles,
  },
  {
    name: "Quarterly",
    price: 799,
    period: "3 months",
    savings: "Save ৳98",
    savingsNote: null,
    icon: Crown,
    color: "from-neon-violet to-neon-magenta",
    iconColor: "text-neon-violet",
    recommended: true,
    useCase: "Best for exam prep",
    useCaseIcon: GraduationCap,
  },
  {
    name: "Annual",
    price: 2499,
    period: "year",
    savings: "Save ৳1,089",
    savingsNote: "Save 30% compared to monthly",
    icon: Star,
    color: "from-yellow-500 to-orange-500",
    iconColor: "text-yellow-500",
    useCase: "Best for serious students",
    useCaseIcon: BookOpen,
  },
];

const comparisonFeatures = [
  { feature: "Advertisements", free: "Yes (with ads)", premium: "No ads", tooltip: "Premium users enjoy an ad-free experience" },
  { feature: "Daily Downloads", free: "5 per day", premium: "Unlimited", tooltip: "Download as many notes as you need" },
  { feature: "Q&A Priority", free: "Standard", premium: "Priority response", tooltip: "Get faster answers from top contributors" },
  { feature: "Premium Badge", free: false, premium: true, tooltip: "Show your support with a premium badge" },
  { feature: "Early Access", free: false, premium: true, tooltip: "Access new features before everyone else" },
  { feature: "Support", free: "Community", premium: "Priority support", tooltip: "Direct support from our team" },
];

const featureSpotlights = [
  {
    title: "Ad-Free Learning",
    description: "Focus on what matters without distractions",
    icon: Shield,
  },
  {
    title: "Unlimited Downloads",
    description: "Access all study materials anytime",
    icon: BookOpen,
  },
  {
    title: "Priority Q&A",
    description: "Get answers faster from top tutors",
    icon: Zap,
  },
  {
    title: "Support Creators",
    description: "Your subscription helps student contributors",
    icon: Heart,
  },
];

export default function Premium() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSpotlight, setCurrentSpotlight] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchSubscriptionData();
  }, [user, navigate]);

  // Rotate feature spotlight
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSpotlight((prev) => (prev + 1) % featureSpotlights.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      const { data } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (data) setSubscription(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = (plan: string) => {
    toast({
      title: "Coming Soon!",
      description: `${plan} subscription will be available soon. Payment integration is being set up.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  const isPremium = subscription?.tier && subscription.tier !== "free";
  const spotlight = featureSpotlights[currentSpotlight];

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-3 md:px-4 py-8 md:py-12">
          {/* Hero Section */}
          <div className="text-center mb-10 md:mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-violet/10 border border-neon-violet/30 mb-4">
              <Sparkles className="h-4 w-4 text-neon-violet" />
              <span className="text-sm font-medium text-neon-violet">Premium Experience</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-neon-teal via-neon-violet to-neon-magenta bg-clip-text text-transparent">
              Go Premium. Study Without Limits.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-3">
              Ad-free learning and full access to the best notes from top contributors across Bangladesh
            </p>
            
            {/* Emotional benefit highlight */}
            <div className="flex items-center justify-center gap-2 text-sm text-neon-magenta">
              <Heart className="h-4 w-4" />
              <span>Premium directly supports student creators</span>
            </div>

            {isPremium && (
              <Badge className="mt-6 text-lg px-6 py-2 bg-gradient-to-r from-neon-violet to-neon-magenta">
                <Crown className="h-4 w-4 mr-2" />
                Current Plan: {subscription?.tier?.toUpperCase()}
              </Badge>
            )}
          </div>

          {/* Rotating Feature Spotlight */}
          <div className="max-w-md mx-auto mb-8">
            <Card className="border-neon-violet/30 bg-gradient-to-br from-neon-violet/5 to-neon-magenta/5 overflow-hidden">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-violet to-neon-magenta flex items-center justify-center flex-shrink-0 animate-pulse-soft">
                  <spotlight.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm">{spotlight.title}</h3>
                  <p className="text-xs text-muted-foreground">{spotlight.description}</p>
                </div>
                <div className="flex gap-1">
                  {featureSpotlights.map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${i === currentSpotlight ? 'bg-neon-violet' : 'bg-muted'}`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Free Plan Limitation Note */}
          {!isPremium && (
            <div className="max-w-5xl mx-auto mb-8">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-muted/30 rounded-lg py-3 px-4">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                <span>Free users see ads and have limited previews — upgrade for the full experience</span>
              </div>
            </div>
          )}

          {/* Plan Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index}
                className={`relative overflow-hidden transition-all duration-300 hover:scale-105 hover:-translate-y-1 animate-fade-in group ${
                  plan.recommended 
                    ? "border-2 border-neon-violet shadow-lg shadow-neon-violet/20" 
                    : "border-border/50 hover:border-primary/30"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {plan.recommended && (
                  <Badge className="absolute top-4 right-4 bg-gradient-to-r from-neon-violet to-neon-magenta animate-pulse-soft">
                    Recommended
                  </Badge>
                )}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${plan.color}`} />
                <CardHeader className="text-center pt-8 pb-4">
                  <div className={`w-14 h-14 mx-auto rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}>
                    <plan.icon className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  
                  {/* Use Case Framing */}
                  <div className="flex items-center justify-center gap-1.5 mt-2 text-xs text-muted-foreground">
                    <plan.useCaseIcon className="h-3.5 w-3.5" />
                    <span>{plan.useCase}</span>
                  </div>

                  {plan.savings && (
                    <Badge variant="secondary" className="mt-2 w-fit mx-auto bg-green-500/10 text-green-500 border-green-500/30">
                      {plan.savings}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="text-center pb-6">
                  <div className="mb-4">
                    <span className="text-4xl font-bold">৳{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  {plan.savingsNote && (
                    <p className="text-xs text-green-500 mb-3">{plan.savingsNote}</p>
                  )}
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2 justify-center">
                      <Check className="h-4 w-4 text-green-500" /> No advertisements
                    </li>
                    <li className="flex items-center gap-2 justify-center">
                      <Check className="h-4 w-4 text-green-500" /> Unlimited downloads
                    </li>
                    <li className="flex items-center gap-2 justify-center">
                      <Check className="h-4 w-4 text-green-500" /> Premium badge
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                  <Button 
                    className={`w-full transition-all duration-300 ${plan.recommended ? "bg-gradient-to-r from-neon-violet to-neon-magenta hover:opacity-90 hover:shadow-glow-violet" : "hover:-translate-y-0.5"}`}
                    variant={plan.recommended ? "default" : "outline"}
                    onClick={() => handleUpgrade(plan.name)}
                    disabled={isPremium}
                  >
                    {isPremium ? "Already Premium" : `Get ${plan.name}`}
                  </Button>
                  
                  {/* Contributor support note */}
                  <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span>Supports student creators</span>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="max-w-3xl mx-auto mb-12 md:mb-16">
            <h2 className="text-2xl font-bold text-center mb-6 dark:text-neon-teal">Free vs Premium</h2>
            <Card className="border-border/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left p-4 font-medium">Feature</th>
                      <th className="text-center p-4 font-medium">Free</th>
                      <th className="text-center p-4 font-medium bg-neon-violet/5">
                        <div className="flex items-center justify-center gap-2">
                          <Crown className="h-4 w-4 text-neon-violet" />
                          Premium
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((row, index) => (
                      <tr key={index} className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="p-4 text-sm">
                          <div className="flex items-center gap-2">
                            {row.feature}
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{row.tooltip}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </td>
                        <td className="p-4 text-center text-sm">
                          {typeof row.free === "boolean" ? (
                            row.free ? <Check className="h-4 w-4 text-green-500 mx-auto" /> : <X className="h-4 w-4 text-muted-foreground mx-auto" />
                          ) : (
                            <span className="text-muted-foreground">{row.free}</span>
                          )}
                        </td>
                        <td className="p-4 text-center text-sm bg-neon-violet/5">
                          {typeof row.premium === "boolean" ? (
                            row.premium ? <Check className="h-4 w-4 text-green-500 mx-auto" /> : <X className="h-4 w-4 text-muted-foreground mx-auto" />
                          ) : (
                            <span className="text-neon-teal font-medium">{row.premium}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Trust Section */}
          <div className="text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Shield className="h-5 w-5 text-neon-teal" />
              <Heart className="h-5 w-5 text-neon-magenta" />
            </div>
            <p className="text-muted-foreground">
              Your subscription supports real student creators across Bangladesh, helping them earn while you learn.
            </p>
            <Button 
              variant="link" 
              className="mt-4 text-neon-violet"
              onClick={() => navigate("/donate")}
            >
              Or donate directly to help students →
            </Button>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
