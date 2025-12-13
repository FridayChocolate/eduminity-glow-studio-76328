import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  PenTool, 
  Save, 
  Eye, 
  Send, 
  Sparkles, 
  FileText, 
  Users, 
  TrendingUp,
  Plus,
  BookMarked,
  Feather,
  Clock,
  Heart
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const featuredStories = [
  {
    id: 1,
    title: "The Last Algorithm",
    author: "Rafiq Ahmed",
    genre: "Sci-Fi",
    reads: 2450,
    likes: 342,
    chapters: 12,
    cover: "🚀"
  },
  {
    id: 2,
    title: "Dhaka Dreams",
    author: "Fatima Begum",
    genre: "Drama",
    reads: 1890,
    likes: 256,
    chapters: 8,
    cover: "🌆"
  },
  {
    id: 3,
    title: "The Physics of Love",
    author: "Karim Hassan",
    genre: "Romance",
    reads: 3200,
    likes: 489,
    chapters: 15,
    cover: "❤️"
  },
  {
    id: 4,
    title: "Bengal Tiger's Journey",
    author: "Salma Khatun",
    genre: "Adventure",
    reads: 1560,
    likes: 198,
    chapters: 10,
    cover: "🐅"
  },
];

const genres = [
  "Fiction", "Non-Fiction", "Sci-Fi", "Fantasy", "Romance", 
  "Mystery", "Horror", "Drama", "Comedy", "Educational"
];

export default function WriteStory() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [genre, setGenre] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSaveDraft = () => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to save your work.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    toast({
      title: "Draft Saved!",
      description: "Your story has been saved as a draft.",
    });
  };

  const handlePublish = () => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to publish.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!title || !content || !genre) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Story Published!",
      description: "Your story is now live for everyone to read.",
    });
  };

  return (
    <>
      <Helmet>
        <title>Write & Publish Stories - Eduminity</title>
        <meta name="description" content="Write and self-publish your stories, books, and creative content on Eduminity. Share your creativity with the community." />
      </Helmet>

      <div className="min-h-screen bg-background flex">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
                  <Feather className="h-8 w-8 text-neon-violet" />
                  Write & Publish
                </h1>
                <p className="text-muted-foreground mt-2">
                  Share your stories with the Eduminity community
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="gap-2">
                  <BookMarked className="h-4 w-4" />
                  My Stories
                </Button>
                <Button className="gap-2 bg-gradient-to-r from-neon-violet to-neon-magenta hover:opacity-90">
                  <Plus className="h-4 w-4" />
                  New Story
                </Button>
              </div>
            </div>

            <Tabs defaultValue="write" className="space-y-6">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="write" className="gap-2">
                  <PenTool className="h-4 w-4" />
                  Write
                </TabsTrigger>
                <TabsTrigger value="browse" className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  Browse
                </TabsTrigger>
                <TabsTrigger value="my-works" className="gap-2">
                  <FileText className="h-4 w-4" />
                  My Works
                </TabsTrigger>
              </TabsList>

              {/* Write Tab */}
              <TabsContent value="write" className="space-y-6">
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Editor */}
                  <div className="lg:col-span-2 space-y-4">
                    <Card className="border-border/50 dark:border-neon-violet/20">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <PenTool className="h-5 w-5 text-neon-violet" />
                            Story Editor
                          </CardTitle>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setIsPreview(!isPreview)}
                              className="gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              {isPreview ? "Edit" : "Preview"}
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Input
                          placeholder="Enter your story title..."
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="text-xl font-semibold"
                        />
                        
                        {!isPreview ? (
                          <Textarea
                            placeholder="Start writing your story here... Let your imagination flow!"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="min-h-[400px] resize-none text-base leading-relaxed"
                          />
                        ) : (
                          <div className="min-h-[400px] p-4 bg-muted/50 rounded-lg prose prose-sm dark:prose-invert max-w-none">
                            <h1 className="text-2xl font-bold mb-4">{title || "Untitled Story"}</h1>
                            <div className="whitespace-pre-wrap">
                              {content || "Your story preview will appear here..."}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {content.split(/\s+/).filter(Boolean).length} words
                          </div>
                          <div className="flex gap-3">
                            <Button variant="outline" onClick={handleSaveDraft} className="gap-2">
                              <Save className="h-4 w-4" />
                              Save Draft
                            </Button>
                            <Button onClick={handlePublish} className="gap-2 bg-gradient-to-r from-neon-teal to-neon-violet hover:opacity-90">
                              <Send className="h-4 w-4" />
                              Publish
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Sidebar - Settings */}
                  <div className="space-y-4">
                    <Card className="border-border/50 dark:border-neon-teal/20">
                      <CardHeader>
                        <CardTitle className="text-base">Story Settings</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Genre</label>
                          <div className="flex flex-wrap gap-2">
                            {genres.slice(0, 6).map((g) => (
                              <Badge
                                key={g}
                                variant={genre === g ? "default" : "outline"}
                                className={`cursor-pointer transition-all ${
                                  genre === g 
                                    ? "bg-neon-violet text-white" 
                                    : "hover:bg-neon-violet/20"
                                }`}
                                onClick={() => setGenre(g)}
                              >
                                {g}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-border/50 dark:border-neon-magenta/20">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-neon-magenta" />
                          AI Writing Assistant
                        </CardTitle>
                        <CardDescription>
                          Get help with your story using AI
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                          <Sparkles className="h-4 w-4" />
                          Generate Ideas
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                          <PenTool className="h-4 w-4" />
                          Improve Writing
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                          <Eye className="h-4 w-4" />
                          Check Grammar
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Browse Tab */}
              <TabsContent value="browse" className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="border-border/50 dark:border-neon-teal/20">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-neon-teal/10">
                          <BookOpen className="h-5 w-5 text-neon-teal" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">1,245</p>
                          <p className="text-xs text-muted-foreground">Total Stories</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-border/50 dark:border-neon-violet/20">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-neon-violet/10">
                          <Users className="h-5 w-5 text-neon-violet" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">342</p>
                          <p className="text-xs text-muted-foreground">Writers</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-border/50 dark:border-neon-magenta/20">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-neon-magenta/10">
                          <TrendingUp className="h-5 w-5 text-neon-magenta" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">89K</p>
                          <p className="text-xs text-muted-foreground">Total Reads</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-border/50 dark:border-neon-teal/20">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-neon-teal/10">
                          <Heart className="h-5 w-5 text-neon-teal" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">12K</p>
                          <p className="text-xs text-muted-foreground">Total Likes</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Featured Stories */}
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-neon-teal" />
                    Featured Stories
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {featuredStories.map((story) => (
                      <Card 
                        key={story.id} 
                        className="border-border/50 hover:border-neon-violet/50 transition-all cursor-pointer group"
                      >
                        <CardContent className="pt-6">
                          <div className="text-4xl mb-3">{story.cover}</div>
                          <h3 className="font-semibold text-foreground group-hover:text-neon-violet transition-colors">
                            {story.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">{story.author}</p>
                          <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                            <Badge variant="secondary" className="text-xs">
                              {story.genre}
                            </Badge>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {story.reads}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              {story.likes}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            {story.chapters} chapters
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Genre Filter */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Browse by Genre</h2>
                  <div className="flex flex-wrap gap-2">
                    {genres.map((g) => (
                      <Badge
                        key={g}
                        variant="outline"
                        className="cursor-pointer hover:bg-neon-violet/20 transition-colors py-2 px-4"
                      >
                        {g}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* My Works Tab */}
              <TabsContent value="my-works">
                <Card className="border-border/50">
                  <CardContent className="pt-12 pb-12 text-center">
                    <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Your Stories Will Appear Here</h3>
                    <p className="text-muted-foreground mb-6">
                      {user ? "Start writing to see your published stories and drafts." : "Login to start writing and managing your stories."}
                    </p>
                    {!user ? (
                      <Button onClick={() => navigate("/auth")} className="gap-2">
                        Login to Get Started
                      </Button>
                    ) : (
                      <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Create Your First Story
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </>
  );
}
