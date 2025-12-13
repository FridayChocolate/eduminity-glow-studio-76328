import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Send, Loader2, Sparkles, Trash2, Maximize2, Minimize2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const suggestedQuestions = [
  "How do I upload study materials?",
  "How can I earn coins?",
  "What are premium features?",
  "How to ask questions?",
];

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! 👋 I'm your Eduminity AI assistant powered by advanced AI. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const clearChat = () => {
    setMessages([
      { role: "assistant", content: "Hi! 👋 I'm your Eduminity AI assistant powered by advanced AI. How can I help you today?" }
    ]);
  };

  const streamChat = async (userMessage: string) => {
    const newMessages = [...messages, { role: "user" as const, content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (response.status === 429) {
        toast({
          title: "Rate Limit",
          description: "Too many requests. Please try again later.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (response.status === 402) {
        toast({
          title: "Service Unavailable",
          description: "AI service requires payment. Please contact support.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (!response.ok || !response.body) {
        throw new Error("Failed to start stream");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;
      let assistantMessage = "";

      // Add empty assistant message
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantMessage += content;
              setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = { role: "assistant", content: assistantMessage };
                return newMessages;
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    await streamChat(userMessage);
  };

  const handleSuggestedQuestion = (question: string) => {
    if (isLoading) return;
    streamChat(question);
  };

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className={cn(
          "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 transition-all duration-300",
          "bg-gradient-to-r from-neon-violet to-neon-magenta hover:opacity-90",
          "dark:shadow-[0_0_20px_rgba(139,92,246,0.5)]",
          isOpen && "rotate-180"
        )}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card 
          className={cn(
            "fixed shadow-2xl z-50 flex flex-col transition-all duration-300",
            "dark:border-neon-violet/30 dark:shadow-[0_0_30px_rgba(139,92,246,0.2)]",
            isExpanded 
              ? "bottom-6 right-6 left-6 top-6 md:left-auto md:top-auto md:w-[600px] md:h-[700px]" 
              : "bottom-24 right-6 w-96 h-[550px]"
          )}
        >
          <CardHeader className="border-b border-border bg-gradient-to-r from-neon-violet/10 to-neon-magenta/10 rounded-t-lg">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <div className="relative">
                  <Sparkles className="h-5 w-5 text-neon-violet" />
                  <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                </div>
                <span className="bg-gradient-to-r from-neon-violet to-neon-magenta bg-clip-text text-transparent font-bold">
                  Eduminity AI
                </span>
                <Badge variant="secondary" className="text-xs ml-2">
                  Powered by Gemini
                </Badge>
              </CardTitle>
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={clearChat}
                  title="Clear chat"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? "Minimize" : "Expand"}
                >
                  {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
            <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-4 py-3 text-sm",
                        message.role === "user"
                          ? "bg-gradient-to-r from-neon-violet to-neon-magenta text-white rounded-br-sm"
                          : "bg-muted text-foreground rounded-bl-sm"
                      )}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {isLoading && messages[messages.length - 1]?.content === "" && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-neon-violet" />
                        <span className="text-sm text-muted-foreground">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Suggested Questions */}
            {messages.length <= 2 && !isLoading && (
              <div className="px-4 pb-2">
                <p className="text-xs text-muted-foreground mb-2">Suggested questions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((question, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-neon-violet/20 transition-colors text-xs py-1"
                      onClick={() => handleSuggestedQuestion(question)}
                    >
                      {question}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-background/80 backdrop-blur-sm">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything about Eduminity..."
                  disabled={isLoading}
                  className="flex-1 rounded-full bg-muted/50 border-none focus-visible:ring-neon-violet"
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={isLoading || !input.trim()}
                  className="rounded-full bg-gradient-to-r from-neon-violet to-neon-magenta hover:opacity-90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
};
