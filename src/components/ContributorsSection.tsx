import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface Contributor {
  name: string;
  role: string;
  avatar?: string;
  contributions: number;
  rating: number;
}

export const ContributorsSection = () => {
  const topContributors: Contributor[] = [
    {
      name: "Rafiul Hasan",
      role: "Computer Science Expert",
      contributions: 284,
      rating: 4.9,
    },
    {
      name: "Taslima Akter",
      role: "Mathematics Specialist",
      contributions: 265,
      rating: 4.8,
    },
    {
      name: "Sadia Noor",
      role: "Chemistry Expert",
      contributions: 243,
      rating: 4.9,
    },
    {
      name: "Mehedi Chowdhury",
      role: "Physics Specialist",
      contributions: 219,
      rating: 4.7,
    },
    {
      name: "Naimur Rahman",
      role: "Statistics Expert",
      contributions: 208,
      rating: 4.8,
    },
    {
      name: "Farzana Jahan",
      role: "Literature Specialist",
      contributions: 196,
      rating: 4.8,
    },
  ];

  return (
    <section className="mb-6 md:mb-8">
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 dark:text-neon-violet">Top Contributors</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topContributors.map((contributor, index) => (
          <Card key={index} className="p-4 bg-gradient-card dark:border-neon-violet/30 dark:shadow-glow-violet hover:scale-105 transition-transform cursor-pointer">
            <div className="flex items-start gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={contributor.avatar} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {contributor.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate">{contributor.name}</h3>
                <p className="text-xs text-muted-foreground dark:text-foreground/60 mb-2">{contributor.role}</p>
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="secondary" className="text-xs">
                    {contributor.contributions} uploads
                  </Badge>
                  <div className="flex items-center gap-1 text-accent dark:text-neon-teal">
                    <Star className="h-3 w-3 fill-current" />
                    <span className="font-medium">{contributor.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};
