import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, Upload, ArrowLeft, Award, Star, MessageSquare, 
  CheckCircle2, Clock, BookOpen, Target, TrendingUp, HelpCircle
} from "lucide-react";
import { Header } from "@/components/Header";

// Reputation levels
const reputationLevels = [
  { name: "Newcomer", minPoints: 0, color: "from-gray-400 to-gray-500", icon: "🌱" },
  { name: "Rising Star", minPoints: 100, color: "from-neon-teal to-cyan-500", icon: "⭐" },
  { name: "Trusted", minPoints: 500, color: "from-neon-violet to-purple-500", icon: "🏆" },
  { name: "Expert", minPoints: 1500, color: "from-neon-magenta to-pink-500", icon: "💎" },
  { name: "Master", minPoints: 5000, color: "from-yellow-500 to-orange-500", icon: "👑" },
];

// Demo milestones
const milestones = [
  { title: "First Upload", description: "Uploaded your first study material", completed: true, date: "Oct 2024" },
  { title: "10 Downloads", description: "Your materials reached 10 downloads", completed: true, date: "Nov 2024" },
  { title: "First Sale", description: "Made your first premium sale", completed: true, date: "Nov 2024" },
  { title: "Top Rated", description: "Received a 5-star rating", completed: true, date: "Dec 2024" },
  { title: "100 Downloads", description: "Your materials reached 100 downloads", completed: false, date: null },
  { title: "Verified Expert", description: "Become a verified contributor", completed: false, date: null },
];

// Demo expertise
const expertiseAreas = [
  { subject: "Physics", level: 85, questionsAnswered: 24 },
  { subject: "Mathematics", level: 72, questionsAnswered: 18 },
  { subject: "Chemistry", level: 65, questionsAnswered: 12 },
];

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeRole, setActiveRole] = useState<"student" | "contributor">("student");
  
  // Demo stats
  const [stats] = useState({
    reputationPoints: 847,
    responseRate: 94,
    avgRating: 4.8,
    totalReviews: 156,
  });

  const [formData, setFormData] = useState({
    full_name: "",
    bio: "",
    phone: "",
    location: "",
    avatar_url: "",
  });

  // Get current reputation level
  const currentLevel = [...reputationLevels].reverse().find(l => stats.reputationPoints >= l.minPoints) || reputationLevels[0];
  const nextLevel = reputationLevels.find(l => l.minPoints > stats.reputationPoints);
  const progressToNext = nextLevel 
    ? ((stats.reputationPoints - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
    : 100;

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) {
      setFormData({
        full_name: data.full_name || "",
        bio: data.bio || "",
        phone: data.phone || "",
        location: data.location || "",
        avatar_url: data.avatar_url || "",
      });
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !user) return;
    
    setUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) {
      toast({
        title: "Upload failed",
        description: uploadError.message,
        variant: "destructive",
      });
    } else {
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      setFormData({ ...formData, avatar_url: data.publicUrl });
      toast({
        title: "Success",
        description: "Avatar uploaded successfully!",
      });
    }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        ...formData,
        profile_completed: true,
      });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    }
    setLoading(false);
  };

  return (
    <TooltipProvider>
      <Header />
      <div className="min-h-screen bg-background pt-20 px-4 md:px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-neon-teal via-neon-violet to-neon-magenta bg-clip-text text-transparent">
              My Profile
            </h1>
            
            <div className="flex items-center gap-2">
              <Label className="text-sm text-muted-foreground">Status:</Label>
              <Select value={activeRole} onValueChange={(value: "student" | "contributor") => setActiveRole(value)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="contributor">Contributor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center gap-4">
                      <Avatar className="h-28 w-28 md:h-32 md:w-32">
                        <AvatarImage src={formData.avatar_url} />
                        <AvatarFallback className="text-2xl">
                          {formData.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={uploading}
                        onClick={() => document.getElementById('avatar-upload')?.click()}
                      >
                        {uploading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="mr-2 h-4 w-4" />
                        )}
                        Change
                      </Button>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                    </div>

                    {/* Profile Fields */}
                    <div className="flex-1 grid gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="full_name">Full Name</Label>
                          <Input
                            id="full_name"
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            placeholder="Enter your full name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            value={user?.email || ""}
                            disabled
                            className="bg-muted"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="Enter your phone number"
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            placeholder="Enter your location"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          placeholder="Tell us about yourself"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full mt-6 bg-gradient-to-r from-neon-teal to-neon-violet hover:opacity-90"
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Subject Expertise */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BookOpen className="h-5 w-5 text-neon-violet" />
                    Subject Expertise
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Your expertise is based on Q&A activity and material ratings</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {expertiseAreas.map((area, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{area.subject}</span>
                        <span className="text-xs text-muted-foreground">{area.questionsAnswered} questions answered</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={area.level} className="flex-1 h-2" />
                        <span className="text-xs text-neon-teal w-10 text-right">{area.level}%</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Milestones Timeline */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="h-5 w-5 text-neon-magenta" />
                    Contributor Milestones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {milestones.map((milestone, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          milestone.completed 
                            ? 'bg-green-500/20' 
                            : 'bg-muted'
                        }`}>
                          {milestone.completed ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <Clock className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className={`text-sm font-medium ${!milestone.completed && 'text-muted-foreground'}`}>
                              {milestone.title}
                            </h4>
                            {milestone.date && (
                              <span className="text-xs text-muted-foreground">{milestone.date}</span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{milestone.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Stats */}
            <div className="space-y-6">
              {/* Reputation Card */}
              <Card className="border-border/50 overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${currentLevel.color}`} />
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Award className="h-5 w-5 text-neon-teal" />
                    Reputation Level
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">{currentLevel.icon}</div>
                    <Badge className={`bg-gradient-to-r ${currentLevel.color} text-white`}>
                      {currentLevel.name}
                    </Badge>
                    <p className="text-2xl font-bold mt-2">{stats.reputationPoints}</p>
                    <p className="text-xs text-muted-foreground">reputation points</p>
                  </div>
                  
                  {nextLevel && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>Progress to {nextLevel.name}</span>
                        <span>{nextLevel.minPoints - stats.reputationPoints} points to go</span>
                      </div>
                      <Progress value={progressToNext} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Stats Cards */}
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5 text-neon-violet" />
                    Performance Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-neon-teal" />
                      <span className="text-sm">Response Rate</span>
                    </div>
                    <span className="font-semibold text-neon-teal">{stats.responseRate}%</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">Avg Rating</span>
                    </div>
                    <span className="font-semibold text-yellow-500">{stats.avgRating} ★</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Total Reviews</span>
                    </div>
                    <span className="font-semibold text-green-500">{stats.totalReviews}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate("/dashboard")}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Dashboard
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate("/materials")}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Materials
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate("/questions")}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Answer Questions
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Profile;
