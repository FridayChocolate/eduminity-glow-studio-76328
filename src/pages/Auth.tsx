import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentSignupForm } from "@/components/auth/StudentSignupForm";
import { ContributorSignupForm } from "@/components/auth/ContributorSignupForm";
import { LoginForm } from "@/components/auth/LoginForm";
import { LoginMonster } from "@/components/auth/LoginMonster";
import { useAuth } from "@/hooks/useAuth";

const Auth = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("login");

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 font-['Inter']">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <LoginMonster />
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-neon-teal via-neon-violet to-neon-magenta bg-clip-text text-transparent dark:text-transparent">
            Welcome to Eduminity
          </h1>
          <p className="text-muted-foreground">Empowering Students Through Shared Knowledge</p>
        </div>

        <Card className="p-8 bg-gradient-card dark:border-neon-teal/30 dark:shadow-glow-teal">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="student">Join as Student</TabsTrigger>
              <TabsTrigger value="contributor">Join as Contributor</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <LoginForm />
            </TabsContent>

            <TabsContent value="student">
              <StudentSignupForm onSuccess={() => navigate("/")} />
            </TabsContent>

            <TabsContent value="contributor">
              <ContributorSignupForm onSuccess={() => navigate("/")} />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
