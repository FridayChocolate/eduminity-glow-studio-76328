import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sparkles, TrendingUp } from "lucide-react";

export const SuccessStoryCard = () => {
  return (
    <Card className="mb-6 md:mb-8 border-neon-violet/30 bg-gradient-to-r from-neon-violet/5 to-neon-magenta/5 dark:from-neon-violet/10 dark:to-neon-magenta/10 overflow-hidden">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-neon-violet" />
          <span className="text-sm font-medium text-neon-violet">Student Success</span>
        </div>
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 md:h-16 md:w-16 border-2 border-neon-violet/50">
            <AvatarFallback className="bg-gradient-to-br from-neon-teal to-neon-violet text-white font-bold">
              RH
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm md:text-base text-foreground">
              <span className="font-semibold">Rafiul Hasan</span> sold{" "}
              <span className="text-neon-teal font-bold">87 notes</span> this month and earned{" "}
              <span className="text-neon-magenta font-bold">৳3,400</span>
            </p>
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span>Top 5% contributor this month</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
