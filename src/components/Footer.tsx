import { Phone, Mail, Facebook, Twitter, Instagram } from "lucide-react";
import { Card } from "@/components/ui/card";

export const Footer = () => {
  return (
    <footer id="support" className="mt-12 pb-8">
      <Card className="p-6 bg-gradient-card dark:border-neon-magenta/30 dark:shadow-glow-magenta">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-bold text-lg mb-3 dark:text-neon-magenta">F&A / Helpline Center</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary dark:text-neon-teal" />
                <span>+880 1712-345678</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary dark:text-neon-teal" />
                <span>+880 1898-765432</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary dark:text-neon-teal" />
                <span>support@eduminity.bd</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-3 dark:text-neon-violet">Sponsorship</h3>
            <p className="text-sm text-muted-foreground dark:text-foreground/70">
              Interested in partnering with us? Contact us for collaboration opportunities to empower students across Bangladesh.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-3 dark:text-neon-blue">Connect With Us</h3>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all dark:hover:bg-neon-teal dark:hover:shadow-glow-teal">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all dark:hover:bg-neon-violet dark:hover:shadow-glow-violet">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all dark:hover:bg-neon-magenta dark:hover:shadow-glow-magenta">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border dark:border-neon-magenta/20 text-center text-sm text-muted-foreground">
          <p>© 2025 Eduminity. Empowering Bangladeshi students through shared knowledge.</p>
        </div>
      </Card>
    </footer>
  );
};
