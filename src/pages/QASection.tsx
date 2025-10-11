import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Plus, Search, Star, Coins } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { CreateQuestionDialog } from "@/components/qa/CreateQuestionDialog";
import { useNavigate } from "react-router-dom";

const QASection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { data: questions, isLoading } = useQuery({
    queryKey: ["questions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .eq("is_private", false)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch profiles separately
      const userIds = [...new Set(data?.map(q => q.user_id))];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", userIds);

      // Fetch answer counts
      const { data: answerCounts } = await supabase
        .from("answers")
        .select("question_id")
        .in("question_id", data?.map(q => q.id) || []);

      // Combine data
      const questionsWithDetails = data?.map(q => ({
        ...q,
        profiles: profilesData?.find(p => p.id === q.user_id),
        answerCount: answerCounts?.filter(a => a.question_id === q.id).length || 0,
      }));

      return questionsWithDetails;
    },
  });

  const filteredQuestions = questions?.filter((q) => {
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = filterSubject === "all" || q.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background pt-20 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-teal via-neon-violet to-neon-magenta bg-clip-text text-transparent mb-2">
                Homework Help & Q&A
              </h1>
              <p className="text-muted-foreground">Ask questions, get expert answers from verified tutors</p>
            </div>
            <Button
              onClick={() => user ? setShowCreateDialog(true) : navigate("/auth")}
              className="bg-gradient-to-r from-neon-teal to-neon-violet hover:opacity-90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Ask Question
            </Button>
          </div>

          <div className="flex gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterSubject} onValueChange={setFilterSubject}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Science">Science</SelectItem>
                <SelectItem value="Literature">Literature</SelectItem>
                <SelectItem value="History">History</SelectItem>
                <SelectItem value="ICT">ICT</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredQuestions?.map((question) => (
                <Card
                  key={question.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer border-border/50 hover:border-neon-teal/50"
                  onClick={() => navigate(`/questions/${question.id}`)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="border-neon-teal text-neon-teal">
                            {question.subject}
                          </Badge>
                          {question.coin_reward > 0 && (
                            <Badge variant="secondary" className="gap-1">
                              <Coins className="h-3 w-3" />
                              {question.coin_reward} coins
                            </Badge>
                          )}
                          <Badge
                            variant={question.status === "open" ? "default" : "secondary"}
                          >
                            {question.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl mb-2">{question.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {question.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <img
                          src={question.profiles?.avatar_url || "/placeholder.svg"}
                          alt="User"
                          className="h-6 w-6 rounded-full"
                        />
                        <span>{question.profiles?.full_name || "Anonymous"}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{question.answerCount || 0} answers</span>
                        </div>
                        <span>{new Date(question.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateQuestionDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </>
  );
};

export default QASection;