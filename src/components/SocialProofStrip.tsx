import { FileText, Users, Wallet } from "lucide-react";

const stats = [
  { icon: FileText, value: "12,400+", label: "Notes Shared", color: "text-neon-teal" },
  { icon: Users, value: "3,200+", label: "Active Students", color: "text-neon-violet" },
  { icon: Wallet, value: "৳4.8L+", label: "Earned by Contributors", color: "text-neon-magenta" },
];

export const SocialProofStrip = () => {
  return (
    <section className="grid grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-card/50 dark:bg-card/80 backdrop-blur-sm rounded-xl p-3 md:p-5 text-center border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg dark:hover:shadow-glow-teal/20 animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <stat.icon className={`h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 ${stat.color}`} />
          <div className={`text-xl md:text-3xl font-bold ${stat.color}`}>{stat.value}</div>
          <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
        </div>
      ))}
    </section>
  );
};
