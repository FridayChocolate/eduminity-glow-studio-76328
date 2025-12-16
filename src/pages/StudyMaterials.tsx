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
import { Search, Upload, Eye, Download, Star, Lock, Play, Clock, BookOpen, GraduationCap, Sparkles, Bookmark } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

// Content type configurations
const contentTypes = {
  "quick-summary": { label: "Quick Summary", icon: Sparkles, color: "bg-neon-teal/20 text-neon-teal border-neon-teal/30" },
  "exam-notes": { label: "Exam Notes", icon: GraduationCap, color: "bg-neon-magenta/20 text-neon-magenta border-neon-magenta/30" },
  "concept-guide": { label: "Concept Guide", icon: BookOpen, color: "bg-neon-violet/20 text-neon-violet border-neon-violet/30" },
};

const learningIntents = {
  "beginner": { label: "Beginner Friendly", color: "bg-green-500/20 text-green-500" },
  "revision": { label: "Quick Revision", color: "bg-yellow-500/20 text-yellow-500" },
  "advanced": { label: "Advanced", color: "bg-orange-500/20 text-orange-500" },
};

// Function to estimate study time based on content
const getEstimatedTime = (index: number) => {
  const times = ["5 min", "10 min", "15 min", "20 min", "30 min", "45 min"];
  return times[index % times.length];
};

// Function to get content type based on index
const getContentType = (index: number): keyof typeof contentTypes => {
  const types: (keyof typeof contentTypes)[] = ["quick-summary", "exam-notes", "concept-guide"];
  return types[index % types.length];
};

// Function to get learning intent based on index
const getLearningIntent = (index: number): keyof typeof learningIntents => {
  const intents: (keyof typeof learningIntents)[] = ["beginner", "revision", "advanced"];
  return intents[index % intents.length];
};

const StudyMaterials = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterContentType, setFilterContentType] = useState("all");

  const { data: categories } = useQuery({
    queryKey: ["material-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("material_categories")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: materials, isLoading } = useQuery({
    queryKey: ["study-materials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("study_materials")
        .select(`
          *,
          profiles!study_materials_user_id_fkey (full_name, avatar_url),
          material_categories (name, icon, color),
          material_reviews (rating)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const filteredMaterials = materials?.filter((m) => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || m.category_id === filterCategory;
    const matchesType = filterType === "all" ||
      (filterType === "free" && m.is_free) ||
      (filterType === "premium" && !m.is_free);
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <TooltipProvider>
      <Header />
      <div className="min-h-screen bg-background pt-20 px-4 md:px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-neon-teal via-neon-violet to-neon-magenta bg-clip-text text-transparent mb-2">
                Study Materials Hub
              </h1>
              <p className="text-muted-foreground">Quick summaries, exam notes, and concept guides</p>
            </div>
            {user && (
              <Button
                onClick={() => navigate("/upload-material")}
                className="bg-gradient-to-r from-neon-teal to-neon-violet hover:opacity-90"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Material
              </Button>
            )}
          </div>

          {/* Content Type Pills */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            <Button
              variant={filterContentType === "all" ? "default" : "outline"}
              onClick={() => setFilterContentType("all")}
              className="whitespace-nowrap"
              size="sm"
            >
              All Types
            </Button>
            {Object.entries(contentTypes).map(([key, config]) => (
              <Button
                key={key}
                variant={filterContentType === key ? "default" : "outline"}
                onClick={() => setFilterContentType(key)}
                className="whitespace-nowrap gap-2"
                size="sm"
              >
                <config.icon className="h-3.5 w-3.5" />
                {config.label}
              </Button>
            ))}
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <Button
              variant={filterCategory === "all" ? "default" : "outline"}
              onClick={() => setFilterCategory("all")}
              className="whitespace-nowrap"
              size="sm"
            >
              All Categories
            </Button>
            {categories?.map((cat) => (
              <Button
                key={cat.id}
                variant={filterCategory === cat.id ? "default" : "outline"}
                onClick={() => setFilterCategory(cat.id)}
                className="whitespace-nowrap gap-2"
                size="sm"
                style={{
                  borderColor: filterCategory === cat.id ? cat.color : undefined,
                }}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </Button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search study materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Materials Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-muted" />
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : filteredMaterials?.length === 0 ? (
            <Card className="p-12 text-center border-dashed">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No materials found</h3>
              <p className="text-muted-foreground mb-4">Be the first to upload materials in this category!</p>
              {user && (
                <Button onClick={() => navigate("/upload-material")}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Material
                </Button>
              )}
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMaterials?.map((material, index) => {
                const contentType = getContentType(index);
                const contentConfig = contentTypes[contentType];
                const learningIntent = getLearningIntent(index);
                const intentConfig = learningIntents[learningIntent];
                const estimatedTime = getEstimatedTime(index);

                return (
                  <Card
                    key={material.id}
                    className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-border/50 hover:border-neon-teal/50 overflow-hidden hover:-translate-y-1"
                    onClick={() => navigate(`/materials/${material.id}`)}
                  >
                    <div
                      className="h-44 relative bg-gradient-to-br from-neon-teal/20 to-neon-violet/20 flex items-center justify-center"
                      style={{
                        backgroundColor: material.material_categories?.color + "20",
                      }}
                    >
                      <div className="text-5xl">{material.material_categories?.icon || "📚"}</div>
                      
                      {/* Content Type Badge */}
                      <div className="absolute top-2 left-2">
                        <Badge variant="outline" className={`${contentConfig.color} gap-1 text-[10px]`}>
                          <contentConfig.icon className="h-3 w-3" />
                          {contentConfig.label}
                        </Badge>
                      </div>

                      {/* Premium Lock */}
                      {!material.is_free && (
                        <div className="absolute top-2 right-2">
                          <Tooltip>
                            <TooltipTrigger>
                              <Lock className="h-5 w-5 text-neon-magenta" />
                            </TooltipTrigger>
                            <TooltipContent>Premium content</TooltipContent>
                          </Tooltip>
                        </div>
                      )}

                      {/* Video Indicator */}
                      {material.video_url && (
                        <div className="absolute bottom-2 right-2">
                          <Badge variant="secondary" className="gap-1">
                            <Play className="h-3 w-3" />
                            Video
                          </Badge>
                        </div>
                      )}

                      {/* Bookmark Button */}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 bg-background/80 hover:bg-background"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Bookmark functionality
                        }}
                      >
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>

                    <CardHeader className="p-4">
                      {/* Top Row: Category + Price */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <Badge
                          variant="outline"
                          className="text-[10px]"
                          style={{
                            borderColor: material.material_categories?.color,
                            color: material.material_categories?.color,
                          }}
                        >
                          {material.material_categories?.name}
                        </Badge>
                        <Badge variant={material.is_free ? "secondary" : "default"} className="text-xs">
                          {material.is_free ? "FREE" : `৳${material.price}`}
                        </Badge>
                      </div>

                      {/* Title */}
                      <CardTitle className="text-base line-clamp-2 mb-1">{material.title}</CardTitle>
                      
                      {/* Description */}
                      <CardDescription className="line-clamp-2 text-xs">
                        {material.description}
                      </CardDescription>

                      {/* Learning Intent + Study Time */}
                      <div className="flex items-center gap-2 mt-3">
                        <Badge variant="secondary" className={`${intentConfig.color} text-[10px]`}>
                          {intentConfig.label}
                        </Badge>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {estimatedTime}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>Estimated study time</TooltipContent>
                        </Tooltip>
                      </div>

                      {/* Stats Row */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="flex items-center gap-1">
                                <Eye className="h-3.5 w-3.5" />
                                {material.views}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>Views</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="flex items-center gap-1">
                                <Download className="h-3.5 w-3.5" />
                                {material.downloads}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>Downloads</TooltipContent>
                          </Tooltip>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                          <span className="font-medium">{material.rating.toFixed(1)}</span>
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
    </TooltipProvider>
  );
};

export default StudyMaterials;
