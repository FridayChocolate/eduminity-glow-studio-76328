import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Briefcase, Clock, DollarSign } from "lucide-react";
import { CreateWorkRequestDialog } from "./work/CreateWorkRequestDialog";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type WorkRequest = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  budget: string | null;
  subject: string | null;
  deadline: string | null;
  status: string;
  created_at: string;
  profile?: {
    id: string;
    full_name: string | null;
  };
};

export const WorkCommunity = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { user } = useAuth();

  const { data: workRequests, isLoading } = useQuery<WorkRequest[]>({
    queryKey: ["work-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("work_requests")
        .select("*")
        .eq("status", "open")
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) throw error;
      
      // Fetch profiles separately
      if (data && data.length > 0) {
        const userIds = data.map(req => req.user_id);
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", userIds);

        return data.map(req => ({
          ...req,
          profile: profiles?.find(p => p.id === req.user_id)
        })) as WorkRequest[];
      }
      
      return data as WorkRequest[];
    },
  });

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold dark:text-neon-violet">Work Community</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Find work opportunities or hire students for your projects
          </p>
        </div>
        {user && (
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="dark:bg-neon-violet/20 dark:border-neon-violet dark:hover:bg-neon-violet/30"
          >
            <Plus className="mr-2 h-4 w-4" />
            Post Work Request
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-6 animate-pulse bg-muted" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workRequests?.map((request) => (
            <Card
              key={request.id}
              className="p-6 hover:shadow-lg transition-all dark:border-neon-violet/30 dark:hover:border-neon-violet dark:hover:shadow-glow-violet"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/10 dark:bg-neon-violet/20">
                  <Briefcase className="h-5 w-5 text-primary dark:text-neon-violet" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{request.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {request.description}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Budget:</span>
                  <span className="font-medium">{request.budget || "Negotiable"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Deadline:</span>
                  <span className="font-medium">{request.deadline || "Flexible"}</span>
                </div>
                {request.subject && (
                  <div className="inline-block px-3 py-1 rounded-full text-xs bg-primary/10 dark:bg-neon-teal/20 text-primary dark:text-neon-teal">
                    {request.subject}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Posted by <span className="font-medium">{request.profile?.full_name || "Anonymous"}</span>
                </p>
              </div>

              <Button className="w-full mt-4" variant="outline">
                View Details
              </Button>
            </Card>
          ))}
        </div>
      )}

      {user && (
        <CreateWorkRequestDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
        />
      )}
    </section>
  );
};
