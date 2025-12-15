import { FileText, Users, Wallet } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";

const StatCard = ({ icon: Icon, value, label, color, suffix = "", index }: {
  icon: React.ElementType;
  value: number;
  label: string;
  color: string;
  suffix?: string;
  index: number;
}) => {
  const { count, ref } = useCountUp({ end: value, duration: 2000, delay: index * 200 });

  return (
    <div
      ref={ref}
      className="group bg-card/50 dark:bg-card/80 backdrop-blur-sm rounded-xl p-3 md:p-5 text-center border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg dark:hover:shadow-glow-teal/20 hover:-translate-y-1 animate-fade-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <Icon className={`h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 ${color} transition-transform duration-300 group-hover:scale-110`} />
      <div className={`text-xl md:text-3xl font-bold ${color} tabular-nums`}>
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-xs md:text-sm text-muted-foreground">{label}</div>
    </div>
  );
};

const stats = [
  { icon: FileText, value: 12400, label: "Notes Shared", color: "text-neon-teal", suffix: "+" },
  { icon: Users, value: 3200, label: "Active Students", color: "text-neon-violet", suffix: "+" },
  { icon: Wallet, value: 480000, label: "Earned by Contributors", color: "text-neon-magenta", suffix: "৳" },
];

export const SocialProofStrip = () => {
  return (
    <section className="grid grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          icon={stat.icon}
          value={stat.value}
          label={stat.label}
          color={stat.color}
          suffix={stat.suffix}
          index={index}
        />
      ))}
    </section>
  );
};
