import { Button } from "@/components/ui/button";
import { Upload, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-bg.jpg";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden rounded-xl mb-6 md:mb-8 bg-gradient-hero dark:shadow-glow-teal">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20 dark:opacity-10"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="relative z-10 flex flex-col items-center justify-center py-12 md:py-20 text-center px-4 md:px-6">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent dark:from-neon-teal dark:via-neon-violet dark:to-neon-magenta drop-shadow-lg animate-fade-in">
          Turn Your Notes Into Impact
        </h1>
        <p className="text-base md:text-xl text-foreground/70 max-w-2xl mb-6 md:mb-8 dark:text-foreground/80 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          Upload, earn, and help students learn better across Bangladesh
        </p>
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-neon-teal to-neon-violet hover:shadow-glow-teal transition-all duration-300 text-primary-foreground font-semibold px-6 md:px-8"
            onClick={() => navigate("/materials")}
          >
            <Upload className="mr-2 h-5 w-5" />
            Upload Notes
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="border-neon-violet/50 hover:border-neon-violet hover:shadow-glow-violet transition-all duration-300 font-semibold px-6 md:px-8"
            onClick={() => navigate("/materials")}
          >
            <BookOpen className="mr-2 h-5 w-5" />
            Browse Sheets
          </Button>
        </div>
      </div>
    </section>
  );
};
