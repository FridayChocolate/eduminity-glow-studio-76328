import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, Star } from "lucide-react";
import { Header } from "@/components/Header";

interface Subscription {
  tier: string;
  status: string;
  expires_at: string | null;
}

interface PremiumFeature {
  name: string;
  description: string;
  tier: string;
}

const tierPricing = {
  basic: { price: 299, period: "month", color: "from-blue-500 to-cyan-500" },
  premium: { price: 499, period: "month", color: "from-purple-500 to-pink-500" },
  pro: { price: 899, period: "month", color: "from-orange-500 to-red-500" },
};

export default function Premium() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [features, setFeatures] = useState<PremiumFeature[]>([]);
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
      const [subResponse, featuresResponse] = await Promise.all([
        supabase.from("subscriptions").select("*").eq("user_id", user?.id).single(),
        supabase.from("premium_features").select("*").order("tier", { ascending: true }),
      ]);

      if (subResponse.data) setSubscription(subResponse.data);
      if (featuresResponse.data) setFeatures(featuresResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = (tier: string) => {
    toast({
      title: "Coming Soon!",
      description: `${tier} subscription will be available soon. Payment integration is being set up.`,
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

  const currentTier = subscription?.tier || "free";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary dark:from-neon-teal dark:to-neon-violet bg-clip-text text-transparent">
            Upgrade to Premium
          </h1>
          <p className="text-muted-foreground text-lg">
            Unlock exclusive features and support the community
          </p>
          {currentTier !== "free" && (
            <Badge className="mt-4 text-lg px-4 py-2 bg-gradient-to-r from-primary to-secondary">
              Current Plan: {currentTier.toUpperCase()}
            </Badge>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Basic Plan */}
          <Card className={`relative overflow-hidden ${currentTier === "basic" ? "border-primary shadow-lg shadow-primary/20" : ""}`}>
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${tierPricing.basic.color}`}></div>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-6 w-6 text-blue-500" />
                <CardTitle>Basic</CardTitle>
              </div>
              <CardDescription>Perfect for regular students</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">৳{tierPricing.basic.price}</span>
                <span className="text-muted-foreground">/{tierPricing.basic.period}</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {features.filter(f => f.tier === "basic").map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">{feature.name}</p>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handleUpgrade("Basic")}
                disabled={currentTier === "basic"}
              >
                {currentTier === "basic" ? "Current Plan" : "Upgrade to Basic"}
              </Button>
            </CardFooter>
          </Card>

          {/* Premium Plan */}
          <Card className={`relative overflow-hidden ${currentTier === "premium" ? "border-primary shadow-lg shadow-primary/20" : "border-2 border-primary"}`}>
            <Badge className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500">
              Popular
            </Badge>
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${tierPricing.premium.color}`}></div>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-6 w-6 text-purple-500" />
                <CardTitle>Premium</CardTitle>
              </div>
              <CardDescription>Best for serious learners</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">৳{tierPricing.premium.price}</span>
                <span className="text-muted-foreground">/{tierPricing.premium.period}</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {features.filter(f => f.tier === "premium" || f.tier === "basic").map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">{feature.name}</p>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" 
                onClick={() => handleUpgrade("Premium")}
                disabled={currentTier === "premium"}
              >
                {currentTier === "premium" ? "Current Plan" : "Upgrade to Premium"}
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Plan */}
          <Card className={`relative overflow-hidden ${currentTier === "pro" ? "border-primary shadow-lg shadow-primary/20" : ""}`}>
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${tierPricing.pro.color}`}></div>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-6 w-6 text-orange-500" />
                <CardTitle>Pro</CardTitle>
              </div>
              <CardDescription>For power users & contributors</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">৳{tierPricing.pro.price}</span>
                <span className="text-muted-foreground">/{tierPricing.pro.period}</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">{feature.name}</p>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600" 
                onClick={() => handleUpgrade("Pro")}
                disabled={currentTier === "pro"}
              >
                {currentTier === "pro" ? "Current Plan" : "Upgrade to Pro"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}