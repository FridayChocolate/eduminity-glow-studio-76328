import { FileText, User, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MaterialCardProps {
  title: string;
  author: string;
  description: string;
  subject: string;
  rating: number;
  price: string;
}

export const MaterialCard = ({ title, author, description, subject, rating, price }: MaterialCardProps) => {
  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 dark:border-neon-teal/30 dark:hover:shadow-glow-teal animate-fade-in bg-gradient-card">
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary dark:text-neon-teal transition-transform duration-300 group-hover:scale-110" />
            <Badge variant="secondary" className="text-xs dark:bg-neon-violet/20 dark:text-neon-violet">
              {subject}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-accent text-accent dark:fill-neon-magenta dark:text-neon-magenta" />
            <span className="font-medium dark:text-neon-magenta">{rating}</span>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-1 group-hover:text-primary dark:group-hover:text-neon-teal transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 dark:text-foreground/70">
            {description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border dark:border-neon-teal/20">
          <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-foreground/60">
            <User className="h-4 w-4" />
            <span>{author}</span>
          </div>
          <span className="font-bold text-primary dark:text-neon-teal">{price}</span>
        </div>
      </div>
    </Card>
  );
};
