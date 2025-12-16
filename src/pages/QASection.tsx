import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MessageSquare, Plus, Search, Coins, Clock, CheckCircle2, Award, AlertCircle, Zap, HelpCircle, Bookmark } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { CreateQuestionDialog } from "@/components/qa/CreateQuestionDialog";
import { useNavigate } from "react-router-dom";

// Difficulty configurations
const difficultyLevels = {
  "easy": { label: "Easy", color: "bg-green-500/20 text-green-500 border-green-500/30" },
  "medium": { label: "Medium", color: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30" },
  "hard": { label: "Hard", color: "bg-orange-500/20 text-orange-500 border-orange-500/30" },
  "expert": { label: "Expert", color: "bg-red-500/20 text-red-500 border-red-500/30" },
};

// Function to get difficulty based on coin reward or index
const getDifficulty = (coinReward: number, index: number): keyof typeof difficultyLevels => {
  if (coinReward >= 50) return "expert";
  if (coinReward >= 30) return "hard";
  if (coinReward >= 15) return "medium";
  return "easy";
};

// Response time estimates
const getResponseTime = (answerCount: number) => {
  if (answerCount > 5) return "< 1 hour";
  if (answerCount > 2) return "< 3 hours";
  if (answerCount > 0) return "< 6 hours";
  return "< 12 hours";
};

const QASection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
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

      // Fetch answer counts and check for verified contributors
      const { data: answersData } = await supabase
        .from("answers")
        .select("question_id, is_best_answer, user_id")
        .in("question_id", data?.map(q => q.id) || []);

      // Combine data
      const questionsWithDetails = data?.map(q => ({
        ...q,
        profiles: profilesData?.find(p => p.id === q.user_id),
        answerCount: answersData?.filter(a => a.question_id === q.id).length || 0,
        hasBestAnswer: answersData?.some(a => a.question_id === q.id && a.is_best_answer),
        hasVerifiedAnswer: Math.random() > 0.5, // Demo: randomly show verified
      }));

      return questionsWithDetails;
    },
  });

  const filteredQuestions = questions?.filter((q) => {
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = filterSubject === "all" || q.subject === filterSubject;
    const difficulty = getDifficulty(q.coin_reward, 0);
    const matchesDifficulty = filterDifficulty === "all" || difficulty === filterDifficulty;
    return matchesSearch && matchesSubject && matchesDifficulty;
  });

  return (
    <TooltipProvider>
      <Header />
      <div className="min-h-screen bg-background pt-20 px-4 md:px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-neon-teal via-neon-violet to-neon-magenta bg-clip-text text-transparent mb-2">
                Homework Help & Q&A
              </h1>
              <p className="text-muted-foreground">Ask questions, get expert answers from verified tutors</p>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Typical response time: <span className="text-neon-teal">under 3 hours</span></span>
              </div>
            </div>
            <Button
              onClick={() => user ? setShowCreateDialog(true) : navigate("/auth")}
              className="bg-gradient-to-r from-neon-teal to-neon-violet hover:opacity-90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Ask Question
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
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
              <SelectTrigger className="w-full md:w-[180px]">
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
            <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
              <SelectTrigger className="w-full md:w-[160px]">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {Object.entries(difficultyLevels).map(([key, config]) => (
                  <SelectItem key={key} value={key}>{config.label}</SelectItem>
                ))}
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
          ) : filteredQuestions?.length === 0 ? (
            <Card className="p-12 text-center border-dashed">
              <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No questions found</h3>
              <p className="text-muted-foreground mb-4">Be the first to ask a question in this category!</p>
              <Button onClick={() => user ? setShowCreateDialog(true) : navigate("/auth")}>
                <Plus className="mr-2 h-4 w-4" />
                Ask Question
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredQuestions?.map((question, index) => {
                const difficulty = getDifficulty(question.coin_reward, index);
                const difficultyConfig = difficultyLevels[difficulty];
                const responseTime = getResponseTime(question.answerCount);

                return (
                  <Card
                    key={question.id}
                    className="hover:shadow-lg transition-all duration-300 cursor-pointer border-border/50 hover:border-neon-teal/50 group"
                    onClick={() => navigate(`/questions/${question.id}`)}
                  >
                    <CardHeader className="p-4 md:p-6">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                          {/* Badges Row */}
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <Badge variant="outline" className="border-neon-teal text-neon-teal">
                              {question.subject}
                            </Badge>
                            
                            {/* Difficulty Tag */}
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge variant="outline" className={difficultyConfig.color}>
                                  {difficultyConfig.label}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>Question difficulty level</TooltipContent>
                            </Tooltip>

                            {/* Coin Reward */}
                            {question.coin_reward > 0 && (
                              <Tooltip>
                                <TooltipTrigger>
                                  <Badge variant="secondary" className="gap-1 bg-yellow-500/20 text-yellow-500">
                                    <Coins className="h-3 w-3" />
                                    {question.coin_reward}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>Earn {question.coin_reward} coins for answering</TooltipContent>
                              </Tooltip>
                            )}

                            {/* Status Badge */}
                            <Badge
                              variant={question.status === "open" ? "default" : "secondary"}
                              className={question.status === "open" ? "bg-green-500/20 text-green-500" : ""}
                            >
                              {question.status === "open" ? (
                                <>
                                  <Zap className="h-3 w-3 mr-1" />
                                  Open
                                </>
                              ) : (
                                "Answered"
                              )}
                            </Badge>
                          </div>

                          {/* Title */}
                          <CardTitle className="text-lg md:text-xl mb-2 group-hover:text-neon-teal transition-colors">
                            {question.title}
                          </CardTitle>
                          
                          {/* Description */}
                          <CardDescription className="line-clamp-2">
                            {question.description}
                          </CardDescription>

                          {/* Answer Quality Indicators */}
                          {question.answerCount > 0 && (
                            <div className="flex items-center gap-3 mt-3">
                              {question.hasBestAnswer && (
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Badge className="bg-green-500/20 text-green-500 border-green-500/30 gap-1">
                                      <CheckCircle2 className="h-3 w-3" />
                                      Accepted Answer
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>This question has an accepted answer</TooltipContent>
                                </Tooltip>
                              )}
                              {question.hasVerifiedAnswer && (
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Badge variant="outline" className="bg-neon-violet/10 text-neon-violet border-neon-violet/30 gap-1">
                                      <Award className="h-3 w-3" />
                                      Verified Contributor
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>Answered by a verified contributor</TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Bookmark Button */}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Bookmark functionality
                          }}
                        >
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Footer */}
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mt-4 pt-4 border-t border-border/50 gap-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={question.profiles?.avatar_url || "/placeholder.svg"}
                            alt="User"
                            className="h-6 w-6 rounded-full"
                          />
                          <span className="text-sm text-muted-foreground">
                            {question.profiles?.full_name || "Anonymous"}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                <span>{question.answerCount || 0} answers</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>Number of answers</TooltipContent>
                          </Tooltip>
                          
                          {question.status === "open" && (
                            <Tooltip>
                              <TooltipTrigger>
                                <div className="flex items-center gap-1 text-neon-teal">
                                  <Clock className="h-4 w-4" />
                                  <span>{responseTime}</span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>Expected response time</TooltipContent>
                            </Tooltip>
                          )}
                          
                          <span>{new Date(question.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <CreateQuestionDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </TooltipProvider>
  );
};

export default QASection;
