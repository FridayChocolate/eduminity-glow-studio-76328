import { MessageCircle, ThumbsUp, Reply } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface CommentProps {
  author: string;
  content: string;
  likes: number;
  replies: number;
  time: string;
}

const Comment = ({ author, content, likes, replies, time }: CommentProps) => {
  const initials = author.split(" ").map(n => n[0]).join("");
  
  return (
    <div className="flex gap-3 p-4 hover:bg-muted/30 rounded-lg transition-colors dark:hover:bg-muted/20">
      <Avatar className="h-10 w-10 dark:ring-2 dark:ring-neon-teal/30">
        <AvatarFallback className="bg-primary text-primary-foreground dark:bg-neon-teal dark:text-background">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm dark:text-neon-teal">{author}</span>
          <span className="text-xs text-muted-foreground">• {time}</span>
        </div>
        <p className="text-sm text-foreground/90">{content}</p>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs dark:hover:text-neon-teal">
            <ThumbsUp className="h-3 w-3 mr-1" />
            {likes}
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs dark:hover:text-neon-violet">
            <Reply className="h-3 w-3 mr-1" />
            {replies}
          </Button>
        </div>
      </div>
    </div>
  );
};

export const CommunitySection = () => {
  const discussions = [
    {
      author: "Rafiul Hasan",
      content: "Anyone has complete notes for CSE 101? Need them urgently for finals!",
      likes: 24,
      replies: 8,
      time: "2h ago"
    },
    {
      author: "Taslima Akter",
      content: "Just uploaded my Engineering Math notes. Check them out! Really helpful for semester exams.",
      likes: 45,
      replies: 12,
      time: "5h ago"
    },
    {
      author: "Mehedi Chowdhury",
      content: "Does anyone know where I can find good Physics lab reports for DU?",
      likes: 18,
      replies: 5,
      time: "1d ago"
    },
    {
      author: "Sadia Noor",
      content: "Thanks to everyone who contributed to the Chemistry notes collection! You guys are amazing! 🎉",
      likes: 67,
      replies: 15,
      time: "2d ago"
    },
  ];

  return (
    <section id="community" className="mb-8">
      <Card className="bg-gradient-card dark:border-neon-blue/30 dark:shadow-glow-blue">
        <div className="p-4 border-b border-border dark:border-neon-blue/20">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary dark:text-neon-blue" />
            <h2 className="font-bold text-lg dark:text-neon-blue">Student & Nilkhet Community</h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1 dark:text-foreground/60">
            Connect, share, and learn together
          </p>
        </div>
        <div className="divide-y divide-border dark:divide-neon-blue/20">
          {discussions.map((discussion, index) => (
            <Comment key={index} {...discussion} />
          ))}
        </div>
      </Card>
    </section>
  );
};
