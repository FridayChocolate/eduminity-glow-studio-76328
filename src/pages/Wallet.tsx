import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet as WalletIcon, TrendingUp, TrendingDown, Download, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Wallet = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: wallet, isLoading: walletLoading } = useQuery({
    queryKey: ["wallet", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("wallets")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ["transactions", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (!user) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background pt-20 px-6 pb-12">
          <div className="max-w-4xl mx-auto text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Please login to view your wallet</h2>
            <Button onClick={() => navigate("/auth")}>Login</Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background pt-20 px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-teal via-neon-violet to-neon-magenta bg-clip-text text-transparent mb-2">
              My Wallet
            </h1>
            <p className="text-muted-foreground">Manage your coins, earnings, and transactions</p>
          </div>

          {/* Wallet Overview Cards */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-neon-teal/10 to-neon-teal/5 border-neon-teal/30">
              <CardHeader>
                <CardDescription>Current Balance</CardDescription>
                <CardTitle className="text-3xl flex items-center gap-2">
                  <WalletIcon className="h-6 w-6 text-neon-teal" />
                  ৳{walletLoading ? "..." : wallet?.balance || 0}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/30">
              <CardHeader>
                <CardDescription>Total Earned</CardDescription>
                <CardTitle className="text-3xl flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                  ৳{walletLoading ? "..." : wallet?.total_earned || 0}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/30">
              <CardHeader>
                <CardDescription>Total Spent</CardDescription>
                <CardTitle className="text-3xl flex items-center gap-2">
                  <TrendingDown className="h-6 w-6 text-red-500" />
                  ৳{walletLoading ? "..." : wallet?.total_spent || 0}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="bg-gradient-to-br from-neon-violet/10 to-neon-violet/5 border-neon-violet/30">
              <CardHeader>
                <CardDescription>Total Withdrawn</CardDescription>
                <CardTitle className="text-3xl flex items-center gap-2">
                  <Download className="h-6 w-6 text-neon-violet" />
                  ৳{walletLoading ? "..." : wallet?.total_withdrawn || 0}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-8">
            <Button className="flex-1 bg-gradient-to-r from-neon-teal to-neon-violet hover:opacity-90">
              Add Funds
            </Button>
            <Button variant="outline" className="flex-1">
              Withdraw
            </Button>
          </div>

          {/* Transaction History */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Your recent coin transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {transactionsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse flex items-center justify-between p-4 border rounded">
                      <div className="h-4 bg-muted rounded w-1/3" />
                      <div className="h-4 bg-muted rounded w-1/4" />
                    </div>
                  ))}
                </div>
              ) : transactions && transactions.length > 0 ? (
                <div className="space-y-2">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border rounded hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge
                          variant={
                            transaction.type === "earn" || transaction.type === "commission"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {transaction.type}
                        </Badge>
                        <p
                          className={`text-lg font-bold ${
                            transaction.type === "earn" || transaction.type === "commission"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {transaction.type === "earn" || transaction.type === "commission" ? "+" : "-"}
                          ৳{transaction.amount}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No transactions yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Wallet;