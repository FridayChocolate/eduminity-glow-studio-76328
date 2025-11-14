import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, ArrowLeft, Award, Trophy, Star } from "lucide-react";
import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeRole, setActiveRole] = useState<"student" | "contributor">("student");
  
  const [formData, setFormData] = useState({
    full_name: "",
    bio: "",
    phone: "",
    location: "",
    avatar_url: "",
  });

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
    <>
      <Header />
      <div className="min-h-screen bg-background pt-20 px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-teal via-neon-violet to-neon-magenta bg-clip-text text-transparent">
              My Profile
            </h1>
            
            <div className="flex items-center gap-2">
              <Label>Status:</Label>
              <Select value={activeRole} onValueChange={(value: "student" | "contributor") => setActiveRole(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="contributor">Contributor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card className="p-8 bg-gradient-card dark:border-neon-teal/30">
            <div className="space-y-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={formData.avatar_url} />
                  <AvatarFallback className="text-2xl">
                    {formData.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex gap-2">
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
                    Change Picture
                  </Button>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </div>
              </div>

              {/* Profile Fields */}
              <div className="grid gap-4">
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

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about yourself"
                    rows={4}
                  />
                </div>
              </div>

              {/* Save Button */}
              <Button
                onClick={handleSave}
                disabled={loading}
                className="w-full"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Profile
              </Button>
            </div>
          </Card>

          {/* Achievements Section */}
          <Card className="p-6 bg-gradient-card dark:border-neon-teal/30 dark:shadow-glow-teal mt-6">
            <div className="flex items-center gap-2 mb-6">
              <Award className="h-6 w-6 text-neon-teal" />
              <h2 className="text-2xl font-bold dark:text-neon-teal">Achievements & Badges</h2>
            </div>
            
            <div className="space-y-6">
              {/* Leaderboard Position */}
              <div className="flex items-center justify-between p-4 bg-muted/30 dark:bg-muted/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <Trophy className="h-8 w-8 text-accent dark:text-neon-violet" />
                  <div>
                    <p className="font-semibold">Leaderboard Position</p>
                    <p className="text-sm text-muted-foreground dark:text-foreground/60">Your current rank</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  #--
                </Badge>
              </div>

              {/* Points Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/30 dark:bg-muted/20 rounded-lg text-center">
                  <Star className="h-6 w-6 text-neon-teal mx-auto mb-2" />
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground dark:text-foreground/60">Total Points</p>
                </div>
                <div className="p-4 bg-muted/30 dark:bg-muted/20 rounded-lg text-center">
                  <Award className="h-6 w-6 text-neon-magenta mx-auto mb-2" />
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground dark:text-foreground/60">Badges Earned</p>
                </div>
                <div className="p-4 bg-muted/30 dark:bg-muted/20 rounded-lg text-center">
                  <Trophy className="h-6 w-6 text-neon-violet mx-auto mb-2" />
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground dark:text-foreground/60">Contributions</p>
                </div>
              </div>

              {/* Earned Badges */}
              <div>
                <h3 className="font-semibold mb-3">Earned Badges</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 bg-muted/20 dark:bg-muted/10 rounded-lg text-center opacity-50">
                    <Award className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">No badges yet</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Profile;
