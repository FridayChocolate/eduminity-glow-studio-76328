import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Briefcase, Clock, DollarSign, Search, Filter } from "lucide-react";
import { CreateWorkRequestDialog } from "./work/CreateWorkRequestDialog";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type WorkRequest = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  budget: string | null;
  subject: string | null;
  deadline: string | null;
  status: string;
  work_type: string | null;
  payment_status: string | null;
  payment_amount: number | null;
  created_at: string;
  profile?: {
    id: string;
    full_name: string | null;
  };
};

const WORK_CATEGORIES = [
  "All",
  "Assignment Help",
  "Practical Help",
  "Lab Report Help",
  "Exam Preparation",
  "Project Work",
  "Research Help",
  "Other"
];

export const WorkCommunity = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
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

  // Filter work requests based on search and category
  const filteredRequests = workRequests?.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || request.work_type === selectedCategory;
    return matchesSearch && matchesCategory;
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

      {/* Search and Filter Section */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search work requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-[200px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {WORK_CATEGORIES.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-6 animate-pulse bg-muted" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests && filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
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
                {request.work_type && (
                  <Badge variant="secondary" className="mb-2">
                    {request.work_type}
                  </Badge>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Budget:</span>
                  <span className="font-medium">
                    {request.payment_amount 
                      ? `৳${request.payment_amount.toFixed(2)}` 
                      : request.budget || "Negotiable"}
                  </span>
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
                {request.payment_status && request.payment_status !== 'pending' && (
                  <Badge 
                    variant={request.payment_status === 'completed' ? 'default' : 'outline'}
                    className="mt-2"
                  >
                    Payment: {request.payment_status}
                  </Badge>
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
          ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No work requests found matching your criteria.</p>
            </div>
          )}
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
