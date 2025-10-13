import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Heart, Users, TrendingUp } from "lucide-react";
import { Header } from "@/components/Header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Donation {
  id: string;
  amount: number;
  message: string | null;
  is_anonymous: boolean;
  created_at: string;
  donor_user_id: string;
}

export default function Donate() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [recentDonations, setRecentDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState({ total: 0, count: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const { data, error } = await supabase
        .from("donations")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      if (data) {
        setRecentDonations(data as Donation[]);
        const total = data.reduce((sum, d) => sum + parseFloat(d.amount.toString()), 0);
        setStats({ total, count: data.length });
      }
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  };

  const handleDonate = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to make a donation.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid donation amount.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Check wallet balance
      const { data: wallet, error: walletError } = await supabase
        .from("wallets")
        .select("balance")
        .eq("user_id", user.id)
        .single();

      if (walletError) throw walletError;

      const donationAmount = parseFloat(amount);
      if (parseFloat(wallet.balance.toString()) < donationAmount) {
        toast({
          title: "Insufficient Balance",
          description: "You don't have enough coins to make this donation.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Create donation
      const { error: donationError} = await supabase.from("donations").insert({
        donor_user_id: user.id,
        amount: donationAmount,
        message: message || null,
        is_anonymous: isAnonymous,
      });

      if (donationError) throw donationError;

      // Update wallet
      const newBalance = parseFloat(wallet.balance.toString()) - donationAmount;
      const { error: updateError } = await supabase
        .from("wallets")
        .update({ 
          balance: newBalance
        })
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      // Record transaction
      await supabase.from("transactions").insert({
        user_id: user.id,
        type: "spend",
        amount: donationAmount,
        description: "Donation to help students access free materials",
      });

      toast({
        title: "Thank You!",
        description: `Your donation of ৳${donationAmount} will help students access materials for free!`,
      });

      setAmount("");
      setMessage("");
      setIsAnonymous(false);
      fetchDonations();
    } catch (error) {
      console.error("Error processing donation:", error);
      toast({
        title: "Error",
        description: "Failed to process donation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary dark:from-neon-teal dark:to-neon-violet bg-clip-text text-transparent">
            Support Education for All
          </h1>
          <p className="text-muted-foreground text-lg">
            Your donation helps students access quality study materials for free
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
              <Heart className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">৳{stats.total.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.count}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Students Helped</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.floor(stats.total / 10)}</div>
              <p className="text-xs text-muted-foreground">Estimated</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Donation Form */}
          <Card>
            <CardHeader>
              <CardTitle>Make a Donation</CardTitle>
              <CardDescription>
                Every coin counts in helping students access education
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="amount">Donation Amount (৳)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                />
              </div>
              <div>
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Leave an inspiring message for students..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="anonymous"
                  checked={isAnonymous}
                  onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
                />
                <Label htmlFor="anonymous" className="text-sm cursor-pointer">
                  Donate anonymously
                </Label>
              </div>
              <Button onClick={handleDonate} className="w-full" disabled={loading || !user}>
                <Heart className="h-4 w-4 mr-2" />
                {loading ? "Processing..." : !user ? "Login to Donate" : "Donate Now"}
              </Button>
              {!user && (
                <p className="text-sm text-muted-foreground text-center">
                  You need to be logged in to make a donation
                </p>
              )}
            </CardContent>
          </Card>

          {/* Recent Donations */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Donations</CardTitle>
              <CardDescription>Thank you to our generous donors!</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentDonations.map((donation) => (
                  <div key={donation.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {donation.is_anonymous ? "?" : "D"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">
                          {donation.is_anonymous ? "Anonymous Donor" : "Generous Donor"}
                        </p>
                        <span className="text-sm font-semibold text-green-500">৳{donation.amount}</span>
                      </div>
                      {donation.message && (
                        <p className="text-sm text-muted-foreground mt-1">{donation.message}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(donation.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                {recentDonations.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No donations yet. Be the first to donate!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}