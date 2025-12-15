import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Star, Eye, Flame } from "lucide-react";

const trendingNotes = [
  { title: "HSC Physics Complete Guide", author: "Tanvir Ahmed", views: 1240, rating: 4.9, subject: "Physics", hot: true },
  { title: "SSC Math Formula Sheet", author: "Fatima Khatun", views: 980, rating: 4.8, subject: "Math", hot: false },
  { title: "English Grammar Mastery", author: "Rahim Uddin", views: 856, rating: 4.7, subject: "English", hot: false },
  { title: "Chemistry Lab Manual", author: "Nasrin Akter", views: 742, rating: 4.9, subject: "Chemistry", hot: true },
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
            className="group cursor-pointer border-border/50 hover:border-neon-teal/50 transition-all duration-300 hover:shadow-lg dark:hover:shadow-glow-teal/20 overflow-hidden animate-fade-in hover:-translate-y-1"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader className="p-3 md:p-4 pb-2">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="w-fit text-xs">
                  {note.subject}
                </Badge>
                {note.hot && (
                  <div className="flex items-center gap-1 text-orange-500">
                    <Flame className="h-3 w-3 animate-pulse-soft" />
                    <span className="text-[10px] font-medium">Hot</span>
                  </div>
                )}
              </div>
              <CardTitle className="text-sm md:text-base line-clamp-2 group-hover:text-neon-teal transition-colors">
                {note.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-4 pt-0">
              <p className="text-xs text-muted-foreground mb-2">by {note.author}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {note.views.toLocaleString()}
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
