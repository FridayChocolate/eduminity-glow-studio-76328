import heroImage from "@/assets/hero-bg.jpg";

export const HeroSection = () => {
  return (
    <section className="relative h-64 overflow-hidden rounded-xl mb-8 bg-gradient-hero dark:shadow-glow-teal">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 dark:opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent dark:from-neon-teal dark:via-neon-violet dark:to-neon-magenta">
          Empowering Students Through Shared Knowledge
        </h1>
        <p className="text-lg text-foreground/70 max-w-2xl dark:text-foreground/80">
          Upload, discover, and excel with Bangladesh's premier student resource platform
        </p>
      </div>
    </section>
  );
};
