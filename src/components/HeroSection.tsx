import heroImage from "@/assets/hero-bg.jpg";

export const HeroSection = () => {
  return (
    <section className="relative h-48 md:h-64 overflow-hidden rounded-xl mb-6 md:mb-8 bg-gradient-hero dark:shadow-glow-teal">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 dark:opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 md:px-6">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent dark:from-neon-teal dark:via-neon-violet dark:to-neon-magenta drop-shadow-lg">
          Empowering Students Through Shared Knowledge
        </h1>
        <p className="text-sm md:text-lg text-foreground/70 max-w-2xl dark:text-foreground/80">
          Upload, discover, and excel with Bangladesh's premier student resource platform
        </p>
      </div>
    </section>
  );
};
