import { Trophy, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

interface LeaderboardItemProps {
  rank: number;
  name: string;
  points: number;
}

const LeaderboardItem = ({ rank, name, points }: LeaderboardItemProps) => {
  const isTopThree = rank <= 3;
  const glowClass = rank === 1 ? "dark:shadow-glow-teal" : rank === 2 ? "dark:shadow-glow-violet" : rank === 3 ? "dark:shadow-glow-magenta" : "";
  
  return (
    <div className={`flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-all dark:hover:bg-muted/30 ${glowClass} ${isTopThree ? 'bg-muted/30 dark:bg-muted/20' : ''}`}>
      <div className="flex items-center gap-3">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
          rank === 1 ? 'bg-accent text-accent-foreground dark:bg-neon-teal dark:text-background' :
          rank === 2 ? 'bg-secondary text-secondary-foreground dark:bg-neon-violet dark:text-background' :
          rank === 3 ? 'bg-primary text-primary-foreground dark:bg-neon-magenta dark:text-background' :
          'bg-muted text-muted-foreground'
        }`}>
          {rank}
        </div>
        <div>
          <p className="font-medium text-sm">{name}</p>
          <p className="text-xs text-muted-foreground dark:text-foreground/60">{points} points</p>
        </div>
      </div>
      {isTopThree && <Trophy className="h-4 w-4 text-accent dark:text-neon-teal" />}
    </div>
  );
};

export const LeaderboardCard = () => {
  const topContributors = [
    { rank: 1, name: "Rafiul Hasan", points: 2847 },
    { rank: 2, name: "Taslima Akter", points: 2654 },
    { rank: 3, name: "Sadia Noor", points: 2431 },
    { rank: 4, name: "Mehedi Chowdhury", points: 2198 },
    { rank: 5, name: "Naimur Rahman", points: 2087 },
    { rank: 6, name: "Farzana Jahan", points: 1965 },
    { rank: 7, name: "Ashraful Islam", points: 1842 },
    { rank: 8, name: "Rubaiya Sultana", points: 1756 },
  ];

  return (
    <Card className="p-4 bg-gradient-card dark:border-neon-violet/30 dark:shadow-glow-violet">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-primary dark:text-neon-violet" />
        <h2 className="font-bold text-lg dark:text-neon-violet">Top Contributors</h2>
      </div>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {topContributors.map((contributor) => (
          <LeaderboardItem key={contributor.rank} {...contributor} />
        ))}
      </div>
    </Card>
  );
};
