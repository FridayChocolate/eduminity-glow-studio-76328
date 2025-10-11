import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Eye, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Community = () => {
  const navigate = useNavigate();
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);

  const { data: boards } = useQuery({
    queryKey: ["discussion-boards"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("discussion_boards")
        .select("*")
        .order("subject");
      if (error) throw error;
      return data;
    },
  });

  const { data: discussions, isLoading } = useQuery({
    queryKey: ["discussions", selectedBoard],
    queryFn: async () => {
      let query = supabase
        .from("discussions")
        .select("*")
        .order("created_at", { ascending: false });

      if (selectedBoard) {
        query = query.eq("board_id", selectedBoard);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Fetch profiles separately
      const userIds = [...new Set(data?.map(d => d.user_id))];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", userIds);

      // Fetch reply counts
      const { data: replyCounts } = await supabase
        .from("discussion_replies")
        .select("discussion_id")
        .in("discussion_id", data?.map(d => d.id) || []);

      // Combine data
      const discussionsWithDetails = data?.map(d => ({
        ...d,
        profiles: profilesData?.find(p => p.id === d.user_id),
        replyCount: replyCounts?.filter(r => r.discussion_id === d.id).length || 0,
      }));

      return discussionsWithDetails;
    },
  });

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background pt-20 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-teal via-neon-violet to-neon-magenta bg-clip-text text-transparent mb-2">
              Community Discussions
            </h1>
            <p className="text-muted-foreground">Connect with students, share knowledge, and learn together</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {/* Discussion Boards Sidebar */}
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Discussion Boards</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant={!selectedBoard ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedBoard(null)}
                  >
                    All Discussions
                  </Button>
                  {boards?.map((board) => (
                    <Button
                      key={board.id}
                      variant={selectedBoard === board.id ? "default" : "ghost"}
                      className="w-full justify-start gap-2"
                      onClick={() => setSelectedBoard(board.id)}
                    >
                      <span>{board.icon}</span>
                      <span>{board.subject}</span>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Discussions List */}
            <div className="md:col-span-3">
              <Tabs defaultValue="recent">
                <TabsList className="mb-4">
                  <TabsTrigger value="recent">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Recent
                  </TabsTrigger>
                  <TabsTrigger value="popular">
                    <Eye className="h-4 w-4 mr-2" />
                    Popular
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="recent" className="space-y-4">
                  {isLoading ? (
                    <div className="space-y-4">
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
                    discussions?.map((discussion) => (
                      <Card
                        key={discussion.id}
                        className="hover:shadow-lg transition-shadow cursor-pointer border-border/50 hover:border-neon-teal/50"
                        onClick={() => navigate(`/discussions/${discussion.id}`)}
                      >
                        <CardHeader>
                          <CardTitle className="text-xl">{discussion.title}</CardTitle>
                          <CardDescription className="line-clamp-2">
                            {discussion.content}
                          </CardDescription>
                          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <img
                                src={discussion.profiles?.avatar_url || "/placeholder.svg"}
                                alt="User"
                                className="h-6 w-6 rounded-full"
                              />
                              <span>{discussion.profiles?.full_name || "Anonymous"}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <MessageCircle className="h-4 w-4" />
                                <span>{discussion.replyCount} replies</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                <span>{discussion.views} views</span>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="popular" className="space-y-4">
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      Popular discussions coming soon!
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Community;