import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Crown, Zap, Star, Sparkles, Shield, Heart } from "lucide-react";
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
    icon: Zap,
    color: "from-blue-500 to-cyan-500",
    iconColor: "text-blue-500",
  },
  {
    name: "Quarterly",
    price: 799,
    period: "3 months",
    savings: "Save ৳98",
    icon: Crown,
    color: "from-neon-violet to-neon-magenta",
    iconColor: "text-neon-violet",
    recommended: true,
  },
  {
    name: "Annual",
    price: 2499,
    period: "year",
    savings: "Save ৳1,089",
    icon: Star,
    color: "from-yellow-500 to-orange-500",
    iconColor: "text-yellow-500",
  },
];

const comparisonFeatures = [
  { feature: "Advertisements", free: "Yes (with ads)", premium: "No ads" },
  { feature: "Daily Downloads", free: "5 per day", premium: "Unlimited" },
  { feature: "Q&A Priority", free: "Standard", premium: "Priority response" },
  { feature: "Premium Badge", free: false, premium: true },
  { feature: "Early Access", free: false, premium: true },
  { feature: "Support", free: "Community", premium: "Priority support" },
];

export default function Premium() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchSubscriptionData();
  }, [user, navigate]);

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

  return (
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
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Ad-free learning and full access to the best notes from top contributors across Bangladesh
          </p>
          {isPremium && (
            <Badge className="mt-6 text-lg px-6 py-2 bg-gradient-to-r from-neon-violet to-neon-magenta">
              <Crown className="h-4 w-4 mr-2" />
              Current Plan: {subscription?.tier?.toUpperCase()}
            </Badge>
          )}
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`relative overflow-hidden transition-all duration-300 hover:scale-105 animate-fade-in ${
                plan.recommended 
                  ? "border-2 border-neon-violet shadow-lg shadow-neon-violet/20" 
                  : "border-border/50 hover:border-primary/30"
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.recommended && (
                <Badge className="absolute top-4 right-4 bg-gradient-to-r from-neon-violet to-neon-magenta">
                  Recommended
                </Badge>
              )}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${plan.color}`} />
              <CardHeader className="text-center pt-8 pb-4">
                <div className={`w-14 h-14 mx-auto rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                  <plan.icon className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
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
              <CardFooter>
                <Button 
                  className={`w-full ${plan.recommended ? "bg-gradient-to-r from-neon-violet to-neon-magenta hover:opacity-90" : ""}`}
                  variant={plan.recommended ? "default" : "outline"}
                  onClick={() => handleUpgrade(plan.name)}
                  disabled={isPremium}
                >
                  {isPremium ? "Already Premium" : `Get ${plan.name}`}
                </Button>
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
                    <tr key={index} className="border-b border-border/30 last:border-0">
                      <td className="p-4 text-sm">{row.feature}</td>
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
  );
}
