import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Star, Eye } from "lucide-react";

const trendingNotes = [
  { title: "HSC Physics Complete Guide", author: "Tanvir Ahmed", views: 1240, rating: 4.9, subject: "Physics" },
  { title: "SSC Math Formula Sheet", author: "Fatima Khatun", views: 980, rating: 4.8, subject: "Math" },
  { title: "English Grammar Mastery", author: "Rahim Uddin", views: 856, rating: 4.7, subject: "English" },
  { title: "Chemistry Lab Manual", author: "Nasrin Akter", views: 742, rating: 4.9, subject: "Chemistry" },
];

export const TrendingSection = () => {
  return (
    <section className="mb-6 md:mb-8">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-neon-teal" />
        <h2 className="text-xl md:text-2xl font-bold dark:text-neon-teal">Trending Now</h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {trendingNotes.map((note, index) => (
          <Card
            key={index}
            className="group cursor-pointer border-border/50 hover:border-neon-teal/50 transition-all duration-300 hover:shadow-lg dark:hover:shadow-glow-teal/20 overflow-hidden animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader className="p-3 md:p-4 pb-2">
              <Badge variant="secondary" className="w-fit text-xs mb-2">
                {note.subject}
              </Badge>
              <CardTitle className="text-sm md:text-base line-clamp-2 group-hover:text-neon-teal transition-colors">
                {note.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-4 pt-0">
              <p className="text-xs text-muted-foreground mb-2">by {note.author}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {note.views}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  {note.rating}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
