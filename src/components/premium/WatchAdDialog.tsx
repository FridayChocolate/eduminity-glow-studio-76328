import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Tv, Coins } from "lucide-react";

interface WatchAdDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdWatched?: () => void;
}

export const WatchAdDialog = ({ open, onOpenChange, onAdWatched }: WatchAdDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [watching, setWatching] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const [canClaim, setCanClaim] = useState(false);

  const startAdSimulation = () => {
    setWatching(true);
    setCountdown(15);
    setCanClaim(false);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanClaim(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const claimReward = async () => {
    if (!user) return;

    try {
      // Record ad view
      const { error: adError } = await supabase.from("ad_views").insert({
        user_id: user.id,
        coins_earned: 5,
        ad_type: "video",
      });

      if (adError) throw adError;

      // Update wallet
      const { data: wallet, error: walletFetchError } = await supabase
        .from("wallets")
        .select("balance")
        .eq("user_id", user.id)
        .single();

      if (walletFetchError) throw walletFetchError;

      const newBalance = (parseFloat(wallet.balance.toString()) || 0) + 5;

      const { error: walletError } = await supabase
        .from("wallets")
        .update({ balance: newBalance })
        .eq("user_id", user.id);

      if (walletError) throw walletError;

      // Record transaction
      await supabase.from("transactions").insert({
        user_id: user.id,
        type: "earn",
        amount: 5,
        description: "Earned from watching advertisement",
      });

      toast({
        title: "Reward Claimed!",
        description: "You earned 5 coins for watching the ad!",
      });

      onAdWatched?.();
      onOpenChange(false);
      setWatching(false);
      setCanClaim(false);
    } catch (error) {
      console.error("Error claiming reward:", error);
      toast({
        title: "Error",
        description: "Failed to claim reward. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tv className="h-5 w-5" />
            Watch Ad to Earn Coins
          </DialogTitle>
          <DialogDescription>
            Watch a short advertisement to earn 5 coins that you can use to unlock study materials!
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-8">
          {!watching ? (
            <div className="text-center space-y-4">
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 dark:from-neon-teal/20 dark:to-neon-violet/20 rounded-lg p-8">
                <Coins className="h-16 w-16 mx-auto mb-4 text-primary dark:text-neon-teal" />
                <p className="text-2xl font-bold">Earn 5 Coins</p>
                <p className="text-sm text-muted-foreground mt-2">Watch a 15-second ad</p>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="relative w-full aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                {!canClaim ? (
                  <div className="space-y-4">
                    <div className="animate-pulse">
                      <Tv className="h-16 w-16 text-muted-foreground mx-auto" />
                    </div>
                    <p className="text-4xl font-bold text-primary dark:text-neon-teal">{countdown}s</p>
                    <p className="text-sm text-muted-foreground">Please wait...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Coins className="h-16 w-16 text-primary dark:text-neon-teal mx-auto animate-bounce" />
                    <p className="text-lg font-semibold text-green-500">Ad Complete!</p>
                    <p className="text-sm text-muted-foreground">Click below to claim your reward</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {!watching ? (
            <Button onClick={startAdSimulation} className="w-full">
              <Tv className="h-4 w-4 mr-2" />
              Start Watching
            </Button>
          ) : (
            <Button onClick={claimReward} disabled={!canClaim} className="w-full">
              <Coins className="h-4 w-4 mr-2" />
              Claim 5 Coins
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};