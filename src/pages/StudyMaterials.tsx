import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Upload, Eye, Download, Star, Lock, Play } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const StudyMaterials = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all");

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
    <>
      <Header />
      <div className="min-h-screen bg-background pt-20 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-teal via-neon-violet to-neon-magenta bg-clip-text text-transparent mb-2">
                Study Materials Hub
              </h1>
              <p className="text-muted-foreground">Quick summaries, notes, and study guides</p>
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

          {/* Category Pills */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <Button
              variant={filterCategory === "all" ? "default" : "outline"}
              onClick={() => setFilterCategory("all")}
              className="whitespace-nowrap"
            >
              All Categories
            </Button>
            {categories?.map((cat) => (
              <Button
                key={cat.id}
                variant={filterCategory === cat.id ? "default" : "outline"}
                onClick={() => setFilterCategory(cat.id)}
                className="whitespace-nowrap gap-2"
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
              <SelectTrigger className="w-[200px]">
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
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMaterials?.map((material) => (
                <Card
                  key={material.id}
                  className="group hover:shadow-xl transition-all cursor-pointer border-border/50 hover:border-neon-teal/50 overflow-hidden"
                  onClick={() => navigate(`/materials/${material.id}`)}
                >
                  <div
                    className="h-48 relative bg-gradient-to-br from-neon-teal/20 to-neon-violet/20 flex items-center justify-center"
                    style={{
                      backgroundColor: material.material_categories?.color + "20",
                    }}
                  >
                    <div className="text-6xl">{material.material_categories?.icon || "📚"}</div>
                    {!material.is_free && (
                      <div className="absolute top-2 right-2">
                        <Lock className="h-5 w-5 text-neon-magenta" />
                      </div>
                    )}
                    {material.video_url && (
                      <div className="absolute bottom-2 right-2">
                        <Play className="h-6 w-6 text-neon-teal" />
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge
                        variant="outline"
                        className="text-xs"
                        style={{
                          borderColor: material.material_categories?.color,
                          color: material.material_categories?.color,
                        }}
                      >
                        {material.material_categories?.name}
                      </Badge>
                      <Badge variant={material.is_free ? "secondary" : "default"}>
                        {material.is_free ? "FREE" : `৳${material.price}`}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{material.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {material.description}
                    </CardDescription>
                    <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {material.views}
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="h-4 w-4" />
                          {material.downloads}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          {material.rating.toFixed(1)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StudyMaterials;